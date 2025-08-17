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

  @media (max-width: 768px) {
    padding: 24px 0;
    margin-bottom: 32px;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

export const DashboardHeader: React.FC = () => {
  const { openCreateJobModal, openDeleteJobsModal } = useUIStore();
  const { t } = useTranslation();

  return (
    <HeaderContainer>
      <Title>{t('dashboard.title')}</Title>
      <HeaderRight>
        <LanguageSelector />
        <ConnectionStatus />
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