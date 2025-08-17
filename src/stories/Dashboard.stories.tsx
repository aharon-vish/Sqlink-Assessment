import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from '@/pages/Dashboard';
import type { Job } from '@/types';
import { JobStatus, JobPriority } from '@/types/enums';

const mockJobs: Job[] = [
  {
    jobID: '1',
    name: 'Data Processing Pipeline',
    status: JobStatus.Running,
    priority: JobPriority.High,
    progress: 65,
    createdAt: Date.now() - 3600000,
    startedAt: Date.now() - 1800000,
    completedAt: 0,
    errorMessage: null,
  },
  {
    jobID: '2',
    name: 'Email Campaign Batch',
    status: JobStatus.Completed,
    priority: JobPriority.Regular,
    progress: 100,
    createdAt: Date.now() - 7200000,
    startedAt: Date.now() - 5400000,
    completedAt: Date.now() - 3600000,
    errorMessage: null,
  },
  {
    jobID: '3',
    name: 'Database Backup',
    status: JobStatus.Failed,
    priority: JobPriority.High,
    progress: 45,
    createdAt: Date.now() - 5400000,
    startedAt: Date.now() - 3600000,
    completedAt: Date.now() - 1800000,
    errorMessage: 'Connection timeout during backup process',
  },
  {
    jobID: '4',
    name: 'Report Generation',
    status: JobStatus.InQueue,
    priority: JobPriority.Regular,
    progress: 0,
    createdAt: Date.now() - 1800000,
    startedAt: 0,
    completedAt: 0,
    errorMessage: null,
  },
];

const meta: Meta<typeof Dashboard> = {
  title: 'Pages/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete Job Management Dashboard with real-time updates and full functionality.',
      },
    },
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    mockData: mockJobs,
  },
};

export const EmptyState: Story = {
  parameters: {
    mockData: [],
  },
};

export const LoadingState: Story = {
  parameters: {
    mockData: mockJobs,
    loading: true,
  },
};

export const ErrorState: Story = {
  parameters: {
    mockData: mockJobs,
    error: 'Failed to load jobs from server',
  },
};