import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { JobFilters, JobSorting, StatusCard, JobStore } from '@/types';
import type { Job } from '@/types/job';
import { JobStatus, getJobStatusLabel, getJobStatusColor } from '@/types/enums';

const initialFilters: JobFilters = {
  searchTerm: '',
  status: undefined,
};

const initialSorting: JobSorting = {
  column: 'createdAt',
  direction: 'desc',
};

export const useJobStore = create<JobStore>()(
  devtools(
    (set, get) => ({
      // State
      jobs: [],
      statusCards: [],
      filters: initialFilters,
      sorting: initialSorting,
      isLoading: false,
      error: null,

      // Actions
      setJobs: (jobs) => {
        set({ jobs }, false, 'setJobs');
        get().updateStatusCards();
      },

      addJob: (job) => {
        set(
          (state) => ({ jobs: [...state.jobs, job] }),
          false,
          'addJob'
        );
        get().updateStatusCards();
      },

      updateJob: (jobId, updates) => {
        set(
          (state) => ({
            jobs: state.jobs.map((job) =>
              job.jobID === jobId ? { ...job, ...updates } : job
            ),
          }),
          false,
          'updateJob'
        );
        get().updateStatusCards();
      },

      removeJob: (jobId) => {
        set(
          (state) => ({
            jobs: state.jobs.filter((job) => job.jobID !== jobId),
          }),
          false,
          'removeJob'
        );
        get().updateStatusCards();
      },

      removeJobsByStatus: (status) => {
        set(
          (state) => ({
            jobs: state.jobs.filter((job) => job.status !== status),
          }),
          false,
          'removeJobsByStatus'
        );
        get().updateStatusCards();
      },

      // Filters & Sorting
      setStatusFilter: (status) => {
        set(
          (state) => ({
            filters: { ...state.filters, status },
          }),
          false,
          'setStatusFilter'
        );
      },

      setSearchTerm: (searchTerm) => {
        set(
          (state) => ({
            filters: { ...state.filters, searchTerm },
          }),
          false,
          'setSearchTerm'
        );
      },

      setSorting: (column, direction) => {
        set(
          { sorting: { column, direction } },
          false,
          'setSorting'
        );
      },

      clearFilters: () => {
        set({ filters: initialFilters }, false, 'clearFilters');
      },

      // UI State
      setLoading: (isLoading) => {
        set({ isLoading }, false, 'setLoading');
      },

      setError: (error) => {
        set({ error }, false, 'setError');
      },

      // Computed
      getFilteredJobs: () => {
        const { jobs, filters, sorting } = get();
        let filteredJobs = [...(jobs || [])];

        // Apply status filter
        if (filters.status !== undefined) {
          filteredJobs = filteredJobs.filter(
            (job) => job.status === filters.status
          );
        }

        // Apply search filter
        if (filters.searchTerm) {
          const searchTerm = filters.searchTerm.toLowerCase();
          filteredJobs = filteredJobs.filter((job) =>
            job.name.toLowerCase().includes(searchTerm)
          );
        }

        // Apply sorting
        filteredJobs.sort((a, b) => {
          const aValue = a[sorting.column];
          const bValue = b[sorting.column];

          // Handle null values
          if (aValue === null && bValue === null) return 0;
          if (aValue === null) return sorting.direction === 'asc' ? 1 : -1;
          if (bValue === null) return sorting.direction === 'asc' ? -1 : 1;

          if (aValue < bValue) {
            return sorting.direction === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sorting.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });

        return filteredJobs;
      },

      getJobsByStatus: (status) => {
        return get().jobs.filter((job) => job.status === status);
      },

      getJobCounts: () => {
        const jobs = get().jobs;
        const counts: Record<JobStatus, number> = {
          [JobStatus.Pending]: 0,
          [JobStatus.InQueue]: 0,
          [JobStatus.Running]: 0,
          [JobStatus.Completed]: 0,
          [JobStatus.Failed]: 0,
          [JobStatus.Stopped]: 0,
        };

        if (jobs && Array.isArray(jobs)) {
          jobs.forEach((job) => {
            counts[job.status]++;
          });
        }

        return counts;
      },

      // Internal helper
      updateStatusCards: () => {
        const counts = get().getJobCounts();
        const statusCards: StatusCard[] = Object.values(JobStatus)
          .filter((status) => typeof status === 'number')
          .map((status) => ({
            status: status as JobStatus,
            count: counts[status as JobStatus],
            label: getJobStatusLabel(status as JobStatus),
            color: getJobStatusColor(status as JobStatus),
          }));

        set({ statusCards }, false, 'updateStatusCards');
      },
    }),
    {
      name: 'job-store',
    }
  )
);