import { v4 as uuidv4 } from 'uuid';
import type { Job, CreateJobRequest, JobAPI, ApiResponse } from '@/types';
import { JobStatus, JobPriority } from '@/types/enums';
import { mockSignalRService } from './mockSignalRService';

interface JobLifecycleConfig {
  pendingToQueueDelay: [number, number]; // [min, max] in ms
  queueToRunningDelay: [number, number];
  progressUpdateInterval: number;
  progressIncrementRange: [number, number];
  successRate: number; // 0-1
  averageJobDuration: number; // ms
}

// Mock data generator with more realistic timing
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
    progress: status === JobStatus.Completed ? 100 : 
              status === JobStatus.Running ? Math.floor(Math.random() * 80) + 10 : 
              0,
    createdAt: now,
    startedAt: status >= JobStatus.Running ? now - Math.floor(Math.random() * 3600000) : 0,
    completedAt: status === JobStatus.Completed ? now - Math.floor(Math.random() * 1800000) : 0,
    errorMessage: status === JobStatus.Failed ? getRandomErrorMessage() : null,
  };
  return job;
};

const getRandomErrorMessage = (): string => {
  const errors = [
    'Connection timeout during processing',
    'Insufficient memory to complete operation',
    'Invalid input data format detected',
    'External service unavailable',
    'Process terminated due to resource limits',
    'Authentication failed for external API',
    'File not found in specified location',
    'Network connection interrupted',
    'Database connection pool exhausted',
    'Rate limit exceeded for external service'
  ];
  
  return errors[Math.floor(Math.random() * errors.length)];
};

// Generate more diverse initial jobs
const generateInitialJobs = (): Job[] => {
  const jobNames = [
    'Customer Data Export',
    'Monthly Analytics Report',
    'Database Optimization',
    'Email Campaign Batch',
    'Image Processing Pipeline',
    'Backup Verification',
    'Log File Analysis',
    'User Activity Sync',
    'Inventory Update Process',
    'Payment Processing Batch',
    'Content Moderation Queue',
    'Search Index Rebuild'
  ];

  const jobs: Job[] = [];
  
  // Create jobs with various statuses
  jobNames.forEach((name) => {
    const priority = Math.random() > 0.7 ? JobPriority.High : JobPriority.Regular;
    let status: JobStatus;
    
    // Distribute statuses realistically
    const rand = Math.random();
    if (rand < 0.3) status = JobStatus.Completed;
    else if (rand < 0.4) status = JobStatus.Running;
    else if (rand < 0.5) status = JobStatus.Failed;
    else if (rand < 0.6) status = JobStatus.InQueue;
    else if (rand < 0.7) status = JobStatus.Stopped;
    else status = JobStatus.Pending;
    
    jobs.push(generateMockJob(name, priority, status));
  });

  return jobs;
};

class EnhancedMockApiService implements JobAPI {
  private jobs: Job[] = generateInitialJobs();
  private jobLifecycles: Map<string, NodeJS.Timeout[]> = new Map();
  
  private config: JobLifecycleConfig = {
    pendingToQueueDelay: [1000, 4000],
    queueToRunningDelay: [2000, 6000],
    progressUpdateInterval: 1500,
    progressIncrementRange: [3, 12],
    successRate: 0.75,
    averageJobDuration: 15000,
  };

  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  private getRandomDelay(range: [number, number]): number {
    return Math.random() * (range[1] - range[0]) + range[0];
  }

  async getAllJobs(): Promise<Job[]> {
    await this.delay(300 + Math.random() * 400); // Realistic API delay
    return [...this.jobs];
  }

  async createJob(request: CreateJobRequest): Promise<Job> {
    await this.delay(200 + Math.random() * 300);
    
    if (!request.name.trim()) {
      throw new Error('Job name is required');
    }

    // Check for duplicate names
    const existingJob = this.jobs.find(j => 
      j.name.toLowerCase() === request.name.trim().toLowerCase()
    );
    if (existingJob) {
      throw new Error('A job with this name already exists');
    }

    const job = generateMockJob(request.name.trim(), request.priority);
    this.jobs.push(job);
    
    // Start realistic job lifecycle simulation
    this.simulateEnhancedJobLifecycle(job.jobID);
    
    return job;
  }

