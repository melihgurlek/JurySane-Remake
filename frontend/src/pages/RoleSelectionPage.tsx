import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/design-system.css';

const RoleSelectionPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'defense' | 'prosecutor' | null>(null);
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'defense' | 'prosecutor') => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigate('/select-case', { state: { role: selectedRole } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200">
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
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Choose Your Role
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Select which side you'd like to represent in the trial simulation. Each role offers unique challenges and learning opportunities.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Defense Attorney Card */}
            <div 
              className={`card cursor-pointer transition-all duration-300 ${
                selectedRole === 'defense' 
                  ? 'ring-2 ring-primary-500 shadow-xl transform scale-105' 
                  : 'hover:shadow-lg hover:scale-102'
              }`}
              onClick={() => handleRoleSelect('defense')}
            >
              <div className="relative overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <h3 className="text-2xl font-bold">Defense Attorney</h3>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  {selectedRole === 'defense' && (
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-8">
                <p className="text-neutral-600 mb-6">
                  Represent the defendant, ensuring their rights are protected and presenting a compelling defense strategy.
                </p>
                
                <h4 className="text-lg font-semibold text-neutral-900 mb-4">Key Responsibilities:</h4>
                <ul className="space-y-3 text-neutral-600">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Develop a robust defense strategy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Cross-examine prosecution witnesses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Present exculpatory evidence</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Deliver a powerful closing argument</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Prosecutor Card */}
            <div 
              className={`card cursor-pointer transition-all duration-300 ${
                selectedRole === 'prosecutor' 
                  ? 'ring-2 ring-primary-500 shadow-xl transform scale-105' 
                  : 'hover:shadow-lg hover:scale-102'
              }`}
              onClick={() => handleRoleSelect('prosecutor')}
            >
              <div className="relative overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <h3 className="text-2xl font-bold">Prosecutor</h3>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  {selectedRole === 'prosecutor' && (
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-8">
                <p className="text-neutral-600 mb-6">
                  Represent the state, presenting evidence and arguments to prove the defendant's guilt beyond a reasonable doubt.
                </p>
                
                <h4 className="text-lg font-semibold text-neutral-900 mb-4">Key Responsibilities:</h4>
                <ul className="space-y-3 text-neutral-600">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Present a clear opening statement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Examine witnesses effectively</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Introduce incriminating evidence</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Deliver a persuasive closing argument</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Case Preview Section */}
          <div className="card mb-12">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900">Case Preview</h3>
              </div>
              <p className="text-neutral-600 mb-4">
                Review a brief overview of the case details, including charges, key evidence, and witness information. 
                This preview helps you prepare for your role and understand the context of the trial.
              </p>
              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="font-semibold text-neutral-900 mb-2">Sample Case: The People vs. Alex Turner</h4>
                <p className="text-sm text-neutral-600">
                  <strong>Charges:</strong> Assault and Battery (Misdemeanor)<br/>
                  <strong>Facts:</strong> Alex Turner is accused of assaulting a person during an altercation at a local bar. 
                  The prosecution claims Turner initiated the physical confrontation, while the defense argues self-defense.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn btn-secondary btn-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <button 
              onClick={handleContinue}
              disabled={!selectedRole}
              className="btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Case Selection
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoleSelectionPage;
