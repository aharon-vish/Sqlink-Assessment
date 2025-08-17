import React from 'react';
import { CreateJobModal } from './CreateJobModal';
import { DeleteJobsModal } from './DeleteJobsModal';

export const ModalManager: React.FC = () => {
  return (
    <>
      <CreateJobModal />
      <DeleteJobsModal />
    </>
  );
};