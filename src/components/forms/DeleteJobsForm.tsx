import React, { useState } from 'react';
import styled from 'styled-components';
import { Select, Button } from '@/components/ui';
import type { DeleteJobsFormData } from '@/types';
import { JobStatus, getJobStatusLabel, canBulkDeleteStatus } from '@/types/enums';
import { useJobStore } from '@/stores/jobStore';

interface DeleteJobsFormProps {
  onSubmit: (data: DeleteJobsFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const WarningBox = styled.div`
  background-color: #fef5e7;
  border: 1px solid #f6e05e;
  color: #744210;
  padding: 16px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
`;

const JobCountInfo = styled.div`
  background-color: #e6fffa;
  border: 1px solid #81e6d9;
  color: #234e52;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  margin-top: 8px;
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
`;

const ErrorMessage = styled.div`
  background-color: #fed7d7;
  border: 1px solid #feb2b2;
  color: #c53030;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
`;

interface FormErrors {
  status?: string;
  submit?: string;
}

export const DeleteJobsForm: React.FC<DeleteJobsFormProps> = ({
  onSubmit,
  onCancel,
  loading = false
}) => {
  const { getJobsByStatus } = useJobStore();
  
  const [formData, setFormData] = useState<DeleteJobsFormData>({
    status: JobStatus.Failed
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const availableStatuses = Object.values(JobStatus)
    .filter((status): status is JobStatus => 
      typeof status === 'number' && canBulkDeleteStatus(status)
    );

  const selectedJobCount = getJobsByStatus(formData.status).length;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!canBulkDeleteStatus(formData.status)) {
      newErrors.status = 'Invalid status selected for bulk delete';
    }

    if (selectedJobCount === 0) {
      newErrors.submit = `No ${getJobStatusLabel(formData.status).toLowerCase()} jobs found to delete`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = parseInt(e.target.value) as JobStatus;
    setFormData({ status });
    
    // Clear errors when status changes
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Clear any previous submit errors
      setErrors(prev => ({ ...prev, submit: undefined }));
      
      await onSubmit(formData);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Failed to delete jobs'
      }));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {errors.submit && (
        <ErrorMessage>{errors.submit}</ErrorMessage>
      )}
      
      <WarningBox>
        <strong>Warning:</strong> This action will permanently delete all jobs with the selected status. 
        This cannot be undone.
      </WarningBox>
      
      <Select
        label="Status to Delete"
        value={formData.status.toString()}
        onChange={handleStatusChange}
        error={errors.status}
        required
        data-testid="delete-status-select"
      >
        {availableStatuses.map((status) => (
          <option key={status} value={status}>
            {getJobStatusLabel(status)}
          </option>
        ))}
      </Select>

      <JobCountInfo>
        <strong>{selectedJobCount}</strong> {getJobStatusLabel(formData.status).toLowerCase()} job(s) will be deleted.
      </JobCountInfo>

      <FormActions>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel}
          disabled={loading}
          data-testid="cancel-delete-btn"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="danger"
          loading={loading}
          disabled={selectedJobCount === 0}
          data-testid="confirm-delete-btn"
        >
          Delete {selectedJobCount} Job(s)
        </Button>
      </FormActions>
    </Form>
  );
};