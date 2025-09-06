import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/design-system.css';

interface TrialSession {
  id: string;
  caseType: string;
  caseTitle: string;
  role: string;
  date: string;
  verdict: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  score: number;
  objectionsHandled: number;
  accuracy: number;
  duration: string;
  keyLearnings: string[];
}

const TrialHistoryPage: React.FC = () => {
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('All');

  const trialSessions: TrialSession[] = [
    {
      id: '1',
      caseType: 'Criminal',
      caseTitle: 'The People vs. Alex Turner',
      role: 'Defense Attorney',
      date: '2024-01-26',
      verdict: 'Not Guilty',
      difficulty: 'Intermediate',
      score: 85,
      objectionsHandled: 12,
      accuracy: 92,
      duration: '1h 15m',
      keyLearnings: ['Effective cross-examination techniques', 'Objection timing']
    },
    {
      id: '2',
      caseType: 'Civil',
      caseTitle: 'Smith vs. Johnson Construction',
      role: 'Plaintiff Attorney',
      date: '2024-01-20',
      verdict: 'Plaintiff Won',
      difficulty: 'Beginner',
      score: 90,
      objectionsHandled: 15,
      accuracy: 95,
      duration: '45m',
      keyLearnings: ['Contract law basics', 'Evidence presentation']
    },
    {
      id: '3',
      caseType: 'Family',
      caseTitle: 'Davis vs. Davis',
      role: 'Defense Attorney',
      date: '2024-01-15',
      verdict: 'Settled',
      difficulty: 'Advanced',
      score: 78,
      objectionsHandled: 10,
      accuracy: 88,
      duration: '2h 30m',
      keyLearnings: ['Family law nuances', 'Settlement negotiation']
    },
    {
      id: '4',
      caseType: 'Criminal',
      caseTitle: 'The State vs. Martinez',
      role: 'Prosecutor',
      date: '2024-01-10',
      verdict: 'Guilty',
      difficulty: 'Intermediate',
      score: 82,
      objectionsHandled: 14,
      accuracy: 90,
      duration: '1h 45m',
      keyLearnings: ['Prosecution strategy', 'Witness examination']
    },
    {
      id: '5',
      caseType: 'Civil',
      caseTitle: 'Brown vs. City of Springfield',
      role: 'Defense Attorney',
      date: '2024-01-05',
      verdict: 'Defendant Won',
      difficulty: 'Beginner',
      score: 88,
      objectionsHandled: 13,
      accuracy: 94,
      duration: '1h 20m',
      keyLearnings: ['Municipal liability', 'Expert testimony']
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'status-success';
      case 'Intermediate': return 'status-warning';
      case 'Advanced': return 'status-error';
      default: return 'status-neutral';
    }
  };

  const getVerdictColor = (verdict: string) => {
    if (verdict.includes('Won') || verdict === 'Not Guilty') return 'text-green-600';
    if (verdict === 'Guilty') return 'text-red-600';
    if (verdict === 'Settled') return 'text-blue-600';
    return 'text-neutral-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredSessions = trialSessions.filter(session => {
    if (filterBy === 'All') return true;
    return session.caseType === filterBy;
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'score':
        return b.score - a.score;
      case 'duration':
        return b.duration.localeCompare(a.duration);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">JurySane</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="nav-link">Simulate</Link>
              <Link to="/history" className="nav-link active">History</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
            </nav>
            <div className="flex items-center gap-4">
              <button className="btn btn-ghost">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Trial History</h1>
              <p className="text-neutral-600">Review your past trial simulations and performance metrics.</p>
            </div>
            <button className="btn btn-primary mt-4 sm:mt-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Transcripts
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{trialSessions.length}</div>
                <div className="text-sm text-neutral-600">Total Trials</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.round(trialSessions.reduce((acc, session) => acc + session.score, 0) / trialSessions.length)}
                </div>
                <div className="text-sm text-neutral-600">Average Score</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {trialSessions.reduce((acc, session) => acc + session.objectionsHandled, 0)}
                </div>
                <div className="text-sm text-neutral-600">Objections Handled</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {Math.round(trialSessions.reduce((acc, session) => acc + session.accuracy, 0) / trialSessions.length)}%
                </div>
                <div className="text-sm text-neutral-600">Average Accuracy</div>
              </div>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="card mb-8">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex gap-2">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="form-input"
                  >
                    <option value="All">All Cases</option>
                    <option value="Criminal">Criminal</option>
                    <option value="Civil">Civil</option>
                    <option value="Family">Family</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="form-input"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="score">Sort by Score</option>
                    <option value="duration">Sort by Duration</option>
                  </select>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search trials..."
                      className="form-input pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trial Sessions Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Case Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Verdict
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Difficulty
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Performance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {sortedSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-neutral-900">{session.caseTitle}</div>
                          <div className="text-sm text-neutral-500">{session.caseType} • {session.role}</div>
                          <div className="text-xs text-neutral-400">{session.duration}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {new Date(session.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${getVerdictColor(session.verdict)}`}>
                          {session.verdict}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`status-badge ${getDifficultyColor(session.difficulty)}`}>
                          {session.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${getScoreColor(session.score)}`}>
                          {session.score}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-600">
                          <div>{session.objectionsHandled} objections</div>
                          <div>{session.accuracy}% accuracy</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                            View Details
                          </button>
                          <button className="text-neutral-400 hover:text-neutral-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Learnings Section */}
          <div className="card mt-8">
            <div className="card-header">
              <h2 className="text-xl font-bold text-neutral-900">Recent Key Learnings</h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trialSessions.slice(0, 6).flatMap(session => session.keyLearnings).slice(0, 6).map((learning, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-neutral-700">{learning}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrialHistoryPage;
