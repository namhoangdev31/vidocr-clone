'use client';

import React, { useState } from 'react';
import { Job } from '../../lib/types/api';
import { useJobStore } from '../../store/jobStore';

interface JobCardProps {
  job: Job;
  className?: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setCurrentJob, removeJob } = useJobStore();

  const getStatusColor = (status: Job['status']): string => {
    const colors: Record<Job['status'], string> = {
      'queued': 'text-yellow-600',
      'processing': 'text-blue-600',
      'completed': 'text-green-600',
      'failed': 'text-red-600',
      'canceled': 'text-gray-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const getStatusIcon = (status: Job['status']): string => {
    const icons: Record<Job['status'], string> = {
      'queued': '⏳',
      'processing': '🔄',
      'completed': '✅',
      'failed': '❌',
      'canceled': '⏹️'
    };
    return icons[status] || '❓';
  };

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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleViewJob = () => {
    setCurrentJob(job);
  };

  const handleDeleteJob = () => {
    if (confirm('Are you sure you want to delete this job?')) {
      removeJob(job.id);
    }
  };

  const canDelete = job.status === 'completed' || job.status === 'failed' || job.status === 'canceled';

  return (
    <div className={`job-card ${className} ${isExpanded ? 'expanded' : ''}`}>
      <div className="job-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="job-info">
          <div className="job-status">
            <span className={`status-icon ${getStatusColor(job.status)}`}>
              {getStatusIcon(job.status)}
            </span>
            <span className={`status-text ${getStatusColor(job.status)}`}>
              {getStageDisplayName(job.stage)}
            </span>
          </div>
          
          <div className="job-details">
            <div className="job-id">
              <span className="id-label">Job ID:</span>
              <span className="id-value">{job.id}</span>
            </div>
            <div className="job-time">
              <span className="time-label">Created:</span>
              <span className="time-value">{formatDate(job.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="job-actions">
          <button
            className="expand-button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <span className="expand-icon">
              {isExpanded ? '▼' : '▶'}
            </span>
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="job-card-content">
          <div className="job-progress">
            <div className="progress-header">
              <span className="progress-label">Progress</span>
              <span className="progress-percentage">{job.progress.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${job.progress}%` }}
              />
            </div>
          </div>
          
          <div className="job-message">
            <span className="message-label">Status:</span>
            <span className="message-text">{job.message}</span>
          </div>
          
          {job.error && (
            <div className="job-error">
              <span className="error-label">Error:</span>
              <span className="error-text">{job.error}</span>
            </div>
          )}
          
          {job.outputs && (
            <div className="job-outputs">
              <span className="outputs-label">Outputs:</span>
              <div className="outputs-list">
                {Object.entries(job.outputs).map(([type, key]) => (
                  <div key={type} className="output-item">
                    <span className="output-type">{type}:</span>
                    <span className="output-key">{key ? 'Available' : 'Not available'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="job-timestamps">
            <div className="timestamp-item">
              <span className="timestamp-label">Created:</span>
              <span className="timestamp-value">
                {new Date(job.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="timestamp-item">
              <span className="timestamp-label">Updated:</span>
              <span className="timestamp-value">
                {new Date(job.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div className="job-card-footer">
        <div className="job-actions">
          <button
            className="action-button primary"
            onClick={handleViewJob}
          >
            <span className="action-icon">👁️</span>
            <span className="action-text">View</span>
          </button>
          
          {job.status === 'completed' && job.outputs && (
            <button
              className="action-button success"
              onClick={() => {
                // Navigate to download page or show download modal
                console.log('Download outputs:', job.outputs);
              }}
            >
              <span className="action-icon">⬇️</span>
              <span className="action-text">Download</span>
            </button>
          )}
          
          {canDelete && (
            <button
              className="action-button danger"
              onClick={handleDeleteJob}
            >
              <span className="action-icon">🗑️</span>
              <span className="action-text">Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
