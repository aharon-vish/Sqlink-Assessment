import React from 'react';
import styled from 'styled-components';
import { JobStatus, getJobStatusLabel, getJobStatusColor } from '@/types/enums';
import { useTranslation } from '@/hooks/useTranslation';

interface StatusBadgeProps {
  status: JobStatus;
  size?: 'sm' | 'md';
}

const Badge = styled.span<{ color: string; size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ size }) => size === 'sm' ? '2px 8px' : '4px 12px'};
  border-radius: 12px;
  font-size: ${({ size }) => size === 'sm' ? '12px' : '14px'};
  font-weight: 500;
  background-color: ${({ color }) => color}15;
  color: ${({ color }) => color};
  border: 1px solid ${({ color }) => color}30;
`;

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  const { t } = useTranslation();
  const color = getJobStatusColor(status);
  const labelKey = getJobStatusLabel(status);
  const label = t(`jobStatus.${labelKey}`);

  return (
    <Badge color={color} size={size}>
      {label}
    </Badge>
  );
};