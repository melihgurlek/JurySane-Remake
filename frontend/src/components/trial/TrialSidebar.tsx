import { useState } from 'react';
import { Users, FileText, Gavel, RefreshCw } from 'lucide-react';
import { TrialSession } from '@/types/trial';
import { formatCaseRole, formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TrialSidebarProps {
  session: TrialSession;
  onRefresh: () => void;
}

type TabType = 'participants' | 'evidence' | 'transcript';

const TrialSidebar = ({ session, onRefresh }: TrialSidebarProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('participants');

  const tabs = [
    { key: 'participants' as TabType, label: 'Participants', icon: Users },
    { key: 'evidence' as TabType, label: 'Evidence', icon: FileText },
    { key: 'transcript' as TabType, label: 'Transcript', icon: Gavel },
  ];

  const renderParticipants = () => (
    <div className="space-y-3">
      {session.participants.map((participant) => (
        <div key={participant.id} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
          <div className={cn(
            'w-3 h-3 rounded-full',
            participant.is_ai ? 'bg-blue-500' : 'bg-green-500'
          )} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary-900 truncate">
              {participant.name}
            </p>
            <p className="text-xs text-secondary-600">
              {formatCaseRole(participant.role)}
            </p>
          </div>
          {!participant.is_ai && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              You
            </span>
          )}
        </div>
      ))}
    </div>
  );

  const renderEvidence = () => (
    <div className="space-y-3">
      {session.evidence_admitted.length === 0 ? (
        <p className="text-sm text-secondary-500 text-center py-4">
          No evidence admitted yet
        </p>
      ) : (
        session.evidence_admitted.map((evidenceId) => (
          <div key={evidenceId} className="p-3 bg-secondary-50 rounded-lg">
            <p className="text-sm font-medium text-secondary-900">
              Evidence #{evidenceId.slice(-6)}
            </p>
            <p className="text-xs text-secondary-600 mt-1">
              Admitted to trial
            </p>
          </div>
        ))
      )}
    </div>
  );

  const renderTranscript = () => (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {session.transcript.length === 0 ? (
        <p className="text-sm text-secondary-500 text-center py-4">
          Trial hasn't started yet
        </p>
      ) : (
        session.transcript.slice(-10).map((entry, index) => (
          <div key={index} className="p-3 bg-secondary-50 rounded-lg">
            <div className="flex justify-between items-start mb-1">
              <p className="text-sm font-medium text-secondary-900">
                {entry.speaker}
              </p>
              {entry.timestamp && (
                <p className="text-xs text-secondary-500">
                  {formatTime(entry.timestamp)}
                </p>
              )}
            </div>
            <p className="text-xs text-secondary-600 line-clamp-3">
              {entry.content}
            </p>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-secondary-900">
            Trial Information
          </h2>
          <button
            onClick={onRefresh}
            className="p-1 text-secondary-400 hover:text-secondary-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex-1 flex items-center justify-center space-x-1 py-3 px-2 text-sm font-medium transition-colors',
                  activeTab === tab.key
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-secondary-600 hover:text-secondary-900'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-hidden">
        {activeTab === 'participants' && renderParticipants()}
        {activeTab === 'evidence' && renderEvidence()}
        {activeTab === 'transcript' && renderTranscript()}
      </div>
    </div>
  );
};

export default TrialSidebar;
