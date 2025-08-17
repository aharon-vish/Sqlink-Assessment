import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { UIStore } from '@/types';

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      // Modal states
      isCreateJobModalOpen: false,
      isDeleteJobsModalOpen: false,

      // Loading states
      loadingStates: {},

      // Actions
      openCreateJobModal: () => {
        set({ isCreateJobModalOpen: true }, false, 'openCreateJobModal');
      },

      closeCreateJobModal: () => {
        set({ isCreateJobModalOpen: false }, false, 'closeCreateJobModal');
      },

      openDeleteJobsModal: () => {
        set({ isDeleteJobsModalOpen: true }, false, 'openDeleteJobsModal');
      },

      closeDeleteJobsModal: () => {
        set({ isDeleteJobsModalOpen: false }, false, 'closeDeleteJobsModal');
      },

      setLoadingState: (key, loading) => {
        set(
          (state) => ({
            loadingStates: {
              ...state.loadingStates,
              [key]: loading,
            },
          }),
          false,
          'setLoadingState'
        );
      },
    }),
    {
      name: 'ui-store',
    }
  )
);