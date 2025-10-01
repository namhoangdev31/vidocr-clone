'use client';

import React, { useState, useEffect } from 'react';
import { VideoService } from '../../lib/api/videoService';
import { JobResponse, DownloadUrlResponse } from '../../lib/api/videoTranslationService';

type JobOutputs = NonNullable<JobResponse['outputs']>;

interface DownloadResultsProps {
  outputs: JobOutputs;
  className?: string;
}

export const DownloadResults: React.FC<DownloadResultsProps> = ({
  outputs,
  className = ''
}) => {
  const [downloadUrls, setDownloadUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Mock token - in real app, get from auth context
  const token = 'your-auth-token';
  const videoService = new VideoService(token);

  useEffect(() => {
    const fetchDownloadUrls = async () => {
      const urls: Record<string, string> = {};
      const loadingStates: Record<string, boolean> = {};
      const errorStates: Record<string, string> = {};
      
      // Initialize loading states
      Object.keys(outputs).forEach(key => {
        if (outputs[key as keyof JobOutputs]) {
          loadingStates[key] = true;
        }
      });
      setLoading(loadingStates);
      
      // Fetch download URLs
      for (const [type, key] of Object.entries(outputs)) {
        if (key) {
          try {
            const response = await videoService.getDownloadUrl(key);
            urls[type] = response.url;
          } catch (error) {
            console.error(`Failed to get download URL for ${type}:`, error);
            errorStates[type] = error instanceof Error ? error.message : 'Failed to get download URL';
          }
        }
      }
      
      setDownloadUrls(urls);
      setLoading({});
      setErrors(errorStates);
    };
    
    fetchDownloadUrls();
  }, [outputs, videoService]);

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = (type: string): string => {
    const icons: Record<string, string> = {
      'srtKey': '📝',
      'assKey': '🎬',
      'vttKey': '🌐',
      'mp4Key': '🎥',
      'voiceKey': '🎵'
    };
    return icons[type] || '📄';
  };

  const getFileDescription = (type: string): string => {
    const descriptions: Record<string, string> = {
      'srtKey': 'SRT Subtitles',
      'assKey': 'ASS Subtitles',
      'vttKey': 'VTT Subtitles',
      'mp4Key': 'Video with Subtitles',
      'voiceKey': 'Audio Track'
    };
    return descriptions[type] || type;
  };

  const getFileExtension = (type: string): string => {
    const extensions: Record<string, string> = {
      'srtKey': '.srt',
      'assKey': '.ass',
      'vttKey': '.vtt',
      'mp4Key': '.mp4',
      'voiceKey': '.mp3'
    };
    return extensions[type] || '';
  };

  const renderDownloadButton = (type: string, key: string) => {
    const url = downloadUrls[type];
    const isLoading = loading[type];
    const error = errors[type];
    const filename = `output${getFileExtension(type)}`;
    
    if (isLoading) {
      return (
        <button className="download-btn loading" disabled>
          <span className="loading-spinner"></span>
          Loading...
        </button>
      );
    }
    
    if (error) {
      return (
        <button className="download-btn error" disabled>
          <span className="error-icon">⚠️</span>
          Error: {error}
        </button>
      );
    }
    
    if (url) {
      return (
        <button 
          className="download-btn success"
          onClick={() => downloadFile(url, filename)}
        >
          <span className="download-icon">⬇️</span>
          Download {getFileDescription(type)}
        </button>
      );
    }
    
    return (
      <button className="download-btn disabled" disabled>
        <span className="disabled-icon">⏳</span>
        Preparing...
      </button>
    );
  };

  const hasOutputs = Object.values(outputs).some(value => value);

  if (!hasOutputs) {
    return (
      <div className={`download-results ${className}`}>
        <div className="no-outputs">
          <p>No outputs available for download.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`download-results ${className}`}>
      <div className="download-header">
        <h3 className="download-title">
          <span className="download-icon">📥</span>
          Download Results
        </h3>
        <p className="download-description">
          Your video processing is complete. Download the results below.
        </p>
      </div>
      
      <div className="download-grid">
        {Object.entries(outputs).map(([type, key]) => {
          if (!key) return null;
          
          return (
            <div key={type} className="download-item">
              <div className="download-item-header">
                <span className="file-icon">{getFileIcon(type)}</span>
                <div className="file-info">
                  <h4 className="file-name">{getFileDescription(type)}</h4>
                  <p className="file-type">{type.replace('Key', '').toUpperCase()}</p>
                </div>
              </div>
              
              <div className="download-item-actions">
                {renderDownloadButton(type, key)}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="download-footer">
        <p className="download-note">
          <span className="note-icon">ℹ️</span>
          Download links are valid for 24 hours. Please download your files soon.
        </p>
      </div>
    </div>
  );
};
