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
    { id: 'timeline', label: 'Trial Timeline', icon: '⏰' },
    { id: 'notes', label: 'My Notes', icon: '📝' }
  ];

  const [activeSidebarItem, setActiveSidebarItem] = useState('case-info');

  // const handlePhaseAdvance = () => {
  //   if (currentPhase < phases.length - 1) {
  //     setCurrentPhase(currentPhase + 1);
  //   }
  // };

  const getPhaseProgress = () => {
    return ((currentPhase + 1) / phases.length) * 100;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/select-case" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-neutral-900">JurySane</h1>
              </Link>
              <div className="hidden md:block text-sm text-neutral-600">
                <span className="font-semibold">{trialData.caseTitle}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{role} Attorney</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-neutral-600">
                Session: <span className="font-mono text-primary-600">{trialData.sessionId}</span>
              </div>
              <div className="text-sm text-neutral-600">
                Participants: <span className="font-semibold">{trialData.participants}</span>
              </div>
              <button className="btn btn-ghost text-red-600 hover:text-red-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3m13 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Exit Trial
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4">
          <div className="phase-indicator">
            <div className="phase-indicator-content">
              {/* Progress Bar */}
              <div className="phase-progress-bar">
                <div className="phase-progress-header">
                  <span>Trial Progress</span>
                  <span>{Math.round(getPhaseProgress())}% Complete</span>
                </div>
                <div className="phase-progress-track">
                  <div 
                    className="phase-progress-fill"
                    style={{ width: `${getPhaseProgress()}%` }}
                  />
                </div>
              </div>

              {/* Phase Steps */}
              <div className="phase-steps-desktop">
                <ol className="phase-steps-list">
                  {phases.map((phaseItem, index) => {
                    const isCompleted = index < currentPhase;
                    const isCurrent = index === currentPhase;
                    
                    return (
                      <li key={phaseItem.key} className="phase-step">
                        {/* Connector Line */}
                        {index < phases.length - 1 && (
                          <div className={`phase-step-connector ${
                            isCompleted ? 'phase-step-connector-completed' : 'phase-step-connector-upcoming'
                          }`} />
                        )}
                        
                        {/* Step Content */}
                        <div className="phase-step-content-wrapper">
                          {/* Step Indicator */}
                          <div className={`phase-step-indicator ${
                            isCompleted ? 'phase-step-completed' : ''
                          } ${isCurrent ? 'phase-step-current' : ''}`}>
                            {isCompleted ? (
                              <svg className="phase-step-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                              </svg>
                            ) : (
                              <svg className="phase-step-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"/>
                              </svg>
                            )}
                          </div>

                          {/* Phase Info */}
                          <div className="phase-step-info">
                            <p className={`phase-step-label ${
                              isCurrent ? 'phase-step-label-current' : 'phase-step-label-upcoming'
                            }`}>
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
                  {phases[currentPhase]?.label}
                </h3>
                <p className="phase-mobile-description">
                  {phases[currentPhase]?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-neutral-200 flex flex-col">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Trial Resources</h2>
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSidebarItem(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSidebarItem === item.id
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSidebarItem === 'case-info' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Case Details</h3>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <p><strong>Title:</strong> {trialData.caseTitle}</p>
                    <p><strong>Type:</strong> {trialData.caseType}</p>
                    <p><strong>Charges:</strong> {trialData.charges}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Key Facts</h3>
                  <p className="text-sm text-neutral-600">
                    Alex Turner is accused of assaulting a person during an altercation at a local bar. 
                    The prosecution claims Turner initiated the physical confrontation, while the defense argues self-defense.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Legal Precedents</h3>
                  <ul className="text-sm text-neutral-600 space-y-1">
                    <li>• State v. Johnson, 2018</li>
                    <li>• People v. Smith, 2020</li>
                    <li>• Commonwealth v. Davis, 2022</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSidebarItem === 'evidence' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-900 mb-4">Evidence Locker</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Security Footage', status: 'Admitted', relevance: 'High' },
                    { name: 'Medical Report', status: 'Pending', relevance: 'High' },
                    { name: 'Police Report', status: 'Admitted', relevance: 'Medium' }
                  ].map((evidence, index) => (
                    <div key={index} className="p-3 border border-neutral-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-neutral-900 text-sm">{evidence.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          evidence.status === 'Admitted' ? 'bg-green-100 text-green-700' :
                          evidence.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {evidence.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">Relevance: {evidence.relevance}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSidebarItem === 'witnesses' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-900 mb-4">Witness List</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Ethan Carter', role: 'Victim', status: 'Available' },
                    { name: 'Olivia Bennett', role: 'Witness', status: 'Available' },
                    { name: 'Noah Thompson', role: 'Witness', status: 'Examined' }
                  ].map((witness, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-sm">
                          {witness.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-900 text-sm">{witness.name}</h4>
                        <p className="text-xs text-neutral-500">{witness.role}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        witness.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {witness.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSidebarItem === 'timeline' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-900 mb-4">Trial Timeline</h3>
                <div className="space-y-3">
                  {[
                    { time: '10:00 AM', event: 'Trial begins', type: 'start' },
                    { time: '10:15 AM', event: 'Opening statements', type: 'milestone' },
                    { time: '11:30 AM', event: 'Evidence presentation', type: 'milestone' },
                    { time: '2:00 PM', event: 'Witness examination', type: 'current' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        item.type === 'start' ? 'bg-green-500' :
                        item.type === 'current' ? 'bg-primary-500' :
                        'bg-neutral-300'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{item.event}</p>
                        <p className="text-xs text-neutral-500">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSidebarItem === 'notes' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-900 mb-4">My Notes</h3>
                <textarea
                  placeholder="Add your private notes and strategy here..."
                  className="w-full h-32 p-3 border border-neutral-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="space-y-2">
                  <h4 className="font-medium text-neutral-900 text-sm">Quick Notes</h4>
                  <div className="space-y-1">
                    <div className="text-xs text-neutral-600 p-2 bg-neutral-50 rounded">Key witness credibility issues</div>
                    <div className="text-xs text-neutral-600 p-2 bg-neutral-50 rounded">Objection opportunities</div>
                    <div className="text-xs text-neutral-600 p-2 bg-neutral-50 rounded">Evidence chain of custody</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-white">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Welcome Message */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-sm font-semibold text-neutral-800">Judge</p>
                  <div className="mt-1 rounded-lg rounded-tl-none bg-white p-3 shadow-sm border border-neutral-200">
                    <p className="text-neutral-700">The court is now in session. Counsel, you may proceed with your opening statements.</p>
                  </div>
                </div>
              </div>

              {/* User Message */}
              <div className="flex items-start justify-end gap-4">
                <div className="flex flex-col items-end">
                  <p className="text-sm font-semibold text-neutral-800 capitalize">{role} Attorney</p>
                  <div className="mt-1 rounded-lg rounded-tr-none bg-primary-600 p-3 text-white shadow-sm">
                    <p>Thank you, your Honor. The {role} will demonstrate that our case is strong and compelling.</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">You</span>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-sm font-semibold text-neutral-800">Judge</p>
                  <div className="mt-1 rounded-lg rounded-tl-none bg-white p-3 shadow-sm border border-neutral-200">
                    <p className="text-neutral-700">Very well. The prosecution may call its first witness.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-neutral-200 bg-white p-4">
            <div className="relative">
              <textarea 
                className="w-full resize-none rounded-md border-neutral-300 bg-neutral-100 pr-28 text-neutral-800 placeholder-neutral-500 focus:border-primary-500 focus:ring-primary-500" 
                placeholder="Address the Judge, Prosecutor, Defense Attorney, or Witness..." 
                rows={1}
              />
              <button className="absolute bottom-2 right-2 flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
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
