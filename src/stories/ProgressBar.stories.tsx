import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from '@/components/ui';
import { JobStatus } from '@/types/enums';

const meta: Meta<typeof ProgressBar> = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {
  args: {
    progress: 65,
    status: JobStatus.Running,
  },
};

export const Completed: Story = {
  args: {
    progress: 100,
    status: JobStatus.Completed,
  },
};

export const Failed: Story = {
  args: {
    progress: 45,
    status: JobStatus.Failed,
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <ProgressBar progress={0} status={JobStatus.Pending} />
      <ProgressBar progress={0} status={JobStatus.InQueue} />
      <ProgressBar progress={65} status={JobStatus.Running} />
      <ProgressBar progress={100} status={JobStatus.Completed} />
      <ProgressBar progress={45} status={JobStatus.Failed} />
      <ProgressBar progress={30} status={JobStatus.Stopped} />
    </div>
  ),
};