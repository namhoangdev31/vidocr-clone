'use client';

import React, { useState, useEffect } from 'react';
import { VideoUpload } from '../components/video/VideoUpload';
import { LanguageSelector } from '../components/translation/LanguageSelector';
import { SubtitleOptions } from '../components/translation/SubtitleOptions';
import { JobProgress } from '../components/video/JobProgress';
import { DownloadResults } from '../components/video/DownloadResults';
import { JobsList } from '../components/jobs/JobsList';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { ToastProvider, useToastHelpers } from '../components/common/Toast';
import { VideoService } from '../lib/api/videoService';
import { useWebSocket } from '../hooks/useWebSocket';
import { useJobStore } from '../store/jobStore';
import { CreateJobData } from '../lib/types/api';

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'options' | 'processing' | 'results'>('upload');
  const [uploadedFileKey, setUploadedFileKey] = useState<string | null>(null);
  const [jobData, setJobData] = useState<Partial<CreateJobData>>({
    sourceLang: 'en',
    targetLang: 'vi',
    burnSub: false,
    subtitleFormat: 'srt',
    voiceover: false,
    model: 'gpt-4o-mini',
    aiProvider: 'openai',
    advanced: {
      removeOriginalText: false,
      removeBgm: false,
      mergeCaption: false,
      mergeOpenCaption: false
    }
  });
  const [currentJob, setCurrentJob] = useState<any>(null);
  
  // Mock token - in real app, get from auth context
  const token = 'your-auth-token';
  const videoService = new VideoService(token);
  // WebSocket is handled by useJobManagement hook
  const { addJob, setCurrentJob: setStoreCurrentJob } = useJobStore();
  const { showSuccess, showError } = useToastHelpers();

  const handleUploadComplete = (fileKey: string) => {
    setUploadedFileKey(fileKey);
    setCurrentStep('options');
    showSuccess('Upload Complete', 'Video uploaded successfully!');
  };

  const handleUploadError = (error: string) => {
    showError('Upload Failed', error);
  };

  const handleCreateJob = async () => {
    if (!uploadedFileKey) {
      showError('No File', 'Please upload a video file first');
      return;
    }

    try {
      const jobData: CreateJobData = {
        fileKey: uploadedFileKey,
        sourceLang: 'en',
        targetLang: 'vi',
        burnSub: false,
        subtitleFormat: 'srt',
        voiceover: false,
        voiceProfile: undefined,
        glossaryId: undefined,
        webhookUrl: undefined,
        model: 'gpt-4o-mini',
        aiProvider: 'openai',
        advanced: {
          removeOriginalText: false,
          removeBgm: false,
          mergeCaption: false,
          mergeOpenCaption: false
        }
      };

      const job = await videoService.createJob(jobData);
      addJob(job);
      setCurrentJob(job);
      setStoreCurrentJob(job);
      setCurrentStep('processing');
      showSuccess('Job Created', 'Video processing job created successfully!');
    } catch (error) {
      showError('Job Creation Failed', error instanceof Error ? error.message : 'Failed to create job');
    }
  };

  const handleJobComplete = (outputs: any) => {
    setCurrentStep('results');
    showSuccess('Processing Complete', 'Your video has been processed successfully!');
  };

  const handleJobError = (error: string) => {
    showError('Processing Failed', error);
  };

  const handleStartOver = () => {
    setCurrentStep('upload');
    setUploadedFileKey(null);
    setCurrentJob(null);
    setStoreCurrentJob(null);
  };

  return (
    <ErrorBoundary>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Video Translation Dashboard</h1>
          <p className="dashboard-description">
            Upload your video and get it translated with subtitles
          </p>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-main">
            <div className="step-indicator">
              <div className={`step ${currentStep === 'upload' ? 'active' : ''} ${currentStep === 'options' || currentStep === 'processing' || currentStep === 'results' ? 'completed' : ''}`}>
                <span className="step-number">1</span>
                <span className="step-label">Upload Video</span>
              </div>
              <div className={`step ${currentStep === 'options' ? 'active' : ''} ${currentStep === 'processing' || currentStep === 'results' ? 'completed' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-label">Configure Options</span>
              </div>
              <div className={`step ${currentStep === 'processing' ? 'active' : ''} ${currentStep === 'results' ? 'completed' : ''}`}>
                <span className="step-number">3</span>
                <span className="step-label">Processing</span>
              </div>
              <div className={`step ${currentStep === 'results' ? 'active' : ''}`}>
                <span className="step-number">4</span>
                <span className="step-label">Download Results</span>
              </div>
            </div>

            <div className="step-content">
              {currentStep === 'upload' && (
                <div className="upload-step">
                  <VideoUpload
                    onUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                    className="upload-component"
                  />
                </div>
              )}

              {currentStep === 'options' && (
                <div className="options-step">
                  <div className="options-grid">
                    <div className="options-section">
                      <LanguageSelector
                        sourceLang={jobData.sourceLang || 'en'}
                        targetLang={jobData.targetLang || 'vi'}
                        onSourceLangChange={(lang) => setJobData(prev => ({ ...prev, sourceLang: lang }))}
                        onTargetLangChange={(lang) => setJobData(prev => ({ ...prev, targetLang: lang }))}
                        className="language-selector"
                      />
                    </div>
                    
                    <div className="options-section">
                      <SubtitleOptions
                        burnSub={jobData.burnSub || false}
                        subtitleFormat={jobData.subtitleFormat || 'srt'}
                        onBurnSubChange={(burn) => setJobData(prev => ({ ...prev, burnSub: burn }))}
                        onSubtitleFormatChange={(format) => setJobData(prev => ({ ...prev, subtitleFormat: format }))}
                        className="subtitle-options"
                      />
                    </div>
                  </div>
                  
                  <div className="options-actions">
                    <button
                      onClick={handleCreateJob}
                      className="btn btn-primary btn-large"
                    >
                      Start Processing
                    </button>
                    <button
                      onClick={handleStartOver}
                      className="btn btn-secondary"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 'processing' && currentJob && (
                <div className="processing-step">
                  <JobProgress
                    jobId={currentJob.id}
                    onComplete={handleJobComplete}
                    onError={handleJobError}
                    className="job-progress"
                  />
                </div>
              )}

              {currentStep === 'results' && currentJob?.outputs && (
                <div className="results-step">
                  <DownloadResults
                    outputs={currentJob.outputs}
                    className="download-results"
                  />
                  <div className="results-actions">
                    <button
                      onClick={handleStartOver}
                      className="btn btn-primary"
                    >
                      Process Another Video
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-sidebar">
            <JobsList
              className="jobs-sidebar"
              showFilters={true}
              showSearch={true}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
