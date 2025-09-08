import { useEffect, useState } from 'react';
import { Users, FileText, Gavel, RefreshCw } from 'lucide-react';
import { TrialSession, CaseRole, Case } from '@/types/trial';
import { formatCaseRole, formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { CaseService } from '@/services/caseService';

interface TrialSidebarProps {
  session: TrialSession;
  onRefresh: () => void;
}

type TabType = 'participants' | 'evidence' | 'transcript';

const TrialSidebar = ({ session, onRefresh }: TrialSidebarProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('participants');
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loadingCase, setLoadingCase] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingCase(true);
        const c = await CaseService.getCaseById(session.case_id);
        setCaseData(c);
      } finally {
        setLoadingCase(false);
      }
    };
    load();
  }, [session.case_id]);

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
            {participant.role === CaseRole.WITNESS && caseData && (
              (() => {
                const w = caseData.witnesses.find(w => w.name === participant.name);
                if (!w) return null;
                return (
                  <p className="text-xs text-secondary-500 mt-1 line-clamp-2">{w.background}</p>
                );
              })()
            )}
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
      {loadingCase && (
        <p className="text-sm text-secondary-500 text-center py-4">Loading evidence...</p>
      )}
      {caseData && caseData.evidence.length > 0 ? (
        caseData.evidence.map((ev) => {
          const admitted = session.evidence_admitted.includes(ev.id);
          return (
            <div key={ev.id} className="p-3 bg-secondary-50 rounded-lg border border-secondary-200">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-secondary-900 truncate">{ev.title}</p>
                  <p className="text-xs text-secondary-600 mt-1 line-clamp-2">{ev.description}</p>
                </div>
                <span className={cn('text-xs px-2 py-1 rounded-full flex-shrink-0', admitted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
                  {admitted ? 'Admitted' : 'Pending'}
                </span>
              </div>
              <div className="text-[11px] text-secondary-500 mt-1 capitalize">{ev.evidence_type} • submitted by {ev.submitted_by}</div>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-secondary-500 text-center py-4">No evidence listed for this case</p>
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
