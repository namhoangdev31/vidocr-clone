'use client';

import React, { useEffect, useState } from 'react';
import { useJobManagement } from '../../hooks/useJobManagement';
import { JobProgress as JobProgressType } from '../../lib/types/api';

interface JobProgressProps {
  jobId: string;
  onComplete?: (outputs: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const JobProgress: React.FC<JobProgressProps> = ({
  jobId,
  onComplete,
  onError,
  className = ''
}) => {
  const [progress, setProgress] = useState<JobProgressType>({
    jobId,
    stage: 'queued',
    progress: 0,
    message: 'Job queued for processing'
  });
  
  const { getJobStatus, jobs } = useJobManagement();
  
  const job = jobs.find(j => j.id === jobId);

  useEffect(() => {
    if (job) {
      setProgress({
        jobId: job.id,
        stage: job.stage,
        progress: job.progress,
        message: job.message
      });
    }
  }, [job]);

  useEffect(() => {
    if (jobId) {
      // Job progress is automatically tracked by useJobManagement hook
      // No need for manual tracking here
    }
  }, [jobId]);

  const getStageDisplayName = (stage: string): string => {
    const stageNames: Record<string, string> = {
      'queued': 'Queued',
      'preparing': 'Preparing',
      'transcribing': 'Transcribing',
      'translating': 'Translating',
      'subbuilding': 'Building Subtitles',
      'dubbing': 'Generating Voice',
      'mixing': 'Mixing Audio',
      'rendering': 'Rendering Video',
      'muxing': 'Finalizing',
      'uploading': 'Uploading Results',
      'completed': 'Completed',
      'failed': 'Failed',
      'canceled': 'Canceled'
    };
    
    return stageNames[stage] || stage;
  };

  const getStageIcon = (stage: string): string => {
    const icons: Record<string, string> = {
      'queued': '⏳',
      'preparing': '🔧',
      'transcribing': '🎤',
      'translating': '🌐',
      'subbuilding': '📝',
      'dubbing': '🎵',
      'mixing': '🎛️',
      'rendering': '🎬',
      'muxing': '🔗',
      'uploading': '📤',
      'completed': '✅',
      'failed': '❌',
      'canceled': '⏹️'
    };
    
    return icons[stage] || '⏳';
  };

  const getProgressColor = (stage: string): string => {
    if (stage === 'completed') return 'text-green-600';
    if (stage === 'failed' || stage === 'canceled') return 'text-red-600';
    if (stage === 'queued') return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getProgressBarColor = (stage: string): string => {
    if (stage === 'completed') return 'bg-green-500';
    if (stage === 'failed' || stage === 'canceled') return 'bg-red-500';
    return 'bg-blue-500';
  };

  if (!job) {
    return (
      <div className={`job-progress ${className}`}>
        <div className="progress-error">
          <p>Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`job-progress ${className}`}>
      <div className="progress-header">
        <div className="progress-title">
          <span className="stage-icon">{getStageIcon(progress.stage)}</span>
          <h3 className="stage-name">{getStageDisplayName(progress.stage)}</h3>
        </div>
        <div className={`progress-status ${getProgressColor(progress.stage)}`}>
          {progress.stage === 'completed' && 'Completed'}
          {progress.stage === 'failed' && 'Failed'}
          {progress.stage === 'canceled' && 'Canceled'}
          {progress.stage !== 'completed' && progress.stage !== 'failed' && progress.stage !== 'canceled' && 'Processing'}
        </div>
      </div>
      
      <div className="progress-content">
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className={`progress-fill ${getProgressBarColor(progress.stage)}`}
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <div className="progress-percentage">
            {progress.progress.toFixed(1)}%
          </div>
        </div>
        
        <div className="progress-message">
          <p>{progress.message}</p>
        </div>
        
        {progress.stage === 'failed' && (
          <div className="progress-error">
            <p className="error-message">{progress.message}</p>
          </div>
        )}
        
        {progress.stage === 'completed' && job.outputs && (
          <div className="progress-success">
            <p>Job completed successfully! You can now download the results.</p>
          </div>
        )}
      </div>
      
      <div className="progress-details">
        <div className="detail-item">
          <span className="detail-label">Job ID:</span>
          <span className="detail-value">{jobId}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Status:</span>
          <span className={`detail-value ${getProgressColor(progress.stage)}`}>
            {getStageDisplayName(progress.stage)}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Progress:</span>
          <span className="detail-value">{progress.progress.toFixed(1)}%</span>
        </div>
        {job.createdAt && (
          <div className="detail-item">
            <span className="detail-label">Created:</span>
            <span className="detail-value">
              {new Date(job.createdAt).toLocaleString()}
            </span>
          </div>
        )}
        {job.createdAt && (
          <div className="detail-item">
            <span className="detail-label">Created:</span>
            <span className="detail-value">
              {new Date(job.createdAt).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
