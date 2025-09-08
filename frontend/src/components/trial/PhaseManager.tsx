import React, { useState } from 'react';
import { ChevronRight, Play, Pause, CheckCircle } from 'lucide-react';
import { TrialSession, TrialPhase } from '@/types/trial';
import { trialApi } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';

interface PhaseManagerProps {
  session: TrialSession;
  onPhaseChange: () => void;
}

const PhaseManager = ({ session, onPhaseChange }: PhaseManagerProps) => {
  const [isAdvancing, setIsAdvancing] = useState(false);

  const phases = [
    {
      key: TrialPhase.SETUP,
      label: 'Setup',
      description: 'Trial preparation and participant introduction',
      icon: '⚙️',
    },
    {
      key: TrialPhase.OPENING_STATEMENTS,
      label: 'Opening Statements',
      description: 'Initial arguments from both sides',
      icon: '🎯',
    },
    {
      key: TrialPhase.WITNESS_EXAMINATION,
      label: 'Witness Examination',
      description: 'Direct and cross-examination of witnesses',
      icon: '👥',
    },
    {
      key: TrialPhase.CLOSING_ARGUMENTS,
      label: 'Closing Arguments',
      description: 'Final persuasive arguments',
      icon: '💬',
    },
    {
      key: TrialPhase.JURY_DELIBERATION,
      label: 'Jury Deliberation',
      description: 'Jury considers the evidence',
      icon: '🤔',
    },
    {
      key: TrialPhase.VERDICT,
      label: 'Verdict',
      description: 'Jury announces decision',
      icon: '⚖️',
    },
    {
      key: TrialPhase.COMPLETED,
      label: 'Completed',
      description: 'Trial concluded',
      icon: '✅',
    },
  ];

  const currentPhaseIndex = phases.findIndex(phase => phase.key === session.current_phase);
  const nextPhase = phases[currentPhaseIndex + 1];

  const advancePhase = async () => {
    if (!nextPhase) return;

    try {
      setIsAdvancing(true);
      await trialApi.advancePhase(session.id, { next_phase: nextPhase.key });
      onPhaseChange();
      toast.success(`Trial advanced to ${nextPhase.label}`);
    } catch (error: any) {
      console.error('Failed to advance phase:', error);
      toast.error(error.response?.data?.detail || 'Failed to advance trial phase');
    } finally {
      setIsAdvancing(false);
    }
  };

  const getPhaseStatus = (phaseKey: TrialPhase) => {
    const phaseIndex = phases.findIndex(phase => phase.key === phaseKey);
    const currentIndex = currentPhaseIndex;

    if (phaseIndex < currentIndex) {
      return 'completed';
    } else if (phaseIndex === currentIndex) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  const getPhaseIcon = (phaseKey: TrialPhase) => {
    const status = getPhaseStatus(phaseKey);
    const phase = phases.find(p => p.key === phaseKey);

    if (status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (status === 'current') {
      return <Play className="h-5 w-5 text-blue-600" />;
    } else {
      return <span className="text-2xl">{phase?.icon}</span>;
    }
  };

  return (
    <div className="phase-manager">
      <div className="phase-manager-header">
        <h3 className="phase-manager-title">Trial Progress</h3>
        <div className="phase-manager-current">
          <span className="phase-manager-current-label">Current Phase:</span>
          <span className="phase-manager-current-phase">
            {phases.find(p => p.key === session.current_phase)?.label}
          </span>
        </div>
      </div>

      <div className="phase-manager-content">
        {/* Phase Timeline */}
        <div className="phase-timeline">
          {phases.map((phase, index) => {
            const status = getPhaseStatus(phase.key);
            const isLast = index === phases.length - 1;

            return (
              <div key={phase.key} className="phase-timeline-item">
                <div className="phase-timeline-content">
                  <div className={cn(
                    'phase-timeline-icon',
                    `phase-timeline-icon-${status}`
                  )}>
                    {getPhaseIcon(phase.key)}
                  </div>
                  <div className="phase-timeline-details">
                    <h4 className={cn(
                      'phase-timeline-title',
                      `phase-timeline-title-${status}`
                    )}>
                      {phase.label}
                    </h4>
                    <p className="phase-timeline-description">
                      {phase.description}
                    </p>
                  </div>
                </div>
                {!isLast && (
                  <div className={cn(
                    'phase-timeline-connector',
                    `phase-timeline-connector-${status}`
                  )}>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Phase Controls */}
        {nextPhase && session.current_phase !== TrialPhase.COMPLETED && (
          <div className="phase-controls">
            <div className="phase-controls-info">
              <h4 className="phase-controls-title">
                Ready to advance to {nextPhase.label}?
              </h4>
              <p className="phase-controls-description">
                {nextPhase.description}
              </p>
            </div>
            <button
              onClick={advancePhase}
              disabled={isAdvancing}
              className="phase-controls-button"
            >
              {isAdvancing ? (
                <>
                  <Pause className="h-4 w-4 animate-spin" />
                  Advancing...
                </>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4" />
                  Advance to {nextPhase.label}
                </>
              )}
            </button>
          </div>
        )}

        {session.current_phase === TrialPhase.COMPLETED && (
          <div className="phase-completed">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <h4 className="phase-completed-title">Trial Completed</h4>
            <p className="phase-completed-description">
              The trial has concluded. All phases have been completed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseManager;
