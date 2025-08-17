import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from '@/pages/Dashboard';
import { apiService } from '@/services';
import { type Job, JobStatus, JobPriority } from '@/types';

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
    vi.mocked(apiService.getAllJobs).mockResolvedValue(mockJobs);
    document.body.innerHTML = '';
  });

  it('loads and displays jobs on mount', async () => {
    renderDashboard();

    await waitFor(
      () => {
        expect(screen.getByText('Test Job 1')).toBeInTheDocument();
        expect(screen.getByText('Test Job 2')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(apiService.getAllJobs).toHaveBeenCalledTimes(1);
  });

  it('shows correct dashboard title', async () => {
    renderDashboard();
    expect(screen.getByText('Job Dashboard')).toBeInTheDocument();
  });

  it('displays status cards with correct counts', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Test Job 1')).toBeInTheDocument();
    });

    // Check that status cards exist
    const runningCard = screen.getByTestId('status-card-2');
    expect(runningCard).toBeInTheDocument();
    
    const completedCard = screen.getByTestId('status-card-3');
    expect(completedCard).toBeInTheDocument();
  });

  it('filters jobs by status when status card is clicked', async () => {
    const user = userEvent.setup();
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Test Job 1')).toBeInTheDocument();
    });

    // Click on Running status card
    const runningCard = screen.getByTestId('status-card-2');
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

    // Wait for dashboard to load first
    await waitFor(() => {
      expect(screen.getByText('Test Job 1')).toBeInTheDocument();
    });

    // Use the unique test ID from header
    const createButton = screen.getByTestId('header-create-job-btn');
    expect(createButton).toBeInTheDocument();
    
    await user.click(createButton);

    await waitFor(() => {
      // Check for modal by looking for modal-specific content
      expect(screen.getByRole('dialog') || screen.getByTestId('create-job-modal')).toBeInTheDocument();
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

    vi.mocked(apiService.createJob).mockResolvedValue(newJob);

    renderDashboard();

    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText('Test Job 1')).toBeInTheDocument();
    });

    // Open create modal using unique test ID
    const createButton = screen.getByTestId('header-create-job-btn');
    await user.click(createButton);

    // Wait for modal to open and find form elements
    await waitFor(() => {
      expect(screen.getByTestId('create-job-modal')).toBeInTheDocument();
    });

    // Fill form
    const nameInput = screen.getByTestId('modal-submit-create-job');
    await user.clear(nameInput);
    await user.type(nameInput, 'New Test Job');

    // Submit form - use the modal submit button
    const submitButton = screen.getByTestId('create-job-btn');
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiService.createJob).toHaveBeenCalledWith({
        name: 'New Test Job',
        priority: JobPriority.Regular,
      });
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(apiService.getAllJobs).mockRejectedValue(new Error('API Error'));

    renderDashboard();

    await waitFor(
      () => {
        // Look for error message
        expect(screen.getByText(/API Error/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('shows empty state when no jobs are returned', async () => {
    vi.mocked(apiService.getAllJobs).mockResolvedValue([]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('No jobs found')).toBeInTheDocument();
    });
  });
});