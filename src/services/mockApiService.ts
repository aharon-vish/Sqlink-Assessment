import { v4 as uuidv4 } from 'uuid';
import type { Job, CreateJobRequest, JobAPI, ApiResponse } from '@/types';
import { JobStatus, JobPriority } from '@/types/enums';

// Mock data generator
const generateMockJob = (
  name: string,
  priority: JobPriority,
  status: JobStatus = JobStatus.Pending
): Job => {
  const now = Date.now();
  const job: Job = {
    jobID: uuidv4(),
    name,
    status,
    priority,
    progress: status === JobStatus.Completed ? 100 : status === JobStatus.Running ? Math.floor(Math.random() * 80) + 10 : 0,
    createdAt: now,
    startedAt: status >= JobStatus.Running ? now - Math.floor(Math.random() * 3600000) : 0,
    completedAt: status === JobStatus.Completed ? now - Math.floor(Math.random() * 1800000) : 0,
    errorMessage: status === JobStatus.Failed ? 'Mock error: Process failed unexpectedly' : null,
  };
  return job;
};

// Generate initial mock data
const generateInitialJobs = (): Job[] => {
  return [
    generateMockJob('Data Processing Job', JobPriority.High, JobStatus.Completed),
    generateMockJob('Email Campaign', JobPriority.Regular, JobStatus.Running),
    generateMockJob('Database Backup', JobPriority.High, JobStatus.Running),
    generateMockJob('Report Generation', JobPriority.Regular, JobStatus.Failed),
    generateMockJob('Image Processing', JobPriority.Regular, JobStatus.InQueue),
    generateMockJob('File Cleanup', JobPriority.Regular, JobStatus.Pending),
    generateMockJob('Analytics Export', JobPriority.High, JobStatus.Stopped),
    generateMockJob('User Sync', JobPriority.Regular, JobStatus.Completed),
  ];
};

class MockApiService implements JobAPI {
  private jobs: Job[] = generateInitialJobs();
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async getAllJobs(): Promise<Job[]> {
    await this.delay(500); // Simulate network delay
    return [...this.jobs];
  }

  async createJob(request: CreateJobRequest): Promise<Job> {
    await this.delay(300);
    
    if (!request.name.trim()) {
      throw new Error('Job name is required');
    }

    const job = generateMockJob(request.name, request.priority);
    this.jobs.push(job);
    
    // Start job lifecycle simulation
    this.simulateJobLifecycle(job.jobID);
    
    return job;
  }

