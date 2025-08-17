import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from '@/pages/Dashboard';
import { mockApiService } from '@/services';
import type { Job } from '@/types';
import { JobStatus, JobPriority } from '@/types/enums';

const mockJobs: Job[] = [
  {
    jobID: 'job-1',
    name: 'Test Job 1',
    status: JobStatus.Running,
    priority: JobPriority.High,
    progress: 65,
    createdAt: Date.now() - 3600000,
    startedAt: Date.now() - 1800000,
    completedAt: 0,
    errorMessage: null,
  },
  {
    jobID: 'job-2',
    name: 'Test Job 2',
    status: JobStatus.Completed,
    priority: JobPriority.Regular,
    progress: 100,
    createdAt: Date.now() - 7200000,
    startedAt: Date.now() - 5400000,
    completedAt: Date.now() - 3600000,
    errorMessage: null,
  },
];

const renderDashboard = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
};

describe('Dashboard Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(mockApiService.getAllJobs).mockResolvedValue(mockJobs);
  });

  it('loads and displays jobs on mount', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Test Job 1')).toBeInTheDocument();
      expect(screen.getByText('Test Job 2')).toBeInTheDocument();
    });

    expect(mockApiService.getAllJobs).toHaveBeenCalledTimes(1);
  });

  it('shows loading state initially', () => {
    renderDashboard();
    
    // Should show loading skeletons or spinner
    expect(screen.getByTestId('loading-spinner') || screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('filters jobs by status when status card is clicked', async () => {
    const user = userEvent.setup();
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Test Job 1')).toBeInTheDocument();
    });

    // Click on Running status card
    const runningCard = screen.getByTestId('status-card-2'); // Running = 2
    await user.click(runningCard);

    // Should only show running jobs
    expect(screen.getByText('Test Job 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Job 2')).not.toBeInTheDocument();
  });

  it('searches jobs by name', async () => {
    const user = userEvent.setup();
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Test Job 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'Test Job 1');

    // Should only show jobs matching search
    await waitFor(() => {
      expect(screen.getByText('Test Job 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Job 2')).not.toBeInTheDocument();
    });
  });

  it('opens create job modal when button is clicked', async () => {
    const user = userEvent.setup();
    renderDashboard();

    const createButton = screen.getByTestId('create-job-btn');
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('createJobModal.title')).toBeInTheDocument();
    });
  });

  it('creates a new job successfully', async () => {
    const user = userEvent.setup();
    const newJob: Job = {
      jobID: 'new-job',
      name: 'New Test Job',
      status: JobStatus.Pending,
      priority: JobPriority.Regular,
      progress: 0,
      createdAt: Date.now(),
      startedAt: 0,
      completedAt: 0,
      errorMessage: null,
    };

    vi.mocked(mockApiService.createJob).mockResolvedValue(newJob);

    renderDashboard();

    // Open create modal
    const createButton = screen.getByTestId('create-job-btn');
    await user.click(createButton);

    // Fill form
    const nameInput = screen.getByTestId('job-name-input');
    await user.type(nameInput, 'New Test Job');

    // Submit form
    const submitButton = screen.getByTestId('submit-create-job');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApiService.createJob).toHaveBeenCalledWith({
        name: 'New Test Job',
        priority: JobPriority.Regular,
      });
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(mockApiService.getAllJobs).mockRejectedValue(new Error('API Error'));

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/api error/i)).toBeInTheDocument();
    });
  });
});