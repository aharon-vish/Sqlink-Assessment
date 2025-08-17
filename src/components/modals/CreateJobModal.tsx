import React from 'react';
import { Modal } from '@/components/ui';
import { CreateJobForm } from '@/components/forms/CreateJobForm';
import { useUIStore } from '@/stores/uiStore';
import { useJobStore } from '@/stores/jobStore';
import { apiService } from '@/services';
import { useTranslation } from '@/hooks/useTranslation';
import type { CreateJobFormData } from '@/types';

export const CreateJobModal: React.FC = () => {
  const { 
    isCreateJobModalOpen, 
    closeCreateJobModal, 
    loadingStates, 
    setLoadingState 
  } = useUIStore();
  
  const { addJob, setError } = useJobStore();
  const { t } = useTranslation();

  const isLoading = loadingStates['create-job'] || false;

  const handleSubmit = async (data: CreateJobFormData) => {
    const loadingKey = 'create-job';
    
    try {
      setLoadingState(loadingKey, true);
      setError(null);

      const newJob = await apiService.createJob(data);
      addJob(newJob);
      closeCreateJobModal();
    } catch (error) {
      console.error('Failed to create job:', error);
      setError(error instanceof Error ? error.message : 'Failed to create job');
      throw error; // Re-throw to show form error
    } finally {
      setLoadingState(loadingKey, false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      closeCreateJobModal();
    }
  };

  return (
    <Modal
      isOpen={isCreateJobModalOpen}
      onClose={handleCancel}
      title={t('createJobModal.title')}
      size="md"
    >
      <CreateJobForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={isLoading}
      />
    </Modal>
  );
};