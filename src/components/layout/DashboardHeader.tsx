import React from 'react';
import styled from 'styled-components';
import { Button, ConnectionStatus } from '@/components/ui';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useUIStore } from '@/stores/uiStore';
import { useTranslation } from '@/hooks/useTranslation';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 24px 0;
    margin-bottom: 32px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px 0;
    margin-bottom: 24px;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 4px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    gap: 12px;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    width: 100%;
    
    button {
      flex: 1;
      min-width: 0;
      font-size: 14px;
      padding: 8px 12px;
    }
  }
`;

const UtilitySection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const DashboardHeader: React.FC = () => {
  const { openCreateJobModal, openDeleteJobsModal } = useUIStore();
  const { t } = useTranslation();

  return (
    <HeaderContainer>
      <Title>{t('dashboard.title')}</Title>
      <HeaderRight>
        <UtilitySection>
          <LanguageSelector />
          <ConnectionStatus />
        </UtilitySection>
        <ActionButtons>
          <Button 
            variant="primary" 
            onClick={openCreateJobModal}
            data-testid="header-create-job-btn"
          >
            {t('dashboard.createNewJob')}
          </Button>
          <Button 
            variant="danger" 
            onClick={openDeleteJobsModal}
            data-testid="header-delete-jobs-btn"
          >
            {t('dashboard.deleteJobs')}
          </Button>
        </ActionButtons>
      </HeaderRight>
    </HeaderContainer>
  );
};