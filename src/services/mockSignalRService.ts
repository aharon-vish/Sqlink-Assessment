import type { JobSignalRHub, JobProgressUpdate } from '@/types';

type ProgressCallback = (update: JobProgressUpdate) => void;
type ConnectionCallback = (state: 'Connected' | 'Disconnected' | 'Connecting') => void;

interface ConnectionConfig {
  reconnectAttempts: number;
  reconnectDelay: number;
  maxReconnectDelay: number;
  connectionTimeout: number;
}

class EnhancedMockSignalRService implements JobSignalRHub {
  private isConnected = false;
  private callbacks: ProgressCallback[] = [];
  private connectionCallbacks: ConnectionCallback[] = [];
  private connectionState: 'Connected' | 'Disconnected' | 'Connecting' = 'Disconnected';
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private connectionAttempts = 0;
  
  private config: ConnectionConfig = {
    reconnectAttempts: 5,
    reconnectDelay: 1000,
    maxReconnectDelay: 30000,
    connectionTimeout: 5000,
  };

  async start(): Promise<void> {
    if (this.isConnected || this.connectionState === 'Connecting') {
      return;
    }

    this.setConnectionState('Connecting');
    this.connectionAttempts++;

    try {
      // Simulate connection delay
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          // Simulate occasional connection failures (10% chance)
          if (Math.random() < 0.1) {
            reject(new Error('Connection timeout'));
          } else {
            resolve();
          }
        }, Math.random() * 2000 + 500);

        // Connection timeout
        setTimeout(() => {
          clearTimeout(timeout);
          reject(new Error('Connection timeout'));
        }, this.config.connectionTimeout);
      });

      this.isConnected = true;
      this.connectionAttempts = 0;
      this.setConnectionState('Connected');
      this.startHeartbeat();
      
      console.log('Mock SignalR connected');
    } catch (error) {
      this.setConnectionState('Disconnected');
      console.error('Mock SignalR connection failed:', error);
      
      // Auto-reconnect if not exceeded max attempts
      if (this.connectionAttempts < this.config.reconnectAttempts) {
        this.scheduleReconnect();
      }
      
      throw error;
    }
  }

  async stop(): Promise<void> {
    this.isConnected = false;
    this.setConnectionState('Disconnected');
    this.callbacks = [];
    this.connectionCallbacks = [];
    this.clearReconnectTimeout();
    this.stopHeartbeat();
    console.log('Mock SignalR disconnected');
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
    return this.connectionState;
  }

  // Method to emit updates (used by mock API service)
  emitProgressUpdate(update: JobProgressUpdate): void {
    if (this.isConnected) {
      // Simulate network delay with occasional packet loss
      const delay = Math.random() * 300 + 50;
      const packetLoss = Math.random() < 0.02; // 2% packet loss

      if (!packetLoss) {
        setTimeout(() => {
          this.callbacks.forEach(callback => {
            try {
              callback(update);
            } catch (error) {
              console.error('Error in SignalR callback:', error);
            }
          });
        }, delay);
      } else {
        console.warn('Mock SignalR: Simulated packet loss');
      }
    }
  }

  private setConnectionState(state: 'Connected' | 'Disconnected' | 'Connecting'): void {
    if (this.connectionState !== state) {
      this.connectionState = state;
      this.connectionCallbacks.forEach(callback => {
        try {
          callback(state);
        } catch (error) {
          console.error('Error in connection state callback:', error);
        }
      });
    }
  }

  private scheduleReconnect(): void {
    this.clearReconnectTimeout();
    
    // Exponential backoff with jitter
    const baseDelay = Math.min(
      this.config.reconnectDelay * Math.pow(2, this.connectionAttempts - 1),
      this.config.maxReconnectDelay
    );
    const jitter = Math.random() * 1000;
    const delay = baseDelay + jitter;

    console.log(`Mock SignalR: Reconnecting in ${Math.round(delay)}ms (attempt ${this.connectionAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.start().catch(console.error);
    }, delay);
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatInterval = setInterval(() => {
      // Simulate random disconnections (1% chance every 10 seconds)
      if (Math.random() < 0.01) {
        console.warn('Mock SignalR: Simulated connection lost');
        this.simulateDisconnection();
      }
    }, 10000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private simulateDisconnection(): void {
    this.isConnected = false;
    this.setConnectionState('Disconnected');
    this.stopHeartbeat();
    
    // Auto-reconnect after delay
    setTimeout(() => {
      if (this.connectionState === 'Disconnected') {
        this.start().catch(console.error);
      }
    }, 3000);
  }

  // Public method to manually trigger disconnection (for testing)
  simulateConnectionLoss(): void {
    if (this.isConnected) {
      this.simulateDisconnection();
    }
  }

  // Get connection statistics
  getConnectionStats(): {
    attempts: number;
    state: string;
    isConnected: boolean;
  } {
    return {
      attempts: this.connectionAttempts,
      state: this.connectionState,
      isConnected: this.isConnected,
    };
  }
}

export const mockSignalRService = new EnhancedMockSignalRService();