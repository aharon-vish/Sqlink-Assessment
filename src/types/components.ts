import type { Job, CreateJobFormData, DeleteJobsFormData } from './job';
import { JobStatus, JobPriority } from './enums';

/**
 * Props for the reusable Button component
 */
export interface ButtonProps {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether to show loading spinner */
  loading?: boolean;
  /** Button content */
  children: React.ReactNode;
  /** Click event handler */
  onClick?: () => void;
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Props for the Modal component
 */
export interface ModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when modal should close */
  onClose: () => void;
  /** Title to display in modal header */
  title: string;
  /** Modal content */
  children: React.ReactNode;
  /** Size of the modal */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Props for the Job Table component
 */
export interface JobTableProps {
  /** Array of jobs to display */
  jobs: Job[];
  /** Callback when user clicks a column header to sort */
  onSort: (column: keyof Job, direction: 'asc' | 'desc') => void;
  /** Callback when user performs an action on a job */
  onJobAction: (jobId: string, action: 'delete' | 'restart' | 'stop') => void;
  /** Current sorting configuration */
  sorting: { column: keyof Job; direction: 'asc' | 'desc' };
  /** Whether the table is in loading state */
  loading?: boolean;
}

/**
 * Props for the Status Card component
 */
export interface StatusCardProps {
  /** The job status this card represents */
  status: JobStatus;
  /** Number of jobs with this status */
  count: number;
  /** Callback when card is clicked */
  onClick: (status: JobStatus) => void;
  /** Whether this card is currently active/selected */
  isActive?: boolean;
}

/**
 * Props for the Progress Bar component
 */
export interface ProgressBarProps {
  /** Progress percentage (0-100) */
  progress: number;
  /** Job status for styling the progress bar */
  status: JobStatus;
  /** Size of the progress bar */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show percentage text */
  showPercentage?: boolean;
}

/**
 * Props for the Create Job Form component
 */
export interface CreateJobFormProps {
  /** Callback when form is submitted */
  onSubmit: (data: CreateJobFormData) => void;
  /** Whether the form is in loading/submitting state */
  loading?: boolean;
}

/**
 * Props for the Delete Jobs Form component
 */
export interface DeleteJobsFormProps {
  /** Callback when form is submitted */
  onSubmit: (data: DeleteJobsFormData) => void;
  /** Whether the form is in loading/submitting state */
  loading?: boolean;
}