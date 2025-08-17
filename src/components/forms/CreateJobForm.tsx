import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Select, Button } from '@/components/ui';
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
  name?: string;
  priority?: string;
  submit?: string;
}

export const CreateJobForm: React.FC<CreateJobFormProps> = ({
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateJobFormData>({
    name: '',
    priority: JobPriority.Regular
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: keyof CreateJobFormData, value: string | JobPriority): string | undefined => {
    switch (field) {
      case 'name': {
        const trimmedName = (value as string).trim();
        if (!trimmedName) {
          return 'Job name is required';
        }
        if (trimmedName.length < 3) {
          return 'Job name must be at least 3 characters';
        }
        if (trimmedName.length > 100) {
          return 'Job name must be less than 100 characters';
        }
        if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
          return 'Job name can only contain letters, numbers, spaces, hyphens, and underscores';
        }
        return undefined;
      }
      
      case 'priority': {
        if (value !== JobPriority.Regular && value !== JobPriority.High) {
          return 'Please select a valid priority';
        }
        return undefined;
      }
      
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate all fields
    Object.keys(formData).forEach(field => {
      const error = validateField(field as keyof CreateJobFormData, formData[field as keyof CreateJobFormData]);
      if (error) {
        newErrors[field as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: keyof CreateJobFormData, value: string | JobPriority) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Validate field on change if it was touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleFieldBlur = (field: keyof CreateJobFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      priority: true
    });

    if (!validateForm()) {
      return;
    }

    try {
      // Clear any previous submit errors
      setErrors(prev => ({ ...prev, submit: undefined }));
      
      await onSubmit({
        name: formData.name.trim(),
        priority: formData.priority
      });
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Failed to create job'
      }));
    }
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      {errors.submit && (
        <ErrorMessage>{errors.submit}</ErrorMessage>
      )}
      
      <Input
        label="Job Name"
        placeholder="Enter job name"
        value={formData.name}
        onChange={(e) => handleFieldChange('name', e.target.value)}
        onBlur={() => handleFieldBlur('name')}
        error={touched.name ? errors.name : undefined}
        required
        data-testid="job-name-input"
      />
      
      <Select
        label="Priority"
        value={formData.priority.toString()}
        onChange={(e) => handleFieldChange('priority', parseInt(e.target.value) as JobPriority)}
        onBlur={() => handleFieldBlur('priority')}
        error={touched.priority ? errors.priority : undefined}
        required
        data-testid="job-priority-select"
      >
        <option value={JobPriority.Regular}>
          {getJobPriorityLabel(JobPriority.Regular)}
        </option>
        <option value={JobPriority.High}>
          {getJobPriorityLabel(JobPriority.High)}
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
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary"
          loading={loading}
          data-testid="create-job-btn"
        >
          Create Job
        </Button>
      </FormActions>
    </Form>
  );
};