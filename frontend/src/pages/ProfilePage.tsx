import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/design-system.css';

const ProfilePage: React.FC = () => {
  const [preferredRole, setPreferredRole] = useState('Defense Attorney');
  const [aiDifficulty, setAiDifficulty] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [simulationResults, setSimulationResults] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(true);

  const userStats = {
    totalTrials: 24,
    averageScore: 87,
    winRate: 68,
    totalHours: 18.5,
    favoriteRole: 'Defense Attorney',
    experienceLevel: 'Advanced'
  };

  const recentAchievements = [
    { id: '1', title: 'Objection Master', description: 'Handled 50+ objections successfully', icon: '🏆' },
    { id: '2', title: 'Quick Learner', description: 'Improved score by 20+ points in a week', icon: '📈' },
    { id: '3', title: 'Trial Veteran', description: 'Completed 20+ trial simulations', icon: '⚖️' }
  ];

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
              <Link to="/history" className="nav-link">History</Link>
              <Link to="/profile" className="nav-link active">Profile</Link>
            </nav>
            <div className="flex items-center gap-4">
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
        <div className="container mx-auto max-w-6xl">
          {/* Profile Header */}
          <div className="card mb-8">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">JD</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">John Doe</h1>
                  <p className="text-lg text-neutral-600 mb-4">Experience Level: <span className="font-semibold text-primary-600">{userStats.experienceLevel}</span></p>
                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {userStats.totalTrials} Trials
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {userStats.totalHours}h Total
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {userStats.winRate}% Win Rate
                    </div>
                  </div>
                </div>
                <button className="btn btn-secondary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Stats and Achievements */}
            <div className="lg:col-span-1 space-y-6">
              {/* Performance Stats */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-bold text-neutral-900">Performance Overview</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Average Score</span>
                      <span className="text-lg font-semibold text-primary-600">{userStats.averageScore}</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${userStats.averageScore}%` }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Win Rate</span>
                      <span className="text-lg font-semibold text-green-600">{userStats.winRate}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${userStats.winRate}%` }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Total Trials</span>
                      <span className="text-lg font-semibold text-blue-600">{userStats.totalTrials}</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(userStats.totalTrials * 4, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-bold text-neutral-900">Recent Achievements</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    {recentAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-start gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-semibold text-neutral-900">{achievement.title}</h4>
                          <p className="text-sm text-neutral-600">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Preferences */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-neutral-900">Preferences</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">Preferred Role</label>
                        <select
                          value={preferredRole}
                          onChange={(e) => setPreferredRole(e.target.value)}
                          className="form-input"
                        >
                          <option>Defense Attorney</option>
                          <option>Prosecutor</option>
                          <option>Both</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">AI Difficulty</label>
                        <div className="flex items-center gap-4">
                          <p className="text-sm text-neutral-600">Adjust the AI's complexity to match your skill level.</p>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={aiDifficulty}
                              onChange={(e) => setAiDifficulty(e.target.checked)}
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

              {/* Notifications */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-neutral-900">Notifications</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-neutral-900">App Notifications</h4>
                        <p className="text-sm text-neutral-600">Receive updates about new features, simulations, and resources.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={appNotifications}
                          onChange={(e) => setAppNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-neutral-900">Simulation Results</h4>
                        <p className="text-sm text-neutral-600">Get notified when your simulations are complete and results are ready.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={simulationResults}
                          onChange={(e) => setSimulationResults(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-neutral-900">Privacy</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-neutral-900">Profile Visibility</h4>
                        <p className="text-sm text-neutral-600">Control who can view your profile and simulation results.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileVisibility}
                          onChange={(e) => setProfileVisibility(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-neutral-900">Account</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <button className="btn btn-secondary w-full justify-start">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export My Data
                    </button>
                    <button className="btn btn-secondary w-full justify-start">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Change Password
                    </button>
                    <button className="btn btn-secondary w-full justify-start text-red-600 hover:text-red-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="btn btn-primary btn-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
