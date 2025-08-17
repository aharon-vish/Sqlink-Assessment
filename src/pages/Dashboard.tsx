import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { StatusCardsGrid } from '@/components/dashboard/StatusCardsGrid';
import { SearchFilterBar } from '@/components/dashboard/SearchFilterBar';
import { JobTableContainer } from '@/components/dashboard/JobTableContainer';
import { ModalManager } from '@/components/modals/ModalManager';
import { ConnectionStatus } from '@/components/ui/ConnectionStatus';
import { useUpdateNotifications } from '@/components/ui/UpdateIndicator';
import { useJobStore } from '@/stores/jobStore';
import { apiService, signalRService } from '@/services';
import { JobStatus, getJobStatusLabel } from '@/types/enums';
import styled from 'styled-components';

const ErrorBanner = styled.div`
  background-color: #fed7d7;
  border: 1px solid #feb2b2;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ErrorMessage = styled.span`
  font-weight: 500;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: #c53030;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    opacity: 0.7;
  }
`;

export const Dashboard: React.FC = () => {
  const { 
    setJobs, 
    setLoading, 
    setError, 
    updateJob,
    error,
    jobs 
  } = useJobStore();

  const { showNotification, NotificationContainer } = useUpdateNotifications();

  // Load initial data
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const jobs = await apiService.getAllJobs();
        setJobs(jobs);
      } catch (error) {
        console.error('Failed to load jobs:', error);
        setError(error instanceof Error ? error.message : 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [setJobs, setLoading, setError]);

  // Set up SignalR connection with enhanced real-time features
  useEffect(() => {
    const setupSignalR = async () => {
      try {
        await signalRService.start();
        
        signalRService.onJobProgressUpdate((update) => {
          const existingJob = jobs.find(j => j.jobID === update.jobID);
          
          if (existingJob) {
            const previousStatus = existingJob.status;
            
            updateJob(update.jobID, {
              status: update.status,
              progress: update.progress,
              // Update timestamps based on status changes
              ...(update.status === JobStatus.Running && previousStatus !== JobStatus.Running && { 
                startedAt: Date.now() 
              }),
              ...(update.status >= JobStatus.Completed && previousStatus < JobStatus.Completed && { 
                completedAt: Date.now() 
              }),
            });

            // Show notification for significant status changes
            if (previousStatus !== update.status) {
              const jobName = existingJob.name;
              const statusLabel = getJobStatusLabel(update.status);
              
              if (update.status === JobStatus.Completed) {
                showNotification(`✅ ${jobName} completed successfully`);
              } else if (update.status === JobStatus.Failed) {
                showNotification(`❌ ${jobName} failed`);
              } else if (update.status === JobStatus.Running) {
                showNotification(`🔄 ${jobName} started running`);
              }
            }
          }
        });
      } catch (error) {
        console.error('Failed to connect to SignalR:', error);
        // Show connection error only for real API mode
        if (import.meta.env.VITE_API_MODE === 'real') {
          setError('Real-time updates unavailable');
        }
      }
    };

    setupSignalR();

    return () => {
      signalRService.stop();
    };
  }, [updateJob, setError, showNotification, jobs]);

  // Auto-refresh data periodically as fallback
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      try {
        const latestJobs = await apiService.getAllJobs();
        setJobs(latestJobs);
      } catch (error) {
        console.warn('Background refresh failed:', error);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [setJobs]);

  return (
    <DashboardLayout>
      <NotificationContainer />
      
      <DashboardHeader />
      {error && (
        <ErrorBanner>
          <ErrorMessage>{error}</ErrorMessage>
          <DismissButton onClick={() => setError(null)}>×</DismissButton>
        </ErrorBanner>
      )}
      
      <StatusCardsGrid />
      <SearchFilterBar />
      <JobTableContainer />
      
      <ModalManager />
    </DashboardLayout>
  );
};