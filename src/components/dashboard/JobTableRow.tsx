import { memo } from 'react';
import styled from 'styled-components';
import type { Job } from '@/types';
import { JobPriority, getJobPriorityLabel } from '@/types/enums';
import { StatusBadge, ProgressBar } from '@/components/ui';
import { JobActions } from './JobActions';

interface JobTableRowProps {
  job: Job;
  onAction: (jobId: string, action: 'delete' | 'restart' | 'stop') => void;
  actionLoading?: boolean;
}

const TableRow = styled.tr`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: #f7fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 16px 12px;
  vertical-align: middle;
  font-size: 14px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 12px;
  }
`;

const JobName = styled.div`
  font-weight: 500;
  color: #2d3748;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 auto;
`;

const PriorityBadge = styled.span<{ priority: JobPriority }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ priority }) => 
    priority === JobPriority.High ? '#fed7d7' : '#e2e8f0'};
  color: ${({ priority }) => 
    priority === JobPriority.High ? '#c53030' : '#4a5568'};
`;

const TimeDisplay = styled.div`
  color: #718096;
  font-size: 12px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return '-';
  
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

// Memoize the component to prevent unnecessary re-renders
export const JobTableRow = memo<JobTableRowProps>(({ 
  job, 
  onAction, 
  actionLoading = false 
}) => {
  return (
    <TableRow data-testid={`job-row-${job.jobID}`}>
      <TableCell>
        <JobName title={job.name}>{job.name}</JobName>
      </TableCell>
      
      <TableCell>
        <PriorityBadge priority={job.priority}>
          {getJobPriorityLabel(job.priority)}
        </PriorityBadge>
      </TableCell>
      
      <TableCell>
        <StatusBadge status={job.status} size="sm" />
      </TableCell>
      
      <TableCell>
        <ProgressBar 
          progress={job.progress} 
          status={job.status} 
          size="sm" 
        />
      </TableCell>
      
      <TableCell>
        <TimeDisplay>{formatTimestamp(job.startedAt || job.createdAt)}</TimeDisplay>
      </TableCell>
      
      <TableCell>
        <TimeDisplay>{formatTimestamp(job.completedAt)}</TimeDisplay>
      </TableCell>
      
      <TableCell>
        <JobActions 
          job={job} 
          onAction={onAction} 
          loading={actionLoading}
        />
      </TableCell>
    </TableRow>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.job.jobID === nextProps.job.jobID &&
    prevProps.job.status === nextProps.job.status &&
    prevProps.job.progress === nextProps.job.progress &&
    prevProps.job.name === nextProps.job.name &&
    prevProps.job.priority === nextProps.job.priority &&
    prevProps.actionLoading === nextProps.actionLoading
  );
});

JobTableRow.displayName = 'JobTableRow';