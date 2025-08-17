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
  private hasLoggedMaxAttempts = false;

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    const config = getServiceConfig();
    
    // Disable auto-reconnect completely - we'll handle retries manually
    this.connection = new HubConnectionBuilder()
      .withUrl(config.signalRHubUrl)
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

    // Handle connection state changes (no auto-reconnect, so simpler handlers)
    this.connection.onclose((error) => {
      console.log('SignalR connection closed:', error);
      this.notifyConnectionState('Disconnected');
      
      // Only attempt reconnect if we haven't exceeded max attempts and not manually disconnected
      if (error && !this.isManuallyDisconnected && this.failedAttempts < this.maxFailedAttempts) {
        console.log(`Connection lost, will retry in 3 seconds (attempt ${this.failedAttempts + 1}/${this.maxFailedAttempts})`);
        setTimeout(() => {
          if (!this.isManuallyDisconnected && this.failedAttempts < this.maxFailedAttempts) {
            this.start().catch(console.error);
          }
        }, 3000);
      } else if (this.failedAttempts >= this.maxFailedAttempts) {
        console.log('Max failed attempts reached - no more auto-reconnects');
        this.isManuallyDisconnected = true;
      }
    });
  }

  async start(): Promise<void> {
    if (!this.connection) {
      throw new Error('SignalR connection not initialized');
    }

    // Check if we've exceeded max attempts - only log once
    if (this.failedAttempts >= this.maxFailedAttempts) {
      if (!this.hasLoggedMaxAttempts) {
        console.error(`Max connection attempts (${this.maxFailedAttempts}) exceeded. Use manual reconnect.`);
        this.hasLoggedMaxAttempts = true;
        this.isManuallyDisconnected = true;
      }
      return; // Silently return instead of throwing error
    }

    // Check if already connected or connecting
    if (this.connection.state === HubConnectionState.Connected || 
        this.connection.state === HubConnectionState.Connecting) {
      return;
    }

    // Add timeout to prevent hanging
    const startWithTimeout = () => {
      return Promise.race([
        this.connection!.start(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000)
        )
      ]);
    };

    try {
      this.notifyConnectionState('Connecting');
      await startWithTimeout();
      this.isStarted = true;
      this.failedAttempts = 0; // Reset failed attempts on successful connection
      this.isManuallyDisconnected = false;
      this.hasLoggedMaxAttempts = false; // Reset log flag
      this.notifyConnectionState('Connected');
      console.log('SignalR connected successfully');
    } catch (error) {
      this.isStarted = false;
      this.failedAttempts++;
      this.notifyConnectionState('Disconnected');
      console.error(`Failed to start SignalR connection (attempt ${this.failedAttempts}/${this.maxFailedAttempts}):`, error);
      
      // Mark as manually disconnected if we've hit the limit
      if (this.failedAttempts >= this.maxFailedAttempts) {
        console.log('Max attempts reached - no more auto-retries');
        this.isManuallyDisconnected = true;
      }
      
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
    this.hasLoggedMaxAttempts = false; // Reset log flag
    
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