  async stopJob(jobId: string): Promise<ApiResponse> {
    await this.delay(200);
    
    const job = this.jobs.find(j => j.jobID === jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    if (job.status !== JobStatus.Running && job.status !== JobStatus.InQueue) {
      throw new Error('Job cannot be stopped in current state');
    }

    job.status = JobStatus.Stopped;
    job.completedAt = Date.now();

    // Emit SignalR event for status update
    if (typeof window !== 'undefined' && (window as any).mockSignalRService) {
      (window as any).mockSignalRService.emitProgressUpdate({
        jobID: jobId,
        status: job.status,
        progress: job.progress,
      });
    }

    return {
      isSuccess: true,
      message: 'Job stopped successfully',
    };
  }

  async restartJob(jobId: string): Promise<ApiResponse> {
    await this.delay(200);
    
    const job = this.jobs.find(j => j.jobID === jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    if (job.status !== JobStatus.Failed && job.status !== JobStatus.Stopped) {
      throw new Error('Job cannot be restarted in current state');
    }

    job.status = JobStatus.Pending;
    job.progress = 0;
    job.startedAt = 0;
    job.completedAt = 0;
    job.errorMessage = null;

    // Emit SignalR event for status update
    if (typeof window !== 'undefined' && (window as any).mockSignalRService) {
      (window as any).mockSignalRService.emitProgressUpdate({
        jobID: jobId,
        status: job.status,
        progress: job.progress,
      });
    }

    // Start job lifecycle simulation
    this.simulateJobLifecycle(job.jobID);

    return {
      isSuccess: true,
      message: 'Job restarted successfully',
    };
  }

  async deleteJob(jobId: string): Promise<void> {
    await this.delay(200);
    
    const jobIndex = this.jobs.findIndex(j => j.jobID === jobId);
    if (jobIndex === -1) {
      throw new Error('Job not found');
    }

    const job = this.jobs[jobIndex];
    if (job.status !== JobStatus.Completed && 
        job.status !== JobStatus.Failed && 
        job.status !== JobStatus.Stopped) {
      throw new Error('Job cannot be deleted in current state');
    }

    this.jobs.splice(jobIndex, 1);
  }

  async deleteJobsByStatus(status: JobStatus): Promise<void> {
    await this.delay(300);
    
    if (status !== JobStatus.Failed && status !== JobStatus.Completed) {
      throw new Error('Bulk delete only allowed for Failed and Completed jobs');
    }

    this.jobs = this.jobs.filter(job => job.status !== status);
  }

  // Simulate job lifecycle progression
  private simulateJobLifecycle(jobId: string): void {
    const updateJob = (updates: Partial<Job>) => {
      const job = this.jobs.find(j => j.jobID === jobId);
      if (job) {
        Object.assign(job, updates);
        // Emit SignalR event - we'll import this dynamically to avoid circular dependency
        if (typeof window !== 'undefined' && (window as any).mockSignalRService) {
          (window as any).mockSignalRService.emitProgressUpdate({
            jobID: jobId,
            status: job.status,
            progress: job.progress,
          });
        }
      }
    };

    // Pending -> InQueue (2-5 seconds)
    setTimeout(() => {
      updateJob({ 
        status: JobStatus.InQueue 
      });
    }, Math.random() * 3000 + 2000);

    // InQueue -> Running (5-8 seconds)
    setTimeout(() => {
      updateJob({ 
        status: JobStatus.Running,
        startedAt: Date.now()
      });
      
      // Start progress updates
      this.simulateProgress(jobId);
    }, Math.random() * 3000 + 5000);
  }

  private simulateProgress(jobId: string): void {
    const job = this.jobs.find(j => j.jobID === jobId);
    if (!job || job.status !== JobStatus.Running) return;

    const progressInterval = setInterval(() => {
      const currentJob = this.jobs.find(j => j.jobID === jobId);
      if (!currentJob || currentJob.status !== JobStatus.Running) {
        clearInterval(progressInterval);
        return;
      }

      // Increment progress by 5-15%
      const increment = Math.random() * 10 + 5;
      currentJob.progress = Math.min(currentJob.progress + increment, 100);

      // Emit progress update
      if (typeof window !== 'undefined' && (window as any).mockSignalRService) {
        (window as any).mockSignalRService.emitProgressUpdate({
          jobID: jobId,
          status: currentJob.status,
          progress: currentJob.progress,
        });
      }

      // Complete job when progress reaches 100%
      if (currentJob.progress >= 100) {
        clearInterval(progressInterval);
        
        // 70% success rate, 30% failure rate
        const success = Math.random() > 0.3;
        
        setTimeout(() => {
          const finalJob = this.jobs.find(j => j.jobID === jobId);
          if (finalJob) {
            finalJob.status = success ? JobStatus.Completed : JobStatus.Failed;
            finalJob.completedAt = Date.now();
            finalJob.progress = success ? 100 : finalJob.progress;
            
            if (!success) {
              finalJob.errorMessage = 'Mock error: Random failure during processing';
            }

            if (typeof window !== 'undefined' && (window as any).mockSignalRService) {
              (window as any).mockSignalRService.emitProgressUpdate({
                jobID: jobId,
                status: finalJob.status,
                progress: finalJob.progress,
              });
            }
          }
        }, 1000);
      }
    }, 1500); // Update every 1.5 seconds
  }
}

export const mockApiService = new MockApiService();