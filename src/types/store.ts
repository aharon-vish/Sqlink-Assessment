import type { Job, JobFilters, JobSorting, StatusCard } from './job';
import { JobStatus } from './enums';

/**
 * Main job store interface for managing job state and operations
 */
export interface JobStore {
  // State
  /** Array of all jobs */
  jobs: Job[];
  /** Status cards for dashboard overview */
  statusCards: StatusCard[];
  /** Current filter settings */
  filters: JobFilters;
  /** Current sorting configuration */
  sorting: JobSorting;
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Current error message, null if no error */
  error: string | null;
  
  // Actions
  /** Replace all jobs with new array */
  setJobs: (jobs: Job[]) => void;
  /** Add a new job to the store */
  addJob: (job: Job) => void;
  /** Update specific properties of a job */
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  /** Remove a job from the store */
  removeJob: (jobId: string) => void;
  /** Remove all jobs with a specific status */
  removeJobsByStatus: (status: JobStatus) => void;
  
  // Filters & Sorting
  /** Set the status filter (undefined to clear) */
  setStatusFilter: (status?: JobStatus) => void;
  /** Set the search term filter */
  setSearchTerm: (term: string) => void;
  /** Set the sorting column and direction */
  setSorting: (column: keyof Job, direction: 'asc' | 'desc') => void;
  /** Clear all filters */
  clearFilters: () => void;
  
  // UI State
  /** Set the loading state */
  setLoading: (loading: boolean) => void;
  /** Set or clear error message */
  setError: (error: string | null) => void;
  
  // Computed
  /** Get jobs filtered by current filter settings */
  getFilteredJobs: () => Job[];
  /** Get all jobs with a specific status */
  getJobsByStatus: (status: JobStatus) => Job[];
  /** Get count of jobs for each status */
  getJobCounts: () => Record<JobStatus, number>;
}

/**
 * UI store interface for managing modal and loading states
 */
export interface UIStore {
  // Modal states
  /** Whether the create job modal is open */
  isCreateJobModalOpen: boolean;
  /** Whether the delete jobs modal is open */
  isDeleteJobsModalOpen: boolean;
  
  // Loading states
  /** Map of loading states for different operations */
  loadingStates: Record<string, boolean>;
  
  // Actions
  /** Open the create job modal */
  openCreateJobModal: () => void;
  /** Close the create job modal */
  closeCreateJobModal: () => void;
  /** Open the delete jobs modal */
  openDeleteJobsModal: () => void;
  /** Close the delete jobs modal */
  closeDeleteJobsModal: () => void;
  /** Set loading state for a specific operation */
  setLoadingState: (key: string, loading: boolean) => void;
}