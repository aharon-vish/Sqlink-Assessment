import { describe, it, expect, beforeEach } from 'vitest';
import { getServiceConfig, isMockMode } from '@/services/serviceConfig';
import { mockApiService } from '@/services/mockApiService';
import { JobPriority } from '@/types/enums';

describe('Service Configuration', () => {
  it('should return mock mode by default', () => {
    const config = getServiceConfig();
    expect(config.apiMode).toBe('mock');
    expect(isMockMode()).toBe(true);
  });

  it('should have correct default URLs', () => {
    const config = getServiceConfig();
    expect(config.apiBaseUrl).toBe('https://localhost:5001');
    expect(config.signalRHubUrl).toBe('https://localhost:5001/JobSignalRHub');
  });
});

describe('Mock API Service', () => {
  it('should generate initial jobs', async () => {
    const jobs = await mockApiService.getAllJobs();
    expect(jobs).toBeDefined();
    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs[0]).toHaveProperty('jobID');
    expect(jobs[0]).toHaveProperty('name');
    expect(jobs[0]).toHaveProperty('status');
  });

  it('should create a new job', async () => {
    const jobRequest = {
      name: 'Test Job',
      priority: JobPriority.Regular
    };
    
    const job = await mockApiService.createJob(jobRequest);
    expect(job.name).toBe('Test Job');
    expect(job.priority).toBe(JobPriority.Regular);
    expect(job.jobID).toBeDefined();
  });

  it('should throw error for empty job name', async () => {
    const jobRequest = {
      name: '',
      priority: JobPriority.Regular
    };
    
    await expect(mockApiService.createJob(jobRequest)).rejects.toThrow('Job name is required');
  });
});