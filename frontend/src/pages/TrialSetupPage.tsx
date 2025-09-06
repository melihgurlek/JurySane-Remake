import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CaseService } from '../services/caseService';
import { trialApi } from '../lib/api';
import { Case, UserRole } from '../types/trial';
import '../styles/design-system.css';

const TrialSetupPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, caseId } = location.state || { role: 'defense', caseId: '1' };
  
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingTrial, setCreatingTrial] = useState(false);
  
  const [aiDifficulty, setAiDifficulty] = useState(50);
  const [trialDuration, setTrialDuration] = useState(60);
  const [notifications, setNotifications] = useState(true);

  // Fetch case data on component mount
  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        setLoading(true);
        setError(null);
        const caseData = await CaseService.getCaseById(caseId);
        setCaseData(caseData);
      } catch (err) {
        setError('Failed to load case data. Please try again.');
        console.error('Error fetching case:', err);
      } finally {
        setLoading(false);
      }
    };

    if (caseId) {
      fetchCaseData();
    }
  }, [caseId]);

  const handleStartTrial = async () => {
    if (!caseData) return;
    
    try {
      setCreatingTrial(true);
      setError(null);
      
      // Create trial session using the API
      const response = await trialApi.createTrial({
        case_id: caseId,
        user_role: role as UserRole,
      });
      
      // Navigate to trial page with session ID
      navigate(`/trial/${response.session_id}`, {
        state: {
          settings: {
            aiDifficulty,
            trialDuration,
            notifications
          }
        }
      });
    } catch (err) {
      setError('Failed to create trial session. Please try again.');
      console.error('Error creating trial:', err);
    } finally {
      setCreatingTrial(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/select-case" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">JurySane</h1>
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-sm text-neutral-600">
                Role: <span className="font-semibold text-primary-600 capitalize">{role} Attorney</span>
              </div>
              <button className="btn btn-ghost">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              Trial Setup
            </h1>
            <p className="text-xl text-neutral-600">
              Review case details and configure your trial simulation settings.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Loading case data...</h3>
              <p className="text-neutral-600">Please wait while we fetch the case details.</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Error loading case</h3>
              <p className="text-neutral-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Case Data Content */}
          {!loading && !error && caseData && (
            <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Case Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Case Summary */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-bold text-neutral-900">Case Summary</h2>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-2">Case Details</h3>
                      <p className="text-sm text-neutral-600">
                        <strong>Case:</strong> {caseData.title}<br/>
                        <strong>Charges:</strong> {caseData.charges.join(', ')}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-2">Facts</h3>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {caseData.case_facts}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal Precedents */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-bold text-neutral-900">Legal Precedents</h3>
                </div>
                <div className="card-body">
                  <ul className="space-y-3">
                    {caseData.legal_precedents.map((precedent, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm text-neutral-600 hover:text-primary-600 transition-colors cursor-pointer">
                        <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span>{precedent}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column - Evidence, Witnesses, and Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Evidence Preview */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-bold text-neutral-900">Evidence Preview</h2>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {caseData.evidence.map((item) => (
                      <div key={item.id} className="group relative overflow-hidden rounded-lg border border-neutral-200">
                        <div className="w-full h-32 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                          <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                          <p className="text-xs text-neutral-500 mt-1">{item.description}</p>
                          <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                            item.is_admitted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {item.is_admitted ? 'Admitted' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Witness List */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-bold text-neutral-900">Witness List</h2>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    {caseData.witnesses.map((witness) => (
                      <div key={witness.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">
                            {witness.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">{witness.name}</p>
                          <p className="text-sm text-neutral-600">{witness.called_by}</p>
                        </div>
                        <span className="status-badge status-success">
                          Available
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trial Settings */}
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-bold text-neutral-900">Trial Settings</h2>
                </div>
                <div className="card-body">
                  <div className="space-y-6">
                    {/* AI Difficulty */}
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <label className="form-label md:col-span-1">AI Difficulty</label>
                      <div className="md:col-span-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={aiDifficulty}
                          onChange={(e) => setAiDifficulty(Number(e.target.value))}
                          className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-xs text-neutral-500 mt-1">
                          <span>Easy</span>
                          <span className="font-medium text-primary-600">{aiDifficulty}%</span>
                          <span>Expert</span>
                        </div>
                      </div>
                    </div>

                    {/* Trial Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <label className="form-label md:col-span-1">Trial Duration</label>
                      <div className="md:col-span-3">
                        <input
                          type="range"
                          min="30"
                          max="120"
                          step="15"
                          value={trialDuration}
                          onChange={(e) => setTrialDuration(Number(e.target.value))}
                          className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-xs text-neutral-500 mt-1">
                          <span>30 min</span>
                          <span className="font-medium text-primary-600">{trialDuration} minutes</span>
                          <span>2 hours</span>
                        </div>
                      </div>
                    </div>

                    {/* Notifications */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-neutral-900">Real-time Notifications</h4>
                        <p className="text-sm text-neutral-600">Get notified about important trial events and rulings.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications}
                          onChange={(e) => setNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/select-case" className="btn btn-secondary btn-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Case Selection
            </Link>
            <button 
              onClick={handleStartTrial} 
              disabled={creatingTrial}
              className="btn btn-primary btn-lg"
            >
              {creatingTrial ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Creating Trial...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  </svg>
                  Start Trial
                </>
              )}
            </button>
          </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrialSetupPage;
