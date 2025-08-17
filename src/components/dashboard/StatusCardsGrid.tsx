import React from 'react';
import styled from 'styled-components';
import { StatusCard } from './StatusCard';
import { useJobStore } from '@/stores/jobStore';
import { JobStatus } from '@/types/enums';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingSkeleton = styled.div`
  background: #f7fafc;
  border-radius: 12px;
  padding: 24px;
  height: 120px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.6),
      transparent
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }
`;

export const StatusCardsGrid: React.FC = () => {
  const { 
    statusCards, 
    isLoading, 
    filters, 
    setStatusFilter 
  } = useJobStore();

  const handleCardClick = (status: JobStatus) => {
    // Toggle filter: if same status is clicked, clear filter
    if (filters.status === status) {
      setStatusFilter(undefined);
    } else {
      setStatusFilter(status);
    }
  };

  if (isLoading) {
    return (
      <GridContainer>
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </GridContainer>
    );
  }

  return (
    <GridContainer>
      {statusCards.map((card) => (
        <StatusCard
          key={card.status}
          status={card.status}
          count={card.count}
          onClick={handleCardClick}
          isActive={filters.status === card.status}
        />
      ))}
    </GridContainer>
  );
};