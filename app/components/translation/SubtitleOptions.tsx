'use client';

import React, { useState } from 'react';
import { config } from '../../lib/config/environment';

interface SubtitleOptionsProps {
  burnSub: boolean;
  subtitleFormat: 'srt' | 'ass' | 'vtt';
  onBurnSubChange: (burn: boolean) => void;
  onSubtitleFormatChange: (format: 'srt' | 'ass' | 'vtt') => void;
  className?: string;
}

export const SubtitleOptions: React.FC<SubtitleOptionsProps> = ({
  burnSub,
  subtitleFormat,
  onBurnSubChange,
  onSubtitleFormatChange,
  className = ''
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getFormatDescription = (format: string): string => {
    const descriptions: Record<string, string> = {
      'srt': 'SubRip - Simple text format, widely supported',
      'ass': 'Advanced SubStation Alpha - Rich formatting support',
      'vtt': 'WebVTT - Web video text tracks, HTML5 compatible'
    };
    return descriptions[format] || '';
  };

  const getFormatIcon = (format: string): string => {
    const icons: Record<string, string> = {
      'srt': '📝',
      'ass': '🎬',
      'vtt': '🌐'
    };
    return icons[format] || '📄';
  };

  return (
    <div className={`subtitle-options ${className}`}>
      <div className="subtitle-header">
        <h3 className="subtitle-title">Subtitle Options</h3>
        <p className="subtitle-description">
          Configure how subtitles will be generated and displayed
        </p>
      </div>
      
      <div className="subtitle-content">
        <div className="subtitle-section">
          <div className="subtitle-option">
            <div className="option-header">
              <label className="option-label">
                <input
                  type="checkbox"
                  checked={burnSub}
                  onChange={(e) => onBurnSubChange(e.target.checked)}
                  className="option-checkbox"
                />
                <span className="checkbox-custom"></span>
                <span className="option-text">Burn subtitles into video</span>
              </label>
            </div>
            <div className="option-description">
              <p>
                {burnSub 
                  ? 'Subtitles will be permanently embedded in the video file'
                  : 'Subtitles will be generated as separate files'
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="subtitle-section">
          <div className="subtitle-option">
            <div className="option-header">
              <label className="option-label">Subtitle Format</label>
            </div>
            <div className="format-options">
              {config.subtitleFormats.map((format) => (
                <div key={format} className="format-option">
                  <label className="format-label">
                    <input
                      type="radio"
                      name="subtitleFormat"
                      value={format}
                      checked={subtitleFormat === format}
                      onChange={(e) => onSubtitleFormatChange(e.target.value as 'srt' | 'ass' | 'vtt')}
                      className="format-radio"
                    />
                    <span className="radio-custom"></span>
                    <div className="format-content">
                      <div className="format-icon">{getFormatIcon(format)}</div>
                      <div className="format-info">
                        <span className="format-name">{format.toUpperCase()}</span>
                        <span className="format-description">{getFormatDescription(format)}</span>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="subtitle-section">
          <button
            className="advanced-toggle"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <span className="toggle-icon">
              {showAdvanced ? '▼' : '▶'}
            </span>
            <span className="toggle-text">Advanced Options</span>
          </button>
          
          {showAdvanced && (
            <div className="advanced-options">
              <div className="advanced-option">
                <label className="advanced-label">
                  <input
                    type="checkbox"
                    className="advanced-checkbox"
                  />
                  <span className="checkbox-custom"></span>
                  <span className="advanced-text">Remove original text</span>
                </label>
                <p className="advanced-description">
                  Remove the original text from the video
                </p>
              </div>
              
              <div className="advanced-option">
                <label className="advanced-label">
                  <input
                    type="checkbox"
                    className="advanced-checkbox"
                  />
                  <span className="checkbox-custom"></span>
                  <span className="advanced-text">Remove background music</span>
                </label>
                <p className="advanced-description">
                  Remove or reduce background music during speech
                </p>
              </div>
              
              <div className="advanced-option">
                <label className="advanced-label">
                  <input
                    type="checkbox"
                    className="advanced-checkbox"
                  />
                  <span className="checkbox-custom"></span>
                  <span className="advanced-text">Merge captions</span>
                </label>
                <p className="advanced-description">
                  Merge multiple caption tracks into one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="subtitle-preview">
        <div className="preview-header">
          <h4 className="preview-title">Preview</h4>
        </div>
        <div className="preview-content">
          <div className="preview-item">
            <span className="preview-label">Format:</span>
            <span className="preview-value">
              {getFormatIcon(subtitleFormat)} {subtitleFormat.toUpperCase()}
            </span>
          </div>
          <div className="preview-item">
            <span className="preview-label">Burn into video:</span>
            <span className="preview-value">
              {burnSub ? '✅ Yes' : '❌ No'}
            </span>
          </div>
          <div className="preview-item">
            <span className="preview-label">Output:</span>
            <span className="preview-value">
              {burnSub 
                ? 'Video with embedded subtitles'
                : `Separate ${subtitleFormat.toUpperCase()} file`
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
