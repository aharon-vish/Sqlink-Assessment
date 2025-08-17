import React from 'react';
import styled, { css } from 'styled-components';
import type { ProgressBarProps } from '@/types';
import { getJobStatusColor } from '@/types/enums';

const ProgressContainer = styled.div<{ size: 'sm' | 'md' | 'lg' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return css`font-size: 12px;`;
      case 'md':
        return css`font-size: 14px;`;
      case 'lg':
        return css`font-size: 16px;`;
    }
  }}
`;

const ProgressTrack = styled.div<{ size: 'sm' | 'md' | 'lg' }>`
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  flex: 1;
  
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return css`height: 6px;`;
      case 'md':
        return css`height: 8px;`;
      case 'lg':
        return css`height: 12px;`;
    }
  }}
`;

const ProgressFill = styled.div<{ $progress: number; $color: string }>`
  height: 100%;
  background-color: ${({ $color }) => $color};
  width: ${({ $progress }) => $progress}%;
  transition: width 0.3s ease-in-out;
  border-radius: inherit;
`;

const ProgressText = styled.span`
  color: #718096;
  font-weight: 500;
  min-width: 40px;
  text-align: right;
`;

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status,
  size = 'md',
  showPercentage = true
}) => {
  const color = getJobStatusColor(status);
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <ProgressContainer size={size}>
      <ProgressTrack size={size}>
        <ProgressFill $progress={clampedProgress} $color={color} />
      </ProgressTrack>
      {showPercentage && (
        <ProgressText>{clampedProgress}%</ProgressText>
      )}
    </ProgressContainer>
  );
};