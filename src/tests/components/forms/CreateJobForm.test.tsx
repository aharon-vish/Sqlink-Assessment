import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateJobForm } from '@/components/forms/CreateJobForm';
import { JobPriority } from '@/types/enums';

describe('CreateJobForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form elements correctly', () => {
    render(
      <CreateJobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    expect(screen.getByLabelText(/job name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create job/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(
      <CreateJobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const submitButton = screen.getByRole('button', { name: /create job/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/job name is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates minimum length', async () => {
    const user = userEvent.setup();
    render(
      <CreateJobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const nameInput = screen.getByLabelText(/job name/i);
    await user.type(nameInput, 'AB');
    
    const submitButton = screen.getByRole('button', { name: /create job/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(
      <CreateJobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const nameInput = screen.getByLabelText(/job name/i);
    const prioritySelect = screen.getByLabelText(/priority/i);

    await user.type(nameInput, 'Test Job Name');
    await user.selectOptions(prioritySelect, JobPriority.High.toString());

    const submitButton = screen.getByRole('button', { name: /create job/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Job Name',
        priority: JobPriority.High,
      });
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CreateJobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('disables form during loading', () => {
    render(
      <CreateJobForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
        loading={true} 
      />
    );

    expect(screen.getByLabelText(/job name/i)).toBeDisabled();
    expect(screen.getByLabelText(/priority/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /create job/i })).toBeDisabled();
  });
});