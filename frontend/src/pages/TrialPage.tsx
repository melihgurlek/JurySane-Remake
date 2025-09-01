import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Clock, Users } from 'lucide-react';
import { trialApi } from '@/lib/api';
import { useTrialStore } from '@/store/trialStore';
import { toast } from '@/components/ui/Toaster';
import { formatTrialPhase, formatUserRole } from '@/lib/utils';
import TrialChat from '@/components/trial/TrialChat';
import TrialSidebar from '@/components/trial/TrialSidebar';
import PhaseIndicator from '@/components/trial/PhaseIndicator';

const TrialPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { setCurrentSession, setLoading, setError } = useTrialStore();

  const {
    data: session,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['trial', sessionId],
    queryFn: () => trialApi.getTrialSession(sessionId!),
    enabled: !!sessionId,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  useEffect(() => {
    if (session) {
      setCurrentSession(session);
    }
  }, [session, setCurrentSession]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (error) {
      setError(error.message);
      toast.error('Failed to load trial session');
    }
  }, [error, setError]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading trial session...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
            Trial Session Not Found
          </h2>
          <p className="text-secondary-600 mb-8">
            The trial session you're looking for doesn't exist or has expired.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary btn-md inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="btn btn-outline btn-sm inline-flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Exit Trial</span>
              </button>
              
              <div className="border-l border-secondary-300 pl-4">
                <h1 className="text-lg font-semibold text-secondary-900">
                  Trial Session
                </h1>
                <p className="text-sm text-secondary-600">
                  You are the {formatUserRole(session.user_role)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-secondary-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Phase: {formatTrialPhase(session.current_phase)}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{session.participants.length} Participants</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Progress */}
      <div className="flex-shrink-0">
        <PhaseIndicator phase={session.current_phase} />
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TrialSidebar session={session} onRefresh={refetch} />
          </div>

          {/* Main Trial Area */}
          <div className="lg:col-span-3">
            <TrialChat session={session} onRefresh={refetch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialPage;
