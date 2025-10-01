'use client';

import React, { useState, useEffect } from 'react';
import { useJobStore, useJobSelectors } from '../../store/jobStore';
import { JobResponse as Job } from '../../lib/api/videoTranslationService';
import { JobCard } from './JobCard';

interface JobsListProps {
  className?: string;
  showFilters?: boolean;
  showSearch?: boolean;
}

export const JobsList: React.FC<JobsListProps> = ({
  className = '',
  showFilters = true,
  showSearch = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const { jobs, isLoading, error } = useJobSelectors();
  const { clearError } = useJobStore();

  const filteredJobs = jobs.filter(job => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        job.id.toLowerCase().includes(searchLower) ||
        job.stage.toLowerCase().includes(searchLower) ||
        job.message.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }
    
    // Status filter
    if (statusFilter !== 'all' && job.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusCounts = () => {
    const counts = {
      all: jobs.length,
      queued: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      canceled: 0
    };
    
    jobs.forEach(job => {
      counts[job.status as keyof typeof counts]++;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className={`jobs-list ${className}`}>
        <div className="jobs-loading">
          <div className="loading-spinner"></div>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`jobs-list ${className}`}>
        <div className="jobs-error">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
          <button 
            className="retry-button"
            onClick={() => clearError()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`jobs-list ${className}`}>
      <div className="jobs-header">
        <div className="jobs-title">
          <h2 className="title">Jobs</h2>
          <span className="count">({jobs.length})</span>
        </div>
        
        {showSearch && (
          <div className="jobs-search">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        )}
      </div>
      
      {showFilters && (
        <div className="jobs-filters">
          <div className="filter-group">
            <label className="filter-label">Status:</label>
            <div className="filter-options">
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  className={`filter-button ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  <span className="filter-text">
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <span className="filter-count">({count})</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'updatedAt' | 'status')}
              className="filter-select"
            >
              <option value="createdAt">Created Date</option>
              <option value="updatedAt">Updated Date</option>
              <option value="status">Status</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="filter-select"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      )}
      
      <div className="jobs-content">
        {sortedJobs.length === 0 ? (
          <div className="jobs-empty">
            <div className="empty-icon">📋</div>
            <h3 className="empty-title">No jobs found</h3>
            <p className="empty-description">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You haven\'t created any jobs yet'
              }
            </p>
          </div>
        ) : (
          <div className="jobs-grid">
            {sortedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
      
      <div className="jobs-footer">
        <div className="jobs-summary">
          <div className="summary-item">
            <span className="summary-label">Total:</span>
            <span className="summary-value">{jobs.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Completed:</span>
            <span className="summary-value">{statusCounts.completed}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Processing:</span>
            <span className="summary-value">{statusCounts.processing}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Failed:</span>
            <span className="summary-value">{statusCounts.failed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
