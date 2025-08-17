import type { Job, CreateJobRequest, JobProgressUpdate } from './job';
import type { JobStatus } from './enums';

/**
 * Standard API response format
 */
export interface ApiResponse {
  /** Whether the operation was successful */
  isSuccess: boolean;
  /** Response message */
  message: string;
}

/**
 * Interface defining all job-related API operations
 */
export interface JobAPI {
  /** Fetch all jobs from the server */
  getAllJobs(): Promise<Job[]>;
  /** Create a new job */
  createJob(request: CreateJobRequest): Promise<Job>;
  /** Stop a running or queued job */
  stopJob(jobId: string): Promise<ApiResponse>;
  /** Restart a failed or stopped job */
  restartJob(jobId: string): Promise<ApiResponse>;
  /** Delete a specific job */
  deleteJob(jobId: string): Promise<void>;
  /** Delete all jobs with a specific status */
  deleteJobsByStatus(status: JobStatus): Promise<void>;
}

/**
 * Interface for SignalR hub operations
 */
export interface JobSignalRHub {
  /** Start the SignalR connection */
  start(): Promise<void>;
  /** Stop the SignalR connection */
  stop(): Promise<void>;
  /** Register callback for job progress updates */
  onJobProgressUpdate(callback: (update: JobProgressUpdate) => void): void;
  /** Unregister job progress update callback */
  offJobProgressUpdate(): void;
  /** Get current connection state */
  getConnectionState(): 'Connected' | 'Disconnected' | 'Connecting';
}

/**
 * Service configuration options
 */
export interface ServiceConfig {
  /** Whether to use mock or real API */
  apiMode: 'mock' | 'real';
  /** Base URL for the API server */
  apiBaseUrl: string;
  /** URL for the SignalR hub */
  signalRHubUrl: string;
}

/**
 * Standard API error information
 */
export interface ApiError {
  /** Error message */
  message: string;
  /** HTTP status code if applicable */
  statusCode?: number;
  /** Additional error details */
  details?: string;
}

/**
 * Enhanced service error with additional context
 */
export interface ServiceError extends Error {
  /** Type of error that occurred */
  type: 'API_ERROR' | 'NETWORK_ERROR' | 'SIGNALR_ERROR';
  /** HTTP status code if applicable */
  statusCode?: number;
  /** Whether this error can be retried */
  retryable: boolean;
}