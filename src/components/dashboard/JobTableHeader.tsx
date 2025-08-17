import React from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from '@/hooks/useTranslation';
import type { JobSorting } from '@/types';
import type { Job } from '@/types';

interface JobTableHeaderProps {
  sorting: JobSorting;
  onSort: (column: keyof Job, direction: 'asc' | 'desc') => void;
}

const HeaderRow = styled.tr`
  background-color: #2d3748;
  color: white;
`;

const HeaderCell = styled.th.withConfig({
  shouldForwardProp: (prop) => prop !== 'sortable' && prop !== 'active'
})<{ sortable?: boolean; active?: boolean }>`
  padding: 16px 12px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #4a5568;
  position: relative;
  
  ${({ sortable }) => sortable && css`
    cursor: pointer;
    user-select: none;
    
    &:hover {
      background-color: #4a5568;
    }
  `}
  
  ${({ active }) => active && css`
    background-color: #4a5568;
  `}

  &:first-child {
    border-top-left-radius: 8px;
    
    [dir="rtl"] & {
      border-top-left-radius: 0;
      border-top-right-radius: 8px;
    }
  }
  
  &:last-child {
    border-top-right-radius: 8px;
    
    [dir="rtl"] & {
      border-top-right-radius: 0;
      border-top-left-radius: 8px;
    }
  }

  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 12px;
  }
`;

const SortIcon = styled.span<{ direction: 'asc' | 'desc' }>`
  margin-left: 8px;
  font-size: 12px;
  
  &::after {
    content: ${({ direction }) => direction === 'asc' ? '"↑"' : '"↓"'};
  }
`;

export const JobTableHeader: React.FC<JobTableHeaderProps> = ({ 
  sorting, 
  onSort 
}) => {
  const { t } = useTranslation();
  
  const columns = [
    { key: 'name' as keyof Job, label: t('jobTable.columns.jobName'), sortable: true },
    { key: 'priority' as keyof Job, label: t('jobTable.columns.priority'), sortable: true },
    { key: 'status' as keyof Job, label: t('jobTable.columns.status'), sortable: true },
    { key: 'progress' as keyof Job, label: t('jobTable.columns.progress'), sortable: true },
    { key: 'createdAt' as keyof Job, label: t('jobTable.columns.startTime'), sortable: true },
    { key: 'completedAt' as keyof Job, label: t('jobTable.columns.endTime'), sortable: true },
    { key: 'actions' as const, label: t('jobTable.columns.actions'), sortable: false },
  ];
  const handleSort = (column: keyof Job) => {
    if (sorting.column === column) {
      // Toggle direction if same column
      const newDirection = sorting.direction === 'asc' ? 'desc' : 'asc';
      onSort(column, newDirection);
    } else {
      // Default to ascending for new column
      onSort(column, 'asc');
    }
  };

  return (
    <thead>
      <HeaderRow>
        {columns.map((column) => (
          <HeaderCell
            key={column.key}
            sortable={column.sortable}
            active={column.sortable && sorting.column === column.key}
            onClick={() => column.sortable && column.key !== 'actions' && handleSort(column.key as keyof Job)}
            data-testid={`header-${column.key}`}
          >
            {column.label}
            {column.sortable && sorting.column === column.key && (
              <SortIcon direction={sorting.direction} />
            )}
          </HeaderCell>
        ))}
      </HeaderRow>
    </thead>
  );
};