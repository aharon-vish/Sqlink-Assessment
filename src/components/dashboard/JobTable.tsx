import React from 'react';
import styled from 'styled-components';
import type { Job, JobSorting } from '@/types';
import { JobTableHeader } from './JobTableHeader';
import { JobTableRow } from './JobTableRow';
import { useUIStore } from '@/stores/uiStore';

interface JobTableProps {
  jobs: Job[];
  sorting: JobSorting;
  onSort: (column: keyof Job, direction: 'asc' | 'desc') => void;
  onAction: (jobId: string, action: 'delete' | 'restart' | 'stop') => void;
  loading?: boolean;
}

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e2e8f0;
  margin-top: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const LoadingOverlay = styled.div`
  position: relative;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3182ce;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #718096;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #4a5568;
`;

const EmptyMessage = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
`;

const ResponsiveWrapper = styled.div`
  overflow-x: auto;
  
  @media (max-width: 768px) {
    /* Enable horizontal scrolling on mobile */
    -webkit-overflow-scrolling: touch;
  }
`;

export const JobTable: React.FC<JobTableProps> = ({
  jobs,
  sorting,
  onSort,
  onAction,
  loading = false
}) => {
  const { loadingStates } = useUIStore();

  if (loading) {
    return (
      <TableContainer>
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      </TableContainer>
    );
  }

  if (jobs.length === 0) {
    return (
      <TableContainer>
        <EmptyState>
          <EmptyTitle>No jobs found</EmptyTitle>
          <EmptyMessage>
            No jobs match your current filters. Try adjusting your search criteria or create a new job.
          </EmptyMessage>
        </EmptyState>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <ResponsiveWrapper>
        <Table data-testid="job-table">
          <JobTableHeader sorting={sorting} onSort={onSort} />
          <tbody>
            {jobs.map((job) => (
              <JobTableRow
                key={job.jobID}
                job={job}
                onAction={onAction}
                actionLoading={loadingStates[`job-${job.jobID}`] || false}
              />
            ))}
          </tbody>
        </Table>
      </ResponsiveWrapper>
    </TableContainer>
  );
};