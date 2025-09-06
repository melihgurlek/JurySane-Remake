import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/design-system.css';

const TrialPageNew: React.FC = () => {
  const location = useLocation();
  const { role } = location.state || { 
    role: 'defense'
  };

  const [currentPhase] = useState(0);
  const [trialData] = useState({
    caseTitle: 'The People vs. Alex Turner',
    caseType: 'Criminal',
    charges: 'Assault and Battery (Misdemeanor)',
    sessionId: 'trial-123',
    startTime: new Date(),
    participants: 6
  });

  const phases = [
    { key: 'opening', label: 'Opening Statements', description: 'Present initial arguments' },
    { key: 'evidence', label: 'Evidence Presentation', description: 'Introduce and examine evidence' },
    { key: 'witnesses', label: 'Witness Examination', description: 'Cross-examine witnesses' },
    { key: 'closing', label: 'Closing Arguments', description: 'Final persuasive arguments' },
    { key: 'verdict', label: 'Verdict', description: 'Jury deliberation and decision' }
  ];

  const sidebarItems = [
    { id: 'case-info', label: 'Case Info', icon: '📋', active: true },
    { id: 'evidence', label: 'Evidence Locker', icon: '📁' },
    { id: 'witnesses', label: 'Witness List', icon: '👥' },
    { id: 'notes', label: 'My Notes', icon: '📝' }
  ];

  const [activeSidebarItem, setActiveSidebarItem] = useState('case-info');
  const [inputValue, setInputValue] = useState('');

  const getPhaseProgress = () => {
    return ((currentPhase + 1) / phases.length) * 100;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

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
                <span className="font-semibold">{trialData.caseTitle}</span>
                <span className="text-neutral-400">•</span>
                <span className="capitalize">{role} Attorney</span>
                <span className="text-neutral-400">•</span>
                <span>Session: <span className="font-mono text-primary-600">{trialData.sessionId}</span></span>
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

          {/* Sidebar Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeSidebarItem === 'case-info' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold font-sans text-neutral-900 mb-1 text-base">Case Details</h3>
                  <div className="text-base text-neutral-600 space-y-1">
                    <p><strong>Title:</strong> {trialData.caseTitle}</p>
                    <p><strong>Type:</strong> {trialData.caseType} • <strong>Charges:</strong> {trialData.charges}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold font-sans text-neutral-900 mb-1 text-base">Key Facts</h3>
                  <p className="text-base text-neutral-600 leading-normal">
                    Alex Turner accused of assault during bar altercation. Prosecution claims Turner initiated confrontation, defense argues self-defense.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold font-sans text-neutral-900 mb-1 text-base">Precedents</h3>
                  <div className="text-base text-neutral-600">
                    State v. Johnson, 2018 • People v. Smith, 2020 • Commonwealth v. Davis, 2022
                  </div>
                </div>
              </div>
            )}

            {activeSidebarItem === 'evidence' && (
              <div className="space-y-3">
                <h3 className="font-semibold font-sans text-neutral-900 mb-1 text-base">Evidence Locker</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Security Footage', status: 'Admitted', relevance: 'High' },
                    { name: 'Medical Report', status: 'Pending', relevance: 'High' },
                    { name: 'Police Report', status: 'Admitted', relevance: 'Medium' }
                  ].map((evidence, index) => (
                    <div key={index} className="p-2 border border-neutral-200 rounded text-base">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-neutral-900">{evidence.name}</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          evidence.status === 'Admitted' ? 'bg-green-100 text-green-700' :
                          evidence.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {evidence.status}
                        </span>
                      </div>
                      <div className="text-neutral-500 text-base">{evidence.relevance}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSidebarItem === 'witnesses' && (
              <div className="space-y-3">
                <h3 className="font-semibold font-sans text-neutral-900 mb-1 text-base">Witness List</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Ethan Carter', role: 'Victim', status: 'Available' },
                    { name: 'Olivia Bennett', role: 'Witness', status: 'Available' },
                    { name: 'Noah Thompson', role: 'Witness', status: 'Examined' }
                  ].map((witness, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 border border-neutral-200 rounded text-base">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-600 font-semibold text-sm">
                          {witness.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-neutral-900">{witness.name}</div>
                        <div className="text-neutral-500">{witness.role}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        witness.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {witness.status}
                      </span>
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
                <div className="space-y-2">
                  <h4 className="font-medium text-neutral-900 text-base">Quick Notes</h4>
                  <div className="space-y-1">
                    <div className="text-base text-neutral-600 p-2 bg-neutral-50 rounded">Key witness credibility issues</div>
                    <div className="text-base text-neutral-600 p-2 bg-neutral-50 rounded">Objection opportunities</div>
                    <div className="text-base text-neutral-600 p-2 bg-neutral-50 rounded">Evidence chain of custody</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-white">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* Welcome Message */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-base font-semibold text-neutral-800">Judge</p>
                  <div className="mt-1 rounded rounded-tl-none bg-white p-3 shadow-sm border border-neutral-200">
                    <p className="text-base text-neutral-700">The court is now in session. Counsel, you may proceed with your opening statements.</p>
                  </div>
                </div>
              </div>

              {/* User Message */}
              <div className="flex items-start justify-end gap-3">
                <div className="flex flex-col items-end">
                  <p className="text-base font-semibold text-neutral-800 capitalize">{role} Attorney</p>
                  <div className="mt-1 rounded rounded-tr-none bg-primary-600 p-3 text-white shadow-sm">
                    <p className="text-base">Thank you, your Honor. The {role} will demonstrate that our case is strong and compelling.</p>
                  </div>
                </div>
                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-semibold text-base">You</span>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-base font-semibold text-neutral-800">Judge</p>
                  <div className="mt-1 rounded rounded-tl-none bg-white p-3 shadow-sm border border-neutral-200">
                    <p className="text-base text-neutral-700">Very well. The prosecution may call its first witness.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-neutral-200 bg-white p-2">
            <div className="flex gap-2 items-end">
              <textarea 
                value={inputValue}
                onChange={handleInputChange}
                className="flex-1 resize-none rounded-md border-neutral-300 bg-neutral-100 text-neutral-800 placeholder-neutral-500 focus:border-primary-500 focus:ring-primary-500 px-3 py-2 min-h-[44px] max-h-[120px] overflow-y-auto text-base" 
                placeholder="Address the Judge, Prosecutor, Defense Attorney, or Witness..." 
                rows={1}
                style={{ height: '44px' }}
              />
              <button className="flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-primary-700 whitespace-nowrap h-11">
                <span>Send</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrialPageNew;