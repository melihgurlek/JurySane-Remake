import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Scale, Users, Gavel, BookOpen, ArrowRight } from 'lucide-react';
import { trialApi } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { UserRole } from '@/types/trial';
import { cn } from '@/lib/utils';

// Sample case data (in a real app, this would come from the backend)
const sampleCase = {
  id: crypto.randomUUID(),
  title: 'State v. Marcus Johnson',
  description: 'Armed robbery of a convenience store',
  charges: ['Armed Robbery in the First Degree', 'Assault with a Deadly Weapon', 'Theft in the Second Degree'],
  case_facts: 'On the evening of March 15, 2024, at approximately 10:47 PM, the QuickMart convenience store was robbed...',
  prosecution_theory: 'The defendant Marcus Johnson committed armed robbery...',
  defense_theory: 'Marcus Johnson is innocent of these charges...',
  evidence: [],
  witnesses: [],
  legal_precedents: [],
  created_at: new Date().toISOString(),
};

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const createTrialMutation = useMutation({
    mutationFn: trialApi.createTrial,
    onSuccess: (data) => {
      toast.success('Trial session created successfully!');
      navigate(`/trial/${data.session_id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create trial session');
    },
  });

  const handleStartTrial = () => {
    if (!selectedRole) {
      toast.warning('Please select your role first');
      return;
    }

    createTrialMutation.mutate({
      case: sampleCase,
      user_role: selectedRole,
    });
  };

  const features = [
    {
      icon: Scale,
      title: 'Realistic Trial Simulation',
      description: 'Experience authentic courtroom procedures with AI-powered judges, attorneys, and witnesses.',
    },
    {
      icon: Users,
      title: 'Multiple Role Playing',
      description: 'Choose to play as Defense Attorney or Prosecutor, with AI handling all other roles.',
    },
    {
      icon: Gavel,
      title: 'Dynamic Legal Decisions',
      description: 'AI judges make real-time rulings on objections and procedural matters.',
    },
    {
      icon: BookOpen,
      title: 'Educational Focus',
      description: 'Learn legal reasoning, trial strategy, and courtroom procedure through practice.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Experience Legal Trials with{' '}
              <span className="text-primary-600">AI Simulation</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              JurySane provides an immersive AI-powered courtroom where you can practice legal skills, 
              learn trial procedures, and understand how justice works in action.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Why Choose JurySane?
            </h2>
            <p className="text-lg text-secondary-600">
              The most realistic legal trial simulation powered by advanced AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trial Setup Section */}
      <div className="py-16 bg-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Start Your Trial Experience
            </h2>
            <p className="text-lg text-secondary-600">
              Choose your role and begin practicing in our simulated courtroom
            </p>
          </div>

          {/* Case Preview */}
          <div className="card p-6 mb-8">
            <h3 className="text-xl font-semibold text-secondary-900 mb-4">
              Featured Case: {sampleCase.title}
            </h3>
            <p className="text-secondary-600 mb-4">
              {sampleCase.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleCase.charges.map((charge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent-100 text-accent-800"
                >
                  {charge}
                </span>
              ))}
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 text-center">
              Choose Your Role
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedRole(UserRole.DEFENSE)}
                className={cn(
                  'p-6 rounded-lg border-2 transition-all text-left',
                  selectedRole === UserRole.DEFENSE
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 bg-white hover:border-secondary-300'
                )}
              >
                <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                  Defense Attorney
                </h4>
                <p className="text-secondary-600">
                  Defend the accused and protect their rights. Challenge the prosecution's case 
                  and create reasonable doubt.
                </p>
              </button>
              
              <button
                onClick={() => setSelectedRole(UserRole.PROSECUTOR)}
                className={cn(
                  'p-6 rounded-lg border-2 transition-all text-left',
                  selectedRole === UserRole.PROSECUTOR
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 bg-white hover:border-secondary-300'
                )}
              >
                <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                  Prosecutor
                </h4>
                <p className="text-secondary-600">
                  Represent the state and seek justice. Present evidence and 
                  prove guilt beyond a reasonable doubt.
                </p>
              </button>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStartTrial}
              disabled={!selectedRole || createTrialMutation.isPending}
              className={cn(
                'btn btn-primary btn-lg inline-flex items-center space-x-2',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {createTrialMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Trial...</span>
                </>
              ) : (
                <>
                  <span>Start Trial Simulation</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
