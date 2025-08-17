import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
      // Simple mock that returns the key with interpolated params
      if (params) {
        return key.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => params[paramKey] || match);
      }
      return key;
    },
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
    currentLanguage: 'en',
    isRTL: false,
    changeLanguage: vi.fn(),
    formatDate: (timestamp: number) => new Date(timestamp).toLocaleString(),
    formatNumber: (num: number) => num.toString(),
  }),
}));

// Mock SignalR service
vi.mock('@/services', () => ({
  mockApiService: {
    getAllJobs: vi.fn(),
    createJob: vi.fn(),
    deleteJob: vi.fn(),
    stopJob: vi.fn(),
    restartJob: vi.fn(),
    deleteJobsByStatus: vi.fn(),
  },
  mockSignalRService: {
    start: vi.fn(),
    stop: vi.fn(),
    onJobProgressUpdate: vi.fn(),
    offJobProgressUpdate: vi.fn(),
    getConnectionState: vi.fn(() => 'Connected'),
  },
  apiService: {
    getAllJobs: vi.fn(),
    createJob: vi.fn(),
    deleteJob: vi.fn(),
    stopJob: vi.fn(),
    restartJob: vi.fn(),
    deleteJobsByStatus: vi.fn(),
  },
  signalRService: {
    start: vi.fn(),
    stop: vi.fn(),
    onJobProgressUpdate: vi.fn(),
    offJobProgressUpdate: vi.fn(),
    getConnectionState: vi.fn(() => 'Connected'),
  },
}));

// Mock UUID
vi.mock('uuid', () => ({
  v4: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
}));

// Extend expect with custom matchers
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = received && received.ownerDocument && received.ownerDocument.body.contains(received);
    return {
      pass,
      message: () => pass 
        ? `Expected element not to be in the document`
        : `Expected element to be in the document`,
    };
  },
});

afterEach(() => {
  cleanup();
});