import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { JobResponse as Job } from '../lib/api/videoTranslationService';

// Type alias for JobOutputs
type JobOutputs = NonNullable<Job['outputs']>;

interface JobStore {
  // State
  jobs: Job[];
  currentJob: Job | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  addJob: (job: Job) => void;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  removeJob: (jobId: string) => void;
  setCurrentJob: (job: Job | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearJobs: () => void;
  
  // Getters
  getJobById: (jobId: string) => Job | undefined;
  getJobsByStatus: (status: Job['status']) => Job[];
  getCompletedJobs: () => Job[];
  getFailedJobs: () => Job[];
  getProcessingJobs: () => Job[];
}

export const useJobStore = create<JobStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        jobs: [],
        currentJob: null,
        isLoading: false,
        error: null,

        // Actions
        addJob: (job) => {
          set((state) => ({
            jobs: [job, ...state.jobs.filter(j => j.id !== job.id)]
          }));
        },

        updateJob: (jobId, updates) => {
          set((state) => ({
            jobs: state.jobs.map(job =>
              job.id === jobId ? { ...job, ...updates } : job
            ),
            currentJob: state.currentJob?.id === jobId 
              ? { ...state.currentJob, ...updates }
              : state.currentJob
          }));
        },

        removeJob: (jobId) => {
          set((state) => ({
            jobs: state.jobs.filter(job => job.id !== jobId),
            currentJob: state.currentJob?.id === jobId ? null : state.currentJob
          }));
        },

        setCurrentJob: (job) => {
          set({ currentJob: job });
        },

        setLoading: (loading) => {
          set({ isLoading: loading });
        },

        setError: (error) => {
          set({ error });
        },

        clearError: () => {
          set({ error: null });
        },

        clearJobs: () => {
          set({ jobs: [], currentJob: null });
        },

        // Getters
        getJobById: (jobId) => {
          return get().jobs.find(job => job.id === jobId);
        },

        getJobsByStatus: (status) => {
          return get().jobs.filter(job => job.status === status);
        },

        getCompletedJobs: () => {
          return get().jobs.filter(job => job.status === 'completed');
        },

        getFailedJobs: () => {
          return get().jobs.filter(job => job.status === 'failed');
        },

        getProcessingJobs: () => {
          return get().jobs.filter(job => 
            job.status === 'queued' || job.status === 'processing'
          );
        }
      }),
      {
        name: 'job-store',
        partialize: (state) => ({
          jobs: state.jobs,
          currentJob: state.currentJob
        })
      }
    ),
    {
      name: 'job-store'
    }
  )
);

// Selectors for better performance
export const useJobSelectors = () => {
  const store = useJobStore();
  
  return {
    jobs: store.jobs,
    currentJob: store.currentJob,
    isLoading: store.isLoading,
    error: store.error,
    completedJobs: store.getCompletedJobs(),
    failedJobs: store.getFailedJobs(),
    processingJobs: store.getProcessingJobs(),
    hasJobs: store.jobs.length > 0,
    hasCurrentJob: store.currentJob !== null
  };
};

// Actions for external use
export const useJobActions = () => {
  const store = useJobStore();
  
  return {
    addJob: store.addJob,
    updateJob: store.updateJob,
    removeJob: store.removeJob,
    setCurrentJob: store.setCurrentJob,
    setLoading: store.setLoading,
    setError: store.setError,
    clearError: store.clearError,
    clearJobs: store.clearJobs
  };
};
