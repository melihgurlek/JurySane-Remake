import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { trialApi } from '@/lib/api';
import { Case, TrialSession, UserRole } from '@/types/trial';
import { CaseService } from '@/services/caseService';
import TrialChat from '@/components/trial/TrialChat';
import PhaseManager from '@/components/trial/PhaseManager';
import EvidenceManager from '@/components/trial/EvidenceManager';
import TrialNotes from '@/components/trial/TrialNotes';
import '../styles/design-system.css';
import '../styles/trial-components.css';

const TrialPageNew: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<TrialSession | null>(null);
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.DEFENSE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPhase] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!sessionId) return;
      try {
        setLoading(true);
        setError(null);
        const s = await trialApi.getTrialSession(sessionId);
        setSession(s);
        setRole(s.user_role);
        const c = await CaseService.getCaseById(s.case_id);
        setCaseData(c);
      } catch (e) {
        console.error('Failed to load trial session:', e);
        setError('Failed to load trial session');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId]);

  const phases = [
    { key: 'opening', label: 'Opening Statements', description: 'Present initial arguments' },
    { key: 'evidence', label: 'Evidence Presentation', description: 'Introduce and examine evidence' },
    { key: 'witnesses', label: 'Witness Examination', description: 'Cross-examine witnesses' },
    { key: 'closing', label: 'Closing Arguments', description: 'Final persuasive arguments' },
    { key: 'verdict', label: 'Verdict', description: 'Jury deliberation and decision' }
  ];

  const sidebarItems = [
    { id: 'case-info', label: 'Case Info', icon: '📋' },
    { id: 'evidence', label: 'Evidence Locker', icon: '📁' },
    { id: 'witnesses', label: 'Witness List', icon: '👥' },
    { id: 'phases', label: 'Trial Progress', icon: '⚖️' },
    { id: 'notes', label: 'My Notes', icon: '📝' }
  ];

  const [activeSidebarItem, setActiveSidebarItem] = useState('case-info');
  const [expandedEvidenceIds, setExpandedEvidenceIds] = useState<Set<string>>(new Set());

  const getPhaseProgress = () => {
    return ((currentPhase + 1) / phases.length) * 100;
  };

  const refresh = async () => {
    if (!sessionId) return;
    try {
      const s = await trialApi.getTrialSession(sessionId);
      setSession(s);
      setRole(s.user_role);
      const c = await CaseService.getCaseById(s.case_id);
      setCaseData(c);
    } catch (e) {
      console.error('Failed to refresh trial session:', e);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-neutral-700">Loading trial...</p>
        </div>
      </div>
    );
  }

  if (error || !session || !caseData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-3">{error || 'Trial session not found'}</p>
          <Link to="/select-case" className="btn btn-primary">Back to Case Selection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      {/* Compact Header (will not shrink) */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 flex-shrink-0">
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/select-case" className="flex items-center">
                <div className="w-6 h-6 text-neutral-500 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                </div>
              </Link>
              <div className="hidden md:flex items-center gap-4 text-sm text-neutral-600">
                <span className="font-semibold">{caseData.title}</span>
                <span className="text-neutral-400">•</span>
                <span className="capitalize">{role} Attorney</span>
                <span className="text-neutral-400">•</span>
                <span>Session: <span className="font-mono text-primary-600">{session.id}</span></span>
              </div>
              {/* Navigation */}
              <div className="hidden lg:flex items-center gap-2 ml-4">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSidebarItem(item.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs transition-colors ${
                      activeSidebarItem === item.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-neutral-600">
                <span className="font-semibold text-primary-600">{phases[currentPhase]?.label}</span>
                <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                  {Math.round(getPhaseProgress())}%
                </span>
              </div>
              <button className="btn btn-ghost text-red-600 hover:text-red-700 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3m13 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Exit
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content (will grow to fill remaining space) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            {activeSidebarItem === 'case-info' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold font-sans text-neutral-900 mb-1 text-base">Case Details</h3>
                  <div className="text-base text-neutral-600 space-y-1">
                    <p><strong>Title:</strong> {caseData.title}</p>
                    <p><strong>Charges:</strong> {caseData.charges.join(', ')}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold font-sans text-neutral-900 mb-1 text-base">Key Facts</h3>
                  <p className="text-base text-neutral-600 leading-normal whitespace-pre-line">{caseData.case_facts}</p>
                </div>
                <div>
                  <h3 className="font-semibold font-sans text-neutral-900 mb-1 text-base">Legal Precedents</h3>
                  <div className="text-base text-neutral-600">
                    {caseData.legal_precedents.join(' • ')}
                  </div>
                </div>
              </div>
            )}

            {activeSidebarItem === 'evidence' && (
              <div className="space-y-3">
                <h3 className="font-semibold font-sans text-neutral-900 mb-1 text-base">Evidence Locker</h3>
                <div className="space-y-2">
                  {caseData.evidence.map((ev) => {
                    const admitted = (session.evidence_admitted || []).includes(ev.id) || ev.is_admitted;
                    return (
                      <div key={ev.id} className="p-2 border border-neutral-200 rounded text-base">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <button
                              className="font-medium text-neutral-900 block text-left underline decoration-dotted hover:decoration-solid"
                              onClick={() => {
                                const next = new Set(expandedEvidenceIds);
                                if (next.has(ev.id)) next.delete(ev.id); else next.add(ev.id);
                                setExpandedEvidenceIds(next);
                              }}
                            >
                              {expandedEvidenceIds.has(ev.id) ? ev.title : (ev.title.length > 24 ? ev.title.slice(0, 21) + '…' : ev.title)}
                            </button>
                            <span className="text-xs text-neutral-500 block mt-1 capitalize">{ev.evidence_type} • Submitted by {ev.submitted_by}</span>
                            <p className={`text-xs text-neutral-600 mt-1 ${expandedEvidenceIds.has(ev.id) ? '' : 'line-clamp-2'}`}>{ev.description}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-sm ${admitted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {admitted ? 'Admitted' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeSidebarItem === 'witnesses' && (
              <div className="space-y-3">
                <h3 className="font-semibold font-sans text-neutral-900 mb-1 text-base">Witness List</h3>
                <div className="space-y-2">
                  {caseData.witnesses.map((w) => (
                    <div key={w.id} className="flex items-start gap-2 p-2 border border-neutral-200 rounded text-base">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-neutral-900">{w.name}</div>
                        <div className="text-neutral-500 text-xs capitalize">Called by {w.called_by}</div>
                        <div className="text-neutral-600 text-xs mt-1 whitespace-pre-line break-words">
                          {w.background}
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-700">Available</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSidebarItem === 'notes' && (
              <div className="space-y-3">
                <h3 className="font-semibold font-sans text-neutral-900 mb-1 text-base">My Notes</h3>
                <textarea
                  placeholder="Add your private notes and strategy here..."
                  className="w-full h-24 p-2 border border-neutral-300 rounded text-base resize-none focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-white relative">
          {/* Chat Interface - Always visible and fills the space */}
          <div className="flex-1 flex flex-col">
            <TrialChat session={session} onRefresh={refresh} />
          </div>

          {/* Overlay content for different sidebar sections */}
          {activeSidebarItem === 'evidence' && (
            <div className="absolute inset-0 bg-white z-10">
              <EvidenceManager
                session={session}
                caseEvidence={caseData.evidence}
                onEvidenceChange={refresh}
              />
            </div>
          )}

          {activeSidebarItem === 'witnesses' && (
            <div className="absolute inset-0 bg-white z-10 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Witness List</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {caseData.witnesses.map((witness) => (
                    <div key={witness.id} className="bg-white border border-neutral-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-neutral-900">{witness.name}</h3>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Available
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-neutral-700">Called by:</span>
                          <p className="text-neutral-900 capitalize">{witness.called_by}</p>
                        </div>
                        <div>
                          <span className="font-medium text-neutral-700">Background:</span>
                          <p className="text-neutral-700 text-sm leading-relaxed">{witness.background}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSidebarItem === 'phases' && (
            <div className="absolute inset-0 bg-white z-10 overflow-y-auto p-6">
              <PhaseManager session={session} onPhaseChange={refresh} />
            </div>
          )}

          {activeSidebarItem === 'notes' && (
            <div className="absolute inset-0 bg-white z-10">
              <TrialNotes session={session} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TrialPageNew;