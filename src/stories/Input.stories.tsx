import type { Meta, StoryObj } from '@storybook/react';
import { Input, Select } from '@/components/ui';
import { JobPriority } from '@/types/enums';

const InputMeta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

const SelectMeta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default InputMeta;
type InputStory = StoryObj<typeof InputMeta>;
type SelectStory = StoryObj<typeof SelectMeta>;

export const Default: InputStory = {
  args: {
    placeholder: 'Enter text here...',
  },
};

export const WithLabel: InputStory = {
  args: {
    label: 'Job Name',
    placeholder: 'Enter job name',
  },
};

export const Required: InputStory = {
  args: {
    label: 'Job Name',
    placeholder: 'Enter job name',
    required: true,
  },
};

export const WithError: InputStory = {
  args: {
    label: 'Job Name',
    placeholder: 'Enter job name',
    error: 'This field is required',
    value: '',
  },
};

export const Disabled: InputStory = {
  args: {
    label: 'Job Name',
    placeholder: 'Enter job name',
    disabled: true,
    value: 'Disabled input',
  },
};

export const SelectDefault: SelectStory = {
  render: () => (
    <Select label="Priority" placeholder="Select priority">
      <option value="">Select an option</option>
      <option value={JobPriority.Regular}>Regular</option>
      <option value={JobPriority.High}>High</option>
    </Select>
  ),
};

export const SelectRequired: SelectStory = {
  render: () => (
    <Select label="Priority" required>
      <option value="">Select priority</option>
      <option value={JobPriority.Regular}>Regular</option>
      <option value={JobPriority.High}>High</option>
    </Select>
  ),
};

export const SelectWithError: SelectStory = {
  render: () => (
    <Select label="Priority" error="Please select a priority" required>
      <option value="">Select priority</option>
      <option value={JobPriority.Regular}>Regular</option>
      <option value={JobPriority.High}>High</option>
    </Select>
  ),
};

export const FormExample: InputStory = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Input label="Job Name" placeholder="Enter job name" required />
      <Select label="Priority" required>
        <option value="">Select priority</option>
        <option value={JobPriority.Regular}>Regular</option>
        <option value={JobPriority.High}>High</option>
      </Select>
      <Input label="Description" placeholder="Optional description" />
    </div>
  ),
};