import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/ui';
import type { Job } from '@/types';
import { canStopJob, canRestartJob, canDeleteJob } from '@/types/enums';

interface JobActionsProps {
  job: Job;
  onAction: (jobId: string, action: 'delete' | 'restart' | 'stop') => void;
  loading?: boolean;
}

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;
`;

const ConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ConfirmContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
`;

const ConfirmTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #2d3748;
  font-size: 18px;
`;

const ConfirmMessage = styled.p`
  margin: 0 0 20px 0;
  color: #4a5568;
  line-height: 1.5;
`;

const ConfirmActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const JobActions: React.FC<JobActionsProps> = ({ 
  job, 
  onAction, 
  loading = false 
}) => {
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'restart' | 'stop';
    title: string;
    message: string;
  } | null>(null);

  const handleActionClick = (action: 'delete' | 'restart' | 'stop') => {
    const confirmations = {
      delete: {
        type: 'delete' as const,
        title: 'Delete Job',
        message: `Are you sure you want to delete "${job.name}"? This action cannot be undone.`
      },
      restart: {
        type: 'restart' as const,
        title: 'Restart Job',
        message: `Are you sure you want to restart "${job.name}"? The job will start from the beginning.`
      },
      stop: {
        type: 'stop' as const,
        title: 'Stop Job',
        message: `Are you sure you want to stop "${job.name}"? You can restart it later.`
      }
    };

    setConfirmAction(confirmations[action]);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      onAction(job.jobID, confirmAction.type);
      setConfirmAction(null);
    }
  };

  const handleCancel = () => {
    setConfirmAction(null);
  };

  return (
    <>
      <ActionsContainer>
        {canDeleteJob(job.status) && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleActionClick('delete')}
            disabled={loading}
            data-testid={`delete-job-${job.jobID}`}
          >
            Delete
          </Button>
        )}
        
        {canRestartJob(job.status) && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleActionClick('restart')}
            disabled={loading}
            data-testid={`restart-job-${job.jobID}`}
          >
            Restart
          </Button>
        )}
        
        {canStopJob(job.status) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleActionClick('stop')}
            disabled={loading}
            data-testid={`stop-job-${job.jobID}`}
          >
            Stop
          </Button>
        )}
      </ActionsContainer>

      {confirmAction && (
        <ConfirmDialog onClick={handleCancel}>
          <ConfirmContent onClick={(e) => e.stopPropagation()}>
            <ConfirmTitle>{confirmAction.title}</ConfirmTitle>
            <ConfirmMessage>{confirmAction.message}</ConfirmMessage>
            <ConfirmActions>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                variant={confirmAction.type === 'delete' ? 'danger' : 'primary'}
                onClick={handleConfirm}
                loading={loading}
              >
                {confirmAction.type === 'delete' ? 'Delete' : 
                 confirmAction.type === 'restart' ? 'Restart' : 'Stop'}
              </Button>
            </ConfirmActions>
          </ConfirmContent>
        </ConfirmDialog>
      )}
    </>
  );
};