'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useFileUpload } from '../../hooks/useFileUpload';
import { VideoService } from '../../lib/api/videoService';
import { useWebSocket } from '../../hooks/useWebSocket';
import { validateVideoFile, getFileSizeDisplay } from '../../lib/utils/fileValidation';
import { config } from '../../lib/config/environment';

interface VideoUploadProps {
  onUploadComplete: (fileKey: string) => void;
  onUploadError: (error: string) => void;
  maxFileSize?: number;
  allowedFormats?: string[];
  className?: string;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  onUploadComplete,
  onUploadError,
  maxFileSize = config.maxFileSize,
  allowedFormats = config.allowedVideoTypes,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock token - in real app, get from auth context
  const token = 'your-auth-token';
  const videoService = new VideoService(token);
  // WebSocket is handled by useFileUpload hook
  
  const { isUploading, uploadProgress, error: uploadError, uploadFile, reset: resetUpload } = useFileUpload({
    onSuccess: onUploadComplete,
    onError: (error: Error) => onUploadError(error.message)
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    setValidationError(null);
    
    // Validate file
    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      setValidationError(validation.errors.join(', '));
      return;
    }
    
    setSelectedFile(file);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;
    
    const sessionId = `upload-${Date.now()}`;
    await uploadFile(selectedFile);
  }, [selectedFile, uploadFile]);

  const handleCancel = useCallback(() => {
    resetUpload();
    setSelectedFile(null);
    setValidationError(null);
  }, [resetUpload]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setValidationError(null);
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [resetUpload]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`video-upload ${className}`}>
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${isUploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedFormats.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />
        
        {!selectedFile ? (
          <div className="upload-content">
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <h3 className="upload-title">Upload Video</h3>
            <p className="upload-description">
              Drag and drop your video file here, or click to browse
            </p>
            <div className="upload-info">
              <p>Supported formats: {allowedFormats.join(', ')}</p>
              <p>Max file size: {getFileSizeDisplay(maxFileSize)}</p>
            </div>
          </div>
        ) : (
          <div className="selected-file">
            <div className="file-info">
              <div className="file-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
              </div>
              <div className="file-details">
                <h4 className="file-name">{selectedFile.name}</h4>
                <p className="file-size">{getFileSizeDisplay(selectedFile.size)}</p>
              </div>
            </div>
            
            {validationError && (
              <div className="validation-error">
                <p>{validationError}</p>
              </div>
            )}
            
            {uploadError && (
              <div className="upload-error">
                <p>{uploadError}</p>
              </div>
            )}
            
            {isUploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="progress-text">{uploadProgress.toFixed(1)}%</p>
              </div>
            )}
            
            <div className="upload-actions">
              {!isUploading ? (
                <>
                  <button 
                    onClick={handleUpload}
                    disabled={!!validationError}
                    className="btn btn-primary"
                  >
                    Upload Video
                  </button>
                  <button 
                    onClick={handleReset}
                    className="btn btn-secondary"
                  >
                    Choose Different File
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleCancel}
                  className="btn btn-danger"
                >
                  Cancel Upload
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
