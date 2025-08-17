import '@testing-library/jest-dom';
import { expect, afterEach, vi, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Enhanced i18n mock
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
      // Mock translation map for better testing
      const translations: Record<string, string> = {
        'dashboard.title': 'Job Dashboard',
        'dashboard.createNewJob': 'Create New Job',
        'dashboard.deleteJobs': 'Delete Jobs',
        'dashboard.searchPlaceholder': 'Search jobs by name...',
        'dashboard.showingResults': 'Showing {{count}} of {{total}} jobs',
        'dashboard.clearFilters': 'Clear Filters',
        'dashboard.noJobsFound': 'No jobs found',
        'jobStatus.pending': 'Pending',
        'jobStatus.inQueue': 'In Queue',
        'jobStatus.running': 'Running',
        'jobStatus.completed': 'Completed',
        'jobStatus.failed': 'Failed',
        'jobStatus.stopped': 'Stopped',
        'connectionStatus.connected': 'Real-time Connected',
        'createJobModal.title': 'Create New Job',
        'common.loading': 'Loading...',
      };
      
      let result = translations[key] || key;
      
      // Handle interpolation
      if (params) {
        result = result.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => 
          params[paramKey]?.toString() || match
        );
      }
      
      return result;
    },
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
    currentLanguage: 'en',
    isRTL: false,
    changeLanguage: vi.fn(),
    formatDate: (timestamp: number) => {
      if (!timestamp) return '-';
      return new Date(timestamp).toLocaleString();
    },
    formatNumber: (num: number) => num.toString(),
  }),
}));

// Mock services with proper implementation
const mockJobs = [
  {
    jobID: 'test-job-1',
    name: 'Test Job 1',
    status: 2, // Running
    priority: 1, // High
    progress: 50,
    createdAt: Date.now() - 3600000,
    startedAt: Date.now() - 1800000,
    completedAt: 0,
    errorMessage: null,
  },
  {
    jobID: 'test-job-2',
    name: 'Test Job 2',
    status: 3, // Completed
    priority: 0, // Regular
    progress: 100,
    createdAt: Date.now() - 7200000,
    startedAt: Date.now() - 5400000,
    completedAt: Date.now() - 3600000,
    errorMessage: null,
  },
];

const mockApiService = {
  getAllJobs: vi.fn().mockResolvedValue(mockJobs),
  createJob: vi.fn(),
  deleteJob: vi.fn(),
  stopJob: vi.fn(),
  restartJob: vi.fn(),
  deleteJobsByStatus: vi.fn(),
};

const mockSignalRService = {
  start: vi.fn().mockResolvedValue(undefined),
  stop: vi.fn().mockResolvedValue(undefined),
  onJobProgressUpdate: vi.fn(),
  offJobProgressUpdate: vi.fn(),
  getConnectionState: vi.fn(() => 'Connected'),
};

vi.mock('@/services', () => ({
  mockApiService,
  mockSignalRService,
  apiService: mockApiService,
  signalRService: mockSignalRService,
  isMockMode: vi.fn(() => true),
}));

// Mock UUID
vi.mock('uuid', () => ({
  v4: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
}));

// Global test cleanup
beforeAll(() => {
  // Setup any global test configuration
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  // Reset mock implementations
  mockApiService.getAllJobs.mockResolvedValue(mockJobs);
});

afterAll(() => {
  // Cleanup any global resources
});