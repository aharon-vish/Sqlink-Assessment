import React from 'react';
import { Modal } from '@/components/ui';
import { DeleteJobsForm } from '@/components/forms/DeleteJobsForm';
import { useUIStore } from '@/stores/uiStore';
import { useJobStore } from '@/stores/jobStore';
import { apiService } from '@/services';
import type { DeleteJobsFormData } from '@/types';

export const DeleteJobsModal: React.FC = () => {
  const { 
    isDeleteJobsModalOpen, 
    closeDeleteJobsModal, 
    loadingStates, 
    setLoadingState 
  } = useUIStore();
  
  const { removeJobsByStatus, setError } = useJobStore();

  const isLoading = loadingStates['delete-jobs'] || false;

  const handleSubmit = async (data: DeleteJobsFormData) => {
    const loadingKey = 'delete-jobs';
    
    try {
      setLoadingState(loadingKey, true);
      setError(null);

      await apiService.deleteJobsByStatus(data.status);
      removeJobsByStatus(data.status);
      closeDeleteJobsModal();
    } catch (error) {
      console.error('Failed to delete jobs:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete jobs');
      throw error; // Re-throw to show form error
    } finally {
      setLoadingState(loadingKey, false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      closeDeleteJobsModal();
    }
  };

  return (
    <Modal
      isOpen={isDeleteJobsModalOpen}
      onClose={handleCancel}
      title="Delete Jobs"
      size="md"
    >
      <DeleteJobsForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={isLoading}
      />
    </Modal>
  );
};