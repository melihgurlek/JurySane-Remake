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
    <div className="phase-indicator">
      <div className="phase-indicator-content">
        {/* Progress Bar */}
        <div className="phase-progress-bar">
          <div className="phase-progress-header">
            <span>Trial Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="phase-progress-track">
            <div 
              className="phase-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Phase Steps */}
        <div className="phase-steps-desktop">
          <ol className="phase-steps-list">
            {phases.map((phaseItem, index) => {
              const isCompleted = index < currentPhaseIndex;
              const isCurrent = index === currentPhaseIndex;
              
              // Key Change: Restructured the list item for better layout control
              return (
                <li key={phaseItem.key} className="phase-step">
                  {/* Connector Line: Positioned behind the content */}
                  {index < phases.length - 1 && (
                    <div className={cn(
                      'phase-step-connector',
                      isCompleted ? 'phase-step-connector-completed' : 'phase-step-connector-upcoming'
                    )} />
                  )}
                  
                  {/* Step Content: A wrapper for the icon and text to align them vertically */}
                  <div className="phase-step-content-wrapper">
                    {/* Step Indicator */}
                    <div className={cn(
                      'phase-step-indicator',
                      isCompleted && 'phase-step-completed',
                      isCurrent && 'phase-step-current'
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="phase-step-icon" />
                      ) : (
                        <Circle className="phase-step-icon" />
                      )}
                    </div>

                    {/* Phase Info */}
                    <div className="phase-step-info">
                      <p className={cn(
                        'phase-step-label',
                        isCurrent ? 'phase-step-label-current' : 'phase-step-label-upcoming'
                      )}>
                        {phaseItem.label}
                      </p>
                      <p className="phase-step-description">
                        {phaseItem.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Mobile current phase */}
        <div className="phase-steps-mobile">
          <h3 className="phase-mobile-title">
            {formatTrialPhase(phase)}
          </h3>
          <p className="phase-mobile-description">
            {phases.find(p => p.key === phase)?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhaseIndicator;