import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Select, Button } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import type { CreateJobFormData } from '@/types';
import { JobPriority, getJobPriorityLabel } from '@/types/enums';

interface CreateJobFormProps {
  onSubmit: (data: CreateJobFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  submit?: string;
}

export const CreateJobForm: React.FC<CreateJobFormProps> = ({
  onSubmit,
  onCancel,
  loading = false
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateJobFormData>({
    name: '',
    priority: JobPriority.Regular
  });
  
  const [errors, setErrors] = useState<FormErrors>({});


  const handleFieldChange = (field: keyof CreateJobFormData, value: string | JobPriority) => {
    console.log('handleFieldChange called:', field, value, 'current state:', formData);
    setFormData(prev => {
      const newState = { ...prev, [field]: value };
      console.log('New state:', newState);
      return newState;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setErrors(prev => ({ ...prev, submit: undefined }));
      
      onSubmit({
        name: formData.name.trim(),
        priority: formData.priority
      });
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : t('createJobForm.errors.submitFailed')
      }));
    }
  };

  console.log('Rendering with formData:', formData);
  
  return (
    <Form onSubmit={handleSubmit} noValidate>
      {errors.submit && (
        <ErrorMessage>{errors.submit}</ErrorMessage>
      )}
      
      <Input
        label={t('createJobForm.labels.jobName')}
        placeholder={t('createJobForm.placeholders.jobName')}
        value={formData.name}
        onChange={(e) => handleFieldChange('name', e.target.value)}
        required
        disabled={loading}
        data-testid="modal-submit-create-job"
      />
      
      <Select
        label={t('createJobForm.labels.priority')}
        value={formData.priority.toString()}
        onChange={(e) => {
          console.log('Select changed:', e.target.value, 'parsed:', parseInt(e.target.value));
          handleFieldChange('priority', parseInt(e.target.value) as JobPriority);
        }}
        required
        disabled={loading}
        data-testid="job-priority-select"
      >
        <option value="0">
          {t(`createJobForm.priority.${getJobPriorityLabel(JobPriority.Regular)}`)}
        </option>
        <option value="1">
          {t(`createJobForm.priority.${getJobPriorityLabel(JobPriority.High)}`)}
        </option>
      </Select>

      <FormActions>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel}
          disabled={loading}
          data-testid="cancel-job-btn"
        >
          {t('createJobForm.buttons.cancel')}
        </Button>
        <Button 
          type="submit" 
          variant="primary"
          loading={loading}
          data-testid="create-job-btn"
        >
          {t('createJobForm.buttons.create')}
        </Button>
      </FormActions>
    </Form>
  );
};