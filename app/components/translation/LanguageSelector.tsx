'use client';

import React, { useState, useEffect } from 'react';
import { config } from '../../lib/config/environment';

interface LanguageSelectorProps {
  sourceLang: string;
  targetLang: string;
  onSourceLangChange: (lang: string) => void;
  onTargetLangChange: (lang: string) => void;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLang,
  targetLang,
  onSourceLangChange,
  onTargetLangChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (searchTerm) {
      const filtered = Object.entries(config.supportedLanguages)
        .filter(([code, name]) => 
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          code.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .reduce((acc, [code, name]) => {
          acc[code] = name;
          return acc;
        }, {} as Record<string, string>);
      setFilteredLanguages(filtered);
    } else {
      setFilteredLanguages(config.supportedLanguages);
    }
  }, [searchTerm]);

  const handleSourceLangChange = (lang: string) => {
    onSourceLangChange(lang);
    setIsOpen(false);
  };

  const handleTargetLangChange = (lang: string) => {
    onTargetLangChange(lang);
    setIsOpen(false);
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    onSourceLangChange(targetLang);
    onTargetLangChange(temp);
  };

  const getLanguageName = (code: string): string => {
    return config.supportedLanguages[code] || code;
  };

  const getLanguageFlag = (code: string): string => {
    const flags: Record<string, string> = {
      'en': '🇺🇸',
      'vi': '🇻🇳',
      'zh': '🇨🇳',
      'ja': '🇯🇵',
      'ko': '🇰🇷',
      'th': '🇹🇭',
      'id': '🇮🇩',
      'ms': '🇲🇾',
      'tl': '🇵🇭'
    };
    return flags[code] || '🌐';
  };

  return (
    <div className={`language-selector ${className}`}>
      <div className="language-selector-header">
        <h3 className="selector-title">Language Selection</h3>
        <p className="selector-description">
          Choose the source and target languages for translation
        </p>
      </div>
      
      <div className="language-selector-content">
        <div className="language-row">
          <div className="language-field">
            <label className="language-label">From</label>
            <div className="language-input-container">
              <span className="language-flag">{getLanguageFlag(sourceLang)}</span>
              <select
                value={sourceLang}
                onChange={(e) => onSourceLangChange(e.target.value)}
                className="language-select"
              >
                <option value="">Select source language</option>
                {Object.entries(config.supportedLanguages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {getLanguageFlag(code)} {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            className="swap-button"
            onClick={swapLanguages}
            disabled={!sourceLang || !targetLang}
            title="Swap languages"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3L4 7l4 4"/>
              <path d="M4 7h16"/>
              <path d="M16 21l4-4-4-4"/>
              <path d="M20 17H4"/>
            </svg>
          </button>
          
          <div className="language-field">
            <label className="language-label">To</label>
            <div className="language-input-container">
              <span className="language-flag">{getLanguageFlag(targetLang)}</span>
              <select
                value={targetLang}
                onChange={(e) => onTargetLangChange(e.target.value)}
                className="language-select"
              >
                <option value="">Select target language</option>
                {Object.entries(config.supportedLanguages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {getLanguageFlag(code)} {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="language-info">
          <div className="language-info-item">
            <span className="info-label">Source:</span>
            <span className="info-value">
              {sourceLang ? `${getLanguageFlag(sourceLang)} ${getLanguageName(sourceLang)}` : 'Not selected'}
            </span>
          </div>
          <div className="language-info-item">
            <span className="info-label">Target:</span>
            <span className="info-value">
              {targetLang ? `${getLanguageFlag(targetLang)} ${getLanguageName(targetLang)}` : 'Not selected'}
            </span>
          </div>
        </div>
        
        {sourceLang && targetLang && (
          <div className="language-preview">
            <div className="preview-content">
              <span className="preview-icon">🔄</span>
              <span className="preview-text">
                {getLanguageName(sourceLang)} → {getLanguageName(targetLang)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
