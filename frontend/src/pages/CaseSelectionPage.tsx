import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/design-system.css';

interface Case {
  id: string;
  title: string;
  type: 'Criminal' | 'Civil' | 'Family';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  estimatedDuration: string;
  keyConcepts: string[];
  image: string;
}

const CaseSelectionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedRole = location.state?.role || 'defense';
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const cases: Case[] = [
    {
      id: '1',
      title: 'Theft at the Local Market',
      type: 'Criminal',
      difficulty: 'Beginner',
      description: 'A shoplifting case involving surveillance footage and witness testimony.',
      estimatedDuration: '30-45 minutes',
      keyConcepts: ['Evidence Analysis', 'Witness Examination', 'Burden of Proof'],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      title: 'Contract Dispute Between Businesses',
      type: 'Civil',
      difficulty: 'Intermediate',
      description: 'A complex business contract dispute involving breach of agreement claims.',
      estimatedDuration: '45-60 minutes',
      keyConcepts: ['Contract Law', 'Damages', 'Negotiation'],
      image: 'https://images.unsplash.com/photo-1450101499163-8841dcb4ac2e?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      title: 'Assault in a Public Park',
      type: 'Criminal',
      difficulty: 'Advanced',
      description: 'A violent altercation case with conflicting witness accounts and self-defense claims.',
      estimatedDuration: '60-90 minutes',
      keyConcepts: ['Self-Defense', 'Witness Credibility', 'Intent'],
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
    },
    {
      id: '4',
      title: 'Property Damage from Construction',
      type: 'Civil',
      difficulty: 'Beginner',
      description: 'A negligence case involving construction damage to neighboring property.',
      estimatedDuration: '30-45 minutes',
      keyConcepts: ['Negligence', 'Property Rights', 'Expert Testimony'],
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop'
    },
    {
      id: '5',
      title: 'Fraudulent Investment Scheme',
      type: 'Criminal',
      difficulty: 'Advanced',
      description: 'A white-collar crime case involving financial fraud and investor deception.',
      estimatedDuration: '75-90 minutes',
      keyConcepts: ['Financial Crime', 'Fraud', 'Expert Analysis'],
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop'
    },
    {
      id: '6',
      title: 'Negligence in a Workplace Accident',
      type: 'Civil',
      difficulty: 'Intermediate',
      description: 'A workplace safety case involving employer negligence and worker injury.',
      estimatedDuration: '45-60 minutes',
      keyConcepts: ['Workplace Safety', 'Employer Liability', 'Compensation'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    }
  ];

  const categories = ['All', 'Criminal', 'Civil', 'Family'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCases = cases.filter(caseItem => {
    const categoryMatch = selectedCategory === 'All' || caseItem.type === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'All' || caseItem.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'status-success';
      case 'Intermediate': return 'status-warning';
      case 'Advanced': return 'status-error';
      default: return 'status-neutral';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Criminal': return 'text-primary-600';
      case 'Civil': return 'text-purple-600';
      case 'Family': return 'text-pink-600';
      default: return 'text-neutral-600';
    }
  };

  const handleCaseSelect = (caseId: string) => {
    navigate('/trial-setup', { state: { role: selectedRole, caseId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/select-role" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">JurySane</h1>
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-sm text-neutral-600">
                Role: <span className="font-semibold text-primary-600 capitalize">{selectedRole} Attorney</span>
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
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Select a Case
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Choose a case to begin your trial simulation. Each case offers a unique legal challenge and learning opportunity.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`btn btn-sm ${
                    selectedCategory === category ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`btn btn-sm ${
                    selectedDifficulty === difficulty ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="card cursor-pointer group hover:shadow-xl transition-all duration-300"
                onClick={() => handleCaseSelect(caseItem.id)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={caseItem.image}
                    alt={caseItem.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className={`status-badge ${getDifficultyColor(caseItem.difficulty)}`}>
                      {caseItem.difficulty}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white">
                      <p className="text-sm font-medium">Click to select this case</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${getTypeColor(caseItem.type)}`}>
                      {caseItem.type}
                    </span>
                    <span className="text-sm text-neutral-500">{caseItem.estimatedDuration}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {caseItem.title}
                  </h3>
                  
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                    {caseItem.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-neutral-700">Key Concepts:</h4>
                    <div className="flex flex-wrap gap-1">
                      {caseItem.keyConcepts.slice(0, 3).map((concept, index) => (
                        <span
                          key={index}
                          className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full"
                        >
                          {concept}
                        </span>
                      ))}
                      {caseItem.keyConcepts.length > 3 && (
                        <span className="text-xs text-neutral-500">
                          +{caseItem.keyConcepts.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredCases.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No cases found</h3>
              <p className="text-neutral-600">Try adjusting your filters to see more cases.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/select-role" className="btn btn-secondary btn-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Role Selection
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseSelectionPage;
