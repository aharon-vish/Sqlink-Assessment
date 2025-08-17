import { setupServer } from 'msw/node';
import { rest } from 'msw';
import type { Job } from '@/types';
import { JobStatus, JobPriority } from '@/types/enums';

const mockJobs: Job[] = [
  {
    jobID: 'test-job-1',
    name: 'Test Job 1',
    status: JobStatus.Running,
    priority: JobPriority.High,
    progress: 50,
    createdAt: Date.now() - 3600000,
    startedAt: Date.now() - 1800000,
    completedAt: 0,
    errorMessage: null,
  },
  {
    jobID: 'test-job-2',
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

export const handlers = [
  rest.get('*/Jobs', (req, res, ctx) => {
    return res(ctx.json(mockJobs));
  }),

  rest.post('*/Jobs', (req, res, ctx) => {
    const newJob: Job = {
      jobID: 'new-test-job',
      name: 'New Test Job',
      status: JobStatus.Pending,
      priority: JobPriority.Regular,
      progress: 0,
      createdAt: Date.now(),
      startedAt: 0,
      completedAt: 0,
      errorMessage: null,
    };
    return res(ctx.json(newJob));
  }),

  rest.delete('*/Jobs/:jobId', (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.post('*/Jobs/:jobId/stop', (req, res, ctx) => {
    return res(ctx.json({ isSuccess: true, message: 'Job stopped' }));
  }),

  rest.post('*/Jobs/:jobId/restart', (req, res, ctx) => {
    return res(ctx.json({ isSuccess: true, message: 'Job restarted' }));
  }),
];

export const server = setupServer(...handlers);