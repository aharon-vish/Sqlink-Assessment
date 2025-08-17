import { JobStatus, JobPriority } from './enums';

/**
 * Core job interface representing a job in the system
 */
export interface Job {
  /** Unique job identifier in UUID/Guid format */
  jobID: string;
  /** Human-readable job name */
  name: string;
  /** Current status of the job */
  status: JobStatus;
  /** Job priority level */
  priority: JobPriority;
  /** Job completion progress from 0-100 */
  progress: number;
  /** Unix timestamp when the job was created */
  createdAt: number;
  /** Unix timestamp when the job started (0 if not started) */
  startedAt: number;
  /** Unix timestamp when the job completed (0 if not completed) */
  completedAt: number;
  /** Error message if the job failed, null otherwise */
  errorMessage: string | null;
}

/**
 * Request payload for creating a new job
 */
export interface CreateJobRequest {
  /** Name for the new job */
  name: string;
  /** Priority level for the new job */
  priority: JobPriority;
}


/**
 * Real-time job progress update from SignalR
 */
export interface JobProgressUpdate {
  /** ID of the job being updated */
  jobID: string;
  /** New status of the job */
  status: JobStatus;
  /** Updated progress percentage */
  progress: number;
}

/**
 * Configuration for a job table column
 */
export interface JobTableColumn {
  /** The job property key this column displays */
  key: keyof Job | 'actions';
  /** Display label for the column header */
  label: string;
  /** Whether this column can be sorted */
  sortable: boolean;
  /** Optional fixed width for the column */
  width?: string;
}

/**
 * Status card data for the dashboard overview
 */
export interface StatusCard {
  /** The job status this card represents */
  status: JobStatus;
  /** Number of jobs with this status */
  count: number;
  /** Display label for the status */
  label: string;
  /** Color to use for the status card */
  color: string;
}

/**
 * Job filtering options
 */
export interface JobFilters {
  /** Filter by specific job status (optional) */
  status?: JobStatus;
  /** Text search term for job names */
  searchTerm: string;
}

/**
 * Job table sorting configuration
 */
export interface JobSorting {
  /** The job property to sort by */
  column: keyof Job;
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Form data for creating a new job
 */
export interface CreateJobFormData {
  /** Name for the new job */
  name: string;
  /** Priority level for the new job */
  priority: JobPriority;
}

/**
 * Form data for bulk deleting jobs by status
 */
export interface DeleteJobsFormData {
  /** Status of jobs to delete */
  status: JobStatus;
}

/**
 * Configuration for the mock service behavior
 */
export interface MockServiceConfig {
  /** Whether mock service is enabled */
  enabled: boolean;
  /** Base delay for mock operations in milliseconds */
  baseDelay: number;
  /** Interval for progress updates in milliseconds */
  progressInterval: number;
  /** Rate of job failures (0-1) */
  failureRate: number;
}