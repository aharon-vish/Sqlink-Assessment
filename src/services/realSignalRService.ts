import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import type { JobSignalRHub, JobProgressUpdate } from '@/types';
import { getServiceConfig } from './serviceConfig';

type ProgressCallback = (update: JobProgressUpdate) => void;
type ConnectionCallback = (state: 'Connected' | 'Disconnected' | 'Connecting') => void;

class RealSignalRService implements JobSignalRHub {
  private connection: HubConnection | null = null;
  private callbacks: ProgressCallback[] = [];
  private connectionCallbacks: ConnectionCallback[] = [];
  private isStarted = false;
  private failedAttempts = 0;
  private maxFailedAttempts = 5;
  private isManuallyDisconnected = false;

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    const config = getServiceConfig();
    
    this.connection = new HubConnectionBuilder()
      .withUrl(config.signalRHubUrl)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Stop auto-reconnect after max failed attempts or if manually disconnected
          if (this.failedAttempts >= this.maxFailedAttempts || this.isManuallyDisconnected) {
            return null; // Stop auto-reconnect
          }
          
          // Exponential backoff: 0, 2, 10, 30 seconds then every 30 seconds
          if (retryContext.previousRetryCount === 0) {
            return 0;
          } else if (retryContext.previousRetryCount === 1) {
            return 2000;
          } else if (retryContext.previousRetryCount === 2) {
            return 10000;
          } else {
            return 30000;
          }
        }
      })
      .build();

    // Set up event handlers
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.connection) return;

    // Handle job progress updates from server
    this.connection.on('JobProgressUpdate', (update: JobProgressUpdate) => {
      this.callbacks.forEach(callback => {
        try {
          callback(update);
        } catch (error) {
          console.error('Error in SignalR progress callback:', error);
        }
      });
    });

    // Handle connection state changes
    this.connection.onclose((error) => {
      console.log('SignalR connection closed:', error);
      if (error) {
        this.failedAttempts++;
        console.log(`SignalR failed attempts: ${this.failedAttempts}/${this.maxFailedAttempts}`);
      }
      this.notifyConnectionState('Disconnected');
    });

    this.connection.onreconnecting((error) => {
      console.log('SignalR reconnecting:', error);
      this.notifyConnectionState('Connecting');
    });

    this.connection.onreconnected((connectionId) => {
      console.log('SignalR reconnected with ID:', connectionId);
      this.failedAttempts = 0; // Reset failed attempts on successful reconnection
      this.notifyConnectionState('Connected');
    });
  }

  async start(): Promise<void> {
    if (!this.connection) {
      throw new Error('SignalR connection not initialized');
    }

    // Check if already connected or connecting
    if (this.connection.state === HubConnectionState.Connected || 
        this.connection.state === HubConnectionState.Connecting ||
        this.connection.state === HubConnectionState.Reconnecting) {
      return;
    }

    try {
      this.isManuallyDisconnected = false; // Reset manual disconnect flag
      this.notifyConnectionState('Connecting');
      await this.connection.start();
      this.isStarted = true;
      this.failedAttempts = 0; // Reset failed attempts on successful connection
      this.notifyConnectionState('Connected');
      console.log('SignalR connected successfully');
    } catch (error) {
      this.isStarted = false;
      this.failedAttempts++;
      this.notifyConnectionState('Disconnected');
      console.error(`Failed to start SignalR connection (attempt ${this.failedAttempts}/${this.maxFailedAttempts}):`, error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.connection) {
      return;
    }

    try {
      this.isManuallyDisconnected = true; // Mark as manually disconnected
      await this.connection.stop();
      this.isStarted = false;
      this.callbacks = [];
      this.connectionCallbacks = [];
      this.notifyConnectionState('Disconnected');
      console.log('SignalR disconnected successfully');
    } catch (error) {
      console.error('Failed to stop SignalR connection:', error);
      throw error;
    }
  }

  onJobProgressUpdate(callback: ProgressCallback): void {
    this.callbacks.push(callback);
  }

  offJobProgressUpdate(): void {
    this.callbacks = [];
  }

  onConnectionStateChanged(callback: ConnectionCallback): void {
    this.connectionCallbacks.push(callback);
  }

  offConnectionStateChanged(): void {
    this.connectionCallbacks = [];
  }

  getConnectionState(): 'Connected' | 'Disconnected' | 'Connecting' {
    if (!this.connection) {
      return 'Disconnected';
    }

    switch (this.connection.state) {
      case HubConnectionState.Connected:
        return 'Connected';
      case HubConnectionState.Connecting:
      case HubConnectionState.Reconnecting:
        return 'Connecting';
      case HubConnectionState.Disconnected:
      case HubConnectionState.Disconnecting:
      default:
        return 'Disconnected';
    }
  }

  private notifyConnectionState(state: 'Connected' | 'Disconnected' | 'Connecting'): void {
    this.connectionCallbacks.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('Error in connection state callback:', error);
      }
    });
  }

  // Additional methods for real SignalR operations

  /**
   * Join a specific job group to receive updates only for that job
   */
  async joinJobGroup(jobId: string): Promise<void> {
    if (!this.connection || this.connection.state !== HubConnectionState.Connected) {
      throw new Error('SignalR connection not established');
    }

    try {
      await this.connection.invoke('JoinJobGroup', jobId);
      console.log(`Joined job group: ${jobId}`);
    } catch (error) {
      console.error(`Failed to join job group ${jobId}:`, error);
      throw error;
    }
  }

  /**
   * Leave a specific job group
   */
  async leaveJobGroup(jobId: string): Promise<void> {
    if (!this.connection || this.connection.state !== HubConnectionState.Connected) {
      throw new Error('SignalR connection not established');
    }

    try {
      await this.connection.invoke('LeaveJobGroup', jobId);
      console.log(`Left job group: ${jobId}`);
    } catch (error) {
      console.error(`Failed to leave job group ${jobId}:`, error);
      throw error;
    }
  }

  /**
   * Check if manual reconnection is needed (after max failed attempts)
   */
  isManualReconnectNeeded(): boolean {
    return this.failedAttempts >= this.maxFailedAttempts && 
           this.getConnectionState() === 'Disconnected';
  }

  /**
   * Manually reconnect (resets failed attempts and tries again)
   */
  async manualReconnect(): Promise<void> {
    console.log('Manual reconnection initiated');
    this.failedAttempts = 0; // Reset failed attempts
    this.isManuallyDisconnected = false;
    
    // Recreate connection to clear any internal state
    if (this.connection) {
      await this.connection.stop();
    }
    this.initializeConnection();
    
    return this.start();
  }

  /**
   * Get connection statistics
   */
  getConnectionStats(): {
    state: string;
    isConnected: boolean;
    connectionId?: string;
    failedAttempts: number;
    maxFailedAttempts: number;
    needsManualReconnect: boolean;
  } {
    return {
      state: this.getConnectionState(),
      isConnected: this.getConnectionState() === 'Connected',
      connectionId: this.connection?.connectionId || undefined,
      failedAttempts: this.failedAttempts,
      maxFailedAttempts: this.maxFailedAttempts,
      needsManualReconnect: this.isManualReconnectNeeded(),
    };
  }
}

export const realSignalRService = new RealSignalRService();