import type { JobAPI, JobSignalRHub } from '@/types';
import { mockApiService } from './mockApiService';
import { mockSignalRService } from './mockSignalRService';
import { realSignalRService } from './realSignalRService';
import { isMockMode } from './serviceConfig';

// Real API service placeholder (will throw errors since no backend)
class RealApiService implements JobAPI {
  private baseUrl = import.meta.env.VITE_API_BASE_URL;

  async getAllJobs() {
    const response = await fetch(`${this.baseUrl}/Jobs`);
    if (!response.ok) throw new Error('Failed to fetch jobs');
    return response.json();
  }

  async createJob(request: any) {
    const response = await fetch(`${this.baseUrl}/Jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to create job');
    return response.json();
  }

  async stopJob(jobId: string) {
    const response = await fetch(`${this.baseUrl}/Jobs/${jobId}/stop`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to stop job');
    return response.json();
  }

  async restartJob(jobId: string) {
    const response = await fetch(`${this.baseUrl}/Jobs/${jobId}/restart`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to restart job');
    return response.json();
  }

  async deleteJob(jobId: string) {
    const response = await fetch(`${this.baseUrl}/Jobs/${jobId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete job');
  }

  async deleteJobsByStatus(status: any) {
    const response = await fetch(`${this.baseUrl}/Jobs/status/${status}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete jobs');
  }
}

// Service instances
export const apiService: JobAPI = isMockMode() 
  ? mockApiService 
  : new RealApiService();

export const signalRService: JobSignalRHub = isMockMode() 
  ? mockSignalRService 
  : realSignalRService;

// Export individual services for testing
export { mockApiService, mockSignalRService, realSignalRService };
export * from './serviceConfig';

// Expose mockSignalRService to window for cross-module communication in mock mode
if (isMockMode() && typeof window !== 'undefined') {
  (window as any).mockSignalRService = mockSignalRService;
}