  async stopJob(jobId: string): Promise<ApiResponse> {
    await this.delay(150 + Math.random() * 200);
    
    const job = this.jobs.find(j => j.jobID === jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    if (job.status !== JobStatus.Running && job.status !== JobStatus.InQueue) {
      throw new Error(`Cannot stop job in ${JobStatus[job.status]} state`);
    }

    // Clear any existing lifecycle timers
    this.clearJobLifecycle(jobId);

    job.status = JobStatus.Stopped;
    job.completedAt = Date.now();

    // Emit SignalR update
    mockSignalRService.emitProgressUpdate({
      jobID: jobId,
      status: job.status,
      progress: job.progress,
    });

    return {
      isSuccess: true,
      message: 'Job stopped successfully',
    };
  }

  async restartJob(jobId: string): Promise<ApiResponse> {
    await this.delay(200 + Math.random() * 300);
    
    const job = this.jobs.find(j => j.jobID === jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    if (job.status !== JobStatus.Failed && job.status !== JobStatus.Stopped) {
      throw new Error(`Cannot restart job in ${JobStatus[job.status]} state`);
    }

    // Reset job state
    job.status = JobStatus.Pending;
    job.progress = 0;
    job.startedAt = 0;
    job.completedAt = 0;
    job.errorMessage = null;

    // Start new lifecycle simulation
    this.simulateEnhancedJobLifecycle(job.jobID);

    // Emit SignalR update
    mockSignalRService.emitProgressUpdate({
      jobID: jobId,
      status: job.status,
      progress: job.progress,
    });

    return {
      isSuccess: true,
      message: 'Job restarted successfully',
    };
  }

  async deleteJob(jobId: string): Promise<void> {
    await this.delay(100 + Math.random() * 200);
    
    const jobIndex = this.jobs.findIndex(j => j.jobID === jobId);
    if (jobIndex === -1) {
      throw new Error('Job not found');
    }

    const job = this.jobs[jobIndex];
    if (job.status !== JobStatus.Completed && 
        job.status !== JobStatus.Failed && 
        job.status !== JobStatus.Stopped) {
      throw new Error(`Cannot delete job in ${JobStatus[job.status]} state`);
    }

    // Clear any existing lifecycle timers
    this.clearJobLifecycle(jobId);

    this.jobs.splice(jobIndex, 1);
  }

  async deleteJobsByStatus(status: JobStatus): Promise<void> {
    await this.delay(200 + Math.random() * 400);
    
    if (status !== JobStatus.Failed && status !== JobStatus.Completed && status !== JobStatus.Stopped) {
      throw new Error('Bulk delete only allowed for Failed, Completed, and Stopped jobs');
    }

    const jobsToDelete = this.jobs.filter(job => job.status === status);
    
    if (jobsToDelete.length === 0) {
      throw new Error(`No ${JobStatus[status]} jobs found to delete`);
    }

    // Clear lifecycle timers for jobs being deleted
    jobsToDelete.forEach(job => this.clearJobLifecycle(job.jobID));

    this.jobs = this.jobs.filter(job => job.status !== status);
  }

  private simulateEnhancedJobLifecycle(jobId: string): void {
    const timers: NodeJS.Timeout[] = [];
    
    const updateJob = (updates: Partial<Job>) => {
      const job = this.jobs.find(j => j.jobID === jobId);
      if (job) {
        Object.assign(job, updates);
        // Emit SignalR event
        mockSignalRService.emitProgressUpdate({
          jobID: jobId,
          status: job.status,
          progress: job.progress,
        });
      }
    };

    // Pending -> InQueue
    const pendingTimer = setTimeout(() => {
      updateJob({ status: JobStatus.InQueue });
      
      // InQueue -> Running
      const queueTimer = setTimeout(() => {
        updateJob({ 
          status: JobStatus.Running,
          startedAt: Date.now()
        });
        
        // Start realistic progress updates
        this.simulateRealisticProgress(jobId, timers);
      }, this.getRandomDelay(this.config.queueToRunningDelay));
      
      timers.push(queueTimer);
    }, this.getRandomDelay(this.config.pendingToQueueDelay));
    
    timers.push(pendingTimer);
    this.jobLifecycles.set(jobId, timers);
  }

  private simulateRealisticProgress(jobId: string, timers: NodeJS.Timeout[]): void {
    const job = this.jobs.find(j => j.jobID === jobId);
    if (!job || job.status !== JobStatus.Running) return;

    const progressInterval = setInterval(() => {
      const currentJob = this.jobs.find(j => j.jobID === jobId);
      if (!currentJob || currentJob.status !== JobStatus.Running) {
        clearInterval(progressInterval);
        return;
      }

      // Realistic progress increment with some randomness
      const baseIncrement = this.getRandomDelay(this.config.progressIncrementRange);
      
      // Slow down progress as it gets closer to completion (realistic behavior)
      const slowdownFactor = currentJob.progress > 80 ? 0.5 : 
                           currentJob.progress > 60 ? 0.7 : 1;
      
      const increment = baseIncrement * slowdownFactor;
      currentJob.progress = Math.min(currentJob.progress + increment, 100);

      // Emit progress update
      mockSignalRService.emitProgressUpdate({
        jobID: jobId,
        status: currentJob.status,
        progress: currentJob.progress,
      });

      // Complete job when progress reaches 100%
      if (currentJob.progress >= 100) {
        clearInterval(progressInterval);
        
        // Add slight delay before completion
        const completionTimer = setTimeout(() => {
          this.completeJob(jobId);
        }, 500 + Math.random() * 1000);
        
        timers.push(completionTimer);
      }
    }, this.config.progressUpdateInterval);

    // Store interval reference
    timers.push(progressInterval as NodeJS.Timeout);
  }

  private completeJob(jobId: string): void {
    const job = this.jobs.find(j => j.jobID === jobId);
    if (!job) return;

    const success = Math.random() < this.config.successRate;
    
    job.status = success ? JobStatus.Completed : JobStatus.Failed;
    job.completedAt = Date.now();
    job.progress = success ? 100 : job.progress;
    
    if (!success) {
      job.errorMessage = getRandomErrorMessage();
    }

    // Emit final update
    mockSignalRService.emitProgressUpdate({
      jobID: jobId,
      status: job.status,
      progress: job.progress,
    });

    // Clean up lifecycle timers
    this.clearJobLifecycle(jobId);
  }

  private clearJobLifecycle(jobId: string): void {
    const timers = this.jobLifecycles.get(jobId);
    if (timers) {
      timers.forEach(timer => {
        if (typeof timer === 'number') {
          clearTimeout(timer);
        } else {
          clearInterval(timer);
        }
      });
      this.jobLifecycles.delete(jobId);
    }
  }

  // Cleanup method for service shutdown
  cleanup(): void {
    this.jobLifecycles.forEach((timers, jobId) => {
      this.clearJobLifecycle(jobId);
    });
  }

  // Debug methods for testing
  getJobStats(): {
    total: number;
    byStatus: Record<JobStatus, number>;
    activeLifecycles: number;
  } {
    const byStatus: Record<JobStatus, number> = {
      [JobStatus.Pending]: 0,
      [JobStatus.InQueue]: 0,
      [JobStatus.Running]: 0,
      [JobStatus.Completed]: 0,
      [JobStatus.Failed]: 0,
      [JobStatus.Stopped]: 0,
    };

    this.jobs.forEach(job => {
      byStatus[job.status]++;
    });

    return {
      total: this.jobs.length,
      byStatus,
      activeLifecycles: this.jobLifecycles.size,
    };
  }
}

export const enhancedMockApiService = new EnhancedMockApiService();