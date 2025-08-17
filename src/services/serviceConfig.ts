import type { ServiceConfig } from '@/types';

export const getServiceConfig = (): ServiceConfig => {
  return {
    apiMode: (import.meta.env.VITE_API_MODE as 'mock' | 'real') || 'mock',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001',
    signalRHubUrl: import.meta.env.VITE_SIGNALR_HUB_URL || 'https://localhost:5001/JobSignalRHub',
  };
};

export const isMockMode = (): boolean => {
  return getServiceConfig().apiMode === 'mock';
};