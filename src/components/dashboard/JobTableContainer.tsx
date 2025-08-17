import React from 'react';
import { JobTable } from './JobTable';
import { useJobStore } from '@/stores/jobStore';
import { useUIStore } from '@/stores/uiStore';
import { apiService } from '@/services';
import { JobStatus } from '@/types/enums';
import type { Job } from '@/types';

export const JobTableContainer: React.FC = () => {
  const { 
    getFilteredJobs, 
    sorting, 
    setSorting, 
    removeJob,
    updateJob, 
    setError,
    isLoading 
  } = useJobStore();
  
  const { setLoadingState } = useUIStore();

  const handleSort = (column: keyof Job, direction: 'asc' | 'desc') => {
    setSorting(column, direction);
  };

  const handleJobAction = async (
    jobId: string, 
    action: 'delete' | 'restart' | 'stop'
  ) => {
    const loadingKey = `job-${jobId}`;
    
    try {
      setLoadingState(loadingKey, true);
      setError(null);

      switch (action) {
        case 'delete':
          await apiService.deleteJob(jobId);
          removeJob(jobId);
          break;
          
        case 'restart':
          await apiService.restartJob(jobId);
          // Update job immediately in the store
          updateJob(jobId, {
            status: JobStatus.Pending,
            progress: 0,
            startedAt: 0,
            completedAt: 0,
            errorMessage: null,
          });
          break;
          
        case 'stop':
          await apiService.stopJob(jobId);
          // Update job immediately in the store
          updateJob(jobId, {
            status: JobStatus.Stopped,
            completedAt: Date.now(),
          });
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} job:`, error);
      setError(error instanceof Error ? error.message : `Failed to ${action} job`);
    } finally {
      setLoadingState(loadingKey, false);
    }
  };

  const filteredJobs = getFilteredJobs();

  return (
    <JobTable
      jobs={filteredJobs}
      sorting={sorting}
      onSort={handleSort}
      onAction={handleJobAction}
      loading={isLoading}
    />
  );
};