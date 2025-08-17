import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from '@/components/ui';
import { JobStatus } from '@/types/enums';

const meta: Meta<typeof StatusBadge> = {
  title: 'UI/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: Object.values(JobStatus).filter(v => typeof v === 'number'),
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {
    status: JobStatus.Pending,
  },
};

export const InQueue: Story = {
  args: {
    status: JobStatus.InQueue,
  },
};

export const Running: Story = {
  args: {
    status: JobStatus.Running,
  },
};

export const Completed: Story = {
  args: {
    status: JobStatus.Completed,
  },
};

export const Failed: Story = {
  args: {
    status: JobStatus.Failed,
  },
};

export const Stopped: Story = {
  args: {
    status: JobStatus.Stopped,
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
      <StatusBadge status={JobStatus.Pending} />
      <StatusBadge status={JobStatus.InQueue} />
      <StatusBadge status={JobStatus.Running} />
      <StatusBadge status={JobStatus.Completed} />
      <StatusBadge status={JobStatus.Failed} />
      <StatusBadge status={JobStatus.Stopped} />
    </div>
  ),
};

export const SmallSize: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <StatusBadge status={JobStatus.Running} size="sm" />
      <StatusBadge status={JobStatus.Completed} size="sm" />
      <StatusBadge status={JobStatus.Failed} size="sm" />
    </div>
  ),
};