import { describe, it, expect, beforeEach } from 'vitest';
import { useJobStore } from '@/stores/jobStore';
import type { Job } from '@/types';
import { JobStatus, JobPriority } from '@/types/enums';
import { act, renderHook } from '@testing-library/react';

const mockJob: Job = {
  jobID: 'test-job-1',
  name: 'Test Job',
  status: JobStatus.Pending,
  priority: JobPriority.Regular,
  progress: 0,
  createdAt: Date.now(),
  startedAt: 0,
  completedAt: 0,
  errorMessage: null,
};

describe('Job Store', () => {
  beforeEach(() => {
    // Reset store state
    const { result } = renderHook(() => useJobStore());
    act(() => {
      result.current.setJobs([]);
      result.current.clearFilters();
      result.current.setError(null);
      result.current.setLoading(false);
    });
  });

  it('adds a job correctly', () => {
    const { result } = renderHook(() => useJobStore());
    
    act(() => {
      result.current.addJob(mockJob);
    });

    expect(result.current.jobs).toHaveLength(1);
    expect(result.current.jobs[0]).toEqual(mockJob);
  });

  it('updates a job correctly', () => {
    const { result } = renderHook(() => useJobStore());
    
    act(() => {
      result.current.addJob(mockJob);
      result.current.updateJob(mockJob.jobID, { 
        status: JobStatus.Running, 
        progress: 50 
      });
    });

    const updatedJob = result.current.jobs[0];
    expect(updatedJob.status).toBe(JobStatus.Running);
    expect(updatedJob.progress).toBe(50);
  });

  it('removes a job correctly', () => {
    const { result } = renderHook(() => useJobStore());
    
    act(() => {
      result.current.addJob(mockJob);
      result.current.removeJob(mockJob.jobID);
    });

    expect(result.current.jobs).toHaveLength(0);
  });

  it('filters jobs by status correctly', () => {
    const job1 = { ...mockJob, jobID: 'job-1', status: JobStatus.Running };
    const job2 = { ...mockJob, jobID: 'job-2', status: JobStatus.Completed };
    
    const { result } = renderHook(() => useJobStore());
    
    act(() => {
      result.current.setJobs([job1, job2]);
      result.current.setStatusFilter(JobStatus.Running);
    });

    const filteredJobs = result.current.getFilteredJobs();
    expect(filteredJobs).toHaveLength(1);
    expect(filteredJobs[0].status).toBe(JobStatus.Running);
  });

  it('searches jobs by name correctly', () => {
    const job1 = { ...mockJob, jobID: 'job-1', name: 'Data Processing' };
    const job2 = { ...mockJob, jobID: 'job-2', name: 'Email Campaign' };
    
    const { result } = renderHook(() => useJobStore());
    
    act(() => {
      result.current.setJobs([job1, job2]);
      result.current.setSearchTerm('data');
    });

    const filteredJobs = result.current.getFilteredJobs();
    expect(filteredJobs).toHaveLength(1);
    expect(filteredJobs[0].name).toBe('Data Processing');
  });

  it('sorts jobs correctly', () => {
    const job1 = { ...mockJob, jobID: 'job-1', name: 'A Job', createdAt: 1000 };
    const job2 = { ...mockJob, jobID: 'job-2', name: 'B Job', createdAt: 2000 };
    
    const { result } = renderHook(() => useJobStore());
    
    act(() => {
      result.current.setJobs([job2, job1]); // Add in reverse order
      result.current.setSorting('name', 'asc');
    });

    const sortedJobs = result.current.getFilteredJobs();
    expect(sortedJobs[0].name).toBe('A Job');
    expect(sortedJobs[1].name).toBe('B Job');
  });

  it('calculates job counts correctly', () => {
    const jobs = [
      { ...mockJob, jobID: 'job-1', status: JobStatus.Running },
      { ...mockJob, jobID: 'job-2', status: JobStatus.Running },
      { ...mockJob, jobID: 'job-3', status: JobStatus.Completed },
    ];
    
    const { result } = renderHook(() => useJobStore());
    
    act(() => {
      result.current.setJobs(jobs);
    });

    const counts = result.current.getJobCounts();
    expect(counts[JobStatus.Running]).toBe(2);
    expect(counts[JobStatus.Completed]).toBe(1);
    expect(counts[JobStatus.Pending]).toBe(0);
  });
});