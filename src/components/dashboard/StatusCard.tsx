import React from 'react';
import styled, { css } from 'styled-components';
import type { StatusCardProps } from '@/types';
import { getJobStatusLabel, getJobStatusColor } from '@/types/enums';
import { useTranslation } from '@/hooks/useTranslation';

const CardContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'color'
})<{ color: string; isActive: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 28px 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  ${({ isActive, color }) => isActive && css`
    border-color: ${color};
    box-shadow: 0 4px 12px ${color}30;
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background-color: ${({ color }) => color};
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
    min-height: 120px;
  }
`;

const Count = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 8px;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #718096;
  text-transform: capitalize;
`;

const StatusIcon = styled.div<{ color: string }>`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

export const StatusCard: React.FC<StatusCardProps> = ({
  status,
  count,
  onClick,
  isActive = false
}) => {
  const { t } = useTranslation();
  
  const handleClick = () => {
    onClick(status);
  };

  const labelKey = getJobStatusLabel(status);
  const label = t(`jobStatus.${labelKey}`);
  const color = getJobStatusColor(status);

  return (
    <CardContainer 
      color={color} 
      isActive={isActive}
      onClick={handleClick}
      data-testid={`status-card-${status}`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      className="status-card"
    >
      <StatusIcon color={color} />
      <Count>{count}</Count>
      <Label>{label}</Label>
    </CardContainer>
  );
};