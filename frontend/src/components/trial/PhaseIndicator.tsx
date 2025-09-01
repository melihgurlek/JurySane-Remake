import { TrialPhase } from '@/types/trial';
import { formatTrialPhase, getPhaseProgress } from '@/lib/utils';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhaseIndicatorProps {
  phase: TrialPhase;
}

const phases = [
  { key: TrialPhase.SETUP, label: 'Setup', description: 'Case preparation' },
  { key: TrialPhase.OPENING_STATEMENTS, label: 'Opening Statements', description: 'Both sides present their case' },
  { key: TrialPhase.WITNESS_EXAMINATION, label: 'Witness Examination', description: 'Direct and cross examination' },
  { key: TrialPhase.CLOSING_ARGUMENTS, label: 'Closing Arguments', description: 'Final arguments to jury' },
  { key: TrialPhase.JURY_DELIBERATION, label: 'Jury Deliberation', description: 'Jury considers verdict' },
  { key: TrialPhase.VERDICT, label: 'Verdict', description: 'Final decision announced' },
];

const PhaseIndicator = ({ phase }: PhaseIndicatorProps) => {
  const currentPhaseIndex = phases.findIndex(p => p.key === phase);
  const progress = getPhaseProgress(phase);

  return (
    <div className="bg-white border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-secondary-600 mb-2">
            <span>Trial Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Phase Steps */}
        <div className="hidden md:block">
          <ol className="flex items-center justify-between">
            {phases.map((phaseItem, index) => {
              const isCompleted = index < currentPhaseIndex;
              const isCurrent = index === currentPhaseIndex;
              const isUpcoming = index > currentPhaseIndex;

              return (
                <li key={phaseItem.key} className="flex-1 relative">
                  <div className="flex items-center">
                    {/* Step indicator */}
                    <div className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors',
                      isCompleted && 'bg-primary-600 border-primary-600 text-white',
                      isCurrent && 'bg-white border-primary-600 text-primary-600',
                      isUpcoming && 'bg-white border-secondary-300 text-secondary-400'
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </div>

                    {/* Connecting line */}
                    {index < phases.length - 1 && (
                      <div className={cn(
                        'flex-1 h-0.5 mx-4 transition-colors',
                        isCompleted ? 'bg-primary-600' : 'bg-secondary-300'
                      )} />
                    )}
                  </div>

                  {/* Phase info */}
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center w-32">
                    <p className={cn(
                      'text-sm font-medium',
                      isCurrent ? 'text-primary-600' : 'text-secondary-600'
                    )}>
                      {phaseItem.label}
                    </p>
                    <p className="text-xs text-secondary-500 mt-1">
                      {phaseItem.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Mobile current phase */}
        <div className="md:hidden text-center">
          <h3 className="text-lg font-semibold text-primary-600">
            {formatTrialPhase(phase)}
          </h3>
          <p className="text-sm text-secondary-600">
            {phases.find(p => p.key === phase)?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhaseIndicator;
