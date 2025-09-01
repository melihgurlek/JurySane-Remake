import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { TrialSession, Case, UserRole } from '@/types/trial';

interface TrialState {
  // Current trial session
  currentSession: TrialSession | null;
  currentCase: Case | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Chat/input state
  userInput: string;
  isSubmitting: boolean;
  
  // Actions
  setCurrentSession: (session: TrialSession | null) => void;
  setCurrentCase: (case_: Case | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUserInput: (input: string) => void;
  setSubmitting: (submitting: boolean) => void;
  updateSession: (updates: Partial<TrialSession>) => void;
  addTranscriptEntry: (entry: any) => void;
  clearSession: () => void;
}

export const useTrialStore = create<TrialState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentSession: null,
      currentCase: null,
      isLoading: false,
      error: null,
      userInput: '',
      isSubmitting: false,

      // Actions
      setCurrentSession: (session) => 
        set({ currentSession: session }, false, 'setCurrentSession'),

      setCurrentCase: (case_) => 
        set({ currentCase: case_ }, false, 'setCurrentCase'),

      setLoading: (loading) => 
        set({ isLoading: loading }, false, 'setLoading'),

      setError: (error) => 
        set({ error }, false, 'setError'),

      setUserInput: (input) => 
        set({ userInput: input }, false, 'setUserInput'),

      setSubmitting: (submitting) => 
        set({ isSubmitting: submitting }, false, 'setSubmitting'),

      updateSession: (updates) => {
        const currentSession = get().currentSession;
        if (currentSession) {
          set(
            { currentSession: { ...currentSession, ...updates } },
            false,
            'updateSession'
          );
        }
      },

      addTranscriptEntry: (entry) => {
        const currentSession = get().currentSession;
        if (currentSession) {
          set(
            {
              currentSession: {
                ...currentSession,
                transcript: [...currentSession.transcript, entry],
              },
            },
            false,
            'addTranscriptEntry'
          );
        }
      },

      clearSession: () =>
        set(
          {
            currentSession: null,
            currentCase: null,
            error: null,
            userInput: '',
            isSubmitting: false,
          },
          false,
          'clearSession'
        ),
    }),
    {
      name: 'trial-store',
    }
  )
);

// Selectors
export const useCurrentSession = () => useTrialStore(state => state.currentSession);
export const useCurrentCase = () => useTrialStore(state => state.currentCase);
export const useTrialLoading = () => useTrialStore(state => state.isLoading);
export const useTrialError = () => useTrialStore(state => state.error);
export const useUserInput = () => useTrialStore(state => state.userInput);
export const useIsSubmitting = () => useTrialStore(state => state.isSubmitting);
