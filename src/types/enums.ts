/**
 * Job status enumeration representing the various states a job can be in
 */
export enum JobStatus {
  Pending = 0,
  InQueue = 1,
  Running = 2,
  Completed = 3,
  Failed = 4,
  Stopped = 5,
}

/**
 * Job priority enumeration for determining execution order
 */
export enum JobPriority {
  Regular = 0,
  High = 1,
}

/**
 * Gets translation key for a job status
 * @param status - The job status enum value
 * @returns Translation key for the status
 */
export const getJobStatusLabel = (status: JobStatus): string => {
  switch (status) {
    case JobStatus.Pending: return 'pending';
    case JobStatus.InQueue: return 'inQueue';
    case JobStatus.Running: return 'running';
    case JobStatus.Completed: return 'completed';
    case JobStatus.Failed: return 'failed';
    case JobStatus.Stopped: return 'stopped';
    default: return 'unknown';
  }
};

/**
 * Gets translation key for a job priority
 * @param priority - The job priority enum value
 * @returns Translation key for the priority
 */
export const getJobPriorityLabel = (priority: JobPriority): string => {
  switch (priority) {
    case JobPriority.Regular: return 'regular';
    case JobPriority.High: return 'high';
    default: return 'unknown';
  }
};

/**
 * Gets the appropriate color for displaying job status in UI
 * @param status - The job status enum value
 * @returns Hex color code for the status
 */
export const getJobStatusColor = (status: JobStatus): string => {
  switch (status) {
    case JobStatus.Pending: return '#718096'; // Gray
    case JobStatus.InQueue: return '#805ad5'; // Purple
    case JobStatus.Running: return '#3182ce'; // Blue
    case JobStatus.Completed: return '#38a169'; // Green
    case JobStatus.Failed: return '#e53e3e'; // Red
    case JobStatus.Stopped: return '#d69e2e'; // Orange
    default: return '#718096';
  }
};

/**
 * Determines if a job can be stopped based on its current status
 * @param status - The current job status
 * @returns True if the job can be stopped
 */
export const canStopJob = (status: JobStatus): boolean => {
  return status === JobStatus.Running || status === JobStatus.InQueue;
};

/**
 * Determines if a job can be restarted based on its current status
 * @param status - The current job status
 * @returns True if the job can be restarted
 */
export const canRestartJob = (status: JobStatus): boolean => {
  return status === JobStatus.Failed || status === JobStatus.Stopped;
};

/**
 * Determines if a job can be deleted based on its current status
 * @param status - The current job status
 * @returns True if the job can be deleted
 */
export const canDeleteJob = (status: JobStatus): boolean => {
  return status === JobStatus.Completed || 
         status === JobStatus.Failed || 
         status === JobStatus.Stopped;
};

/**
 * Determines if jobs with this status can be bulk deleted
 * @param status - The job status to check
 * @returns True if jobs with this status can be bulk deleted
 */
export const canBulkDeleteStatus = (status: JobStatus): boolean => {
  return status === JobStatus.Failed || status === JobStatus.Completed;
};