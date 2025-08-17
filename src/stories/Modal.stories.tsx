import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal, Button, Input, Select } from '@/components/ui';
import { JobPriority } from '@/types/enums';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateJobModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Create Job Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Create New Job"
        >
          <Input label="Job Name" placeholder="Enter job name" required />
          <Select label="Priority" required>
            <option value={JobPriority.Regular}>Regular</option>
            <option value={JobPriority.High}>High</option>
          </Select>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Create Job
            </Button>
          </div>
        </Modal>
      </>
    );
  },
};