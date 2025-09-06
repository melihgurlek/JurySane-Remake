import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/design-system.css';

interface Evidence {
  id: string;
  title: string;
  type: string;
  description: string;
  status: 'Admitted' | 'Rejected' | 'Pending';
  relevance: 'High' | 'Medium' | 'Low';
  objections: number;
  image: string;
}

const EvidenceManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const evidence: Evidence[] = [
    {
      id: '1',
      title: 'Exhibit A: Crime Scene Photos',
      type: 'Photographic Evidence',
      description: 'High-resolution photographs of the crime scene showing the location and physical evidence',
      status: 'Admitted',
      relevance: 'High',
      objections: 2,
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      title: 'Exhibit B: Witness Statement',
      type: 'Documentary Evidence',
      description: 'Signed statement from key witness describing the events as they observed them',
      status: 'Admitted',
      relevance: 'High',
      objections: 1,
      image: 'https://images.unsplash.com/photo-1450101499163-8841dcb4ac2e?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      title: 'Exhibit C: Forensic Report',
      type: 'Expert Evidence',
      description: 'Detailed forensic analysis report from the crime laboratory',
      status: 'Pending',
      relevance: 'High',
      objections: 3,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
    },
    {
      id: '4',
      title: 'Exhibit D: Security Footage',
      type: 'Video Evidence',
      description: 'Surveillance camera footage from the establishment showing the incident',
      status: 'Admitted',
      relevance: 'High',
      objections: 0,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'
    },
    {
      id: '5',
      title: 'Exhibit E: Financial Records',
      type: 'Documentary Evidence',
      description: 'Bank statements and financial records relevant to the case',
      status: 'Rejected',
      relevance: 'Medium',
      objections: 5,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop'
    },
    {
      id: '6',
      title: 'Exhibit F: Expert Testimony',
      type: 'Expert Evidence',
      description: 'Written testimony from a qualified expert witness',
      status: 'Pending',
      relevance: 'Medium',
      objections: 2,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    }
  ];

  const tabs = [
    { id: 'All', label: 'All Evidence', count: evidence.length },
    { id: 'Admitted', label: 'Admitted', count: evidence.filter(e => e.status === 'Admitted').length },
    { id: 'Rejected', label: 'Rejected', count: evidence.filter(e => e.status === 'Rejected').length },
    { id: 'Pending', label: 'Pending', count: evidence.filter(e => e.status === 'Pending').length }
  ];

  const filteredEvidence = evidence.filter(item => {
    const matchesTab = activeTab === 'All' || item.status === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Admitted': return 'status-success';
      case 'Rejected': return 'status-error';
      case 'Pending': return 'status-warning';
      default: return 'status-neutral';
    }
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/trial" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">JurySane</h1>
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-sm text-neutral-600">
                Case: <span className="font-semibold text-primary-600">The People vs. Alex Turner</span>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Evidence Management</h1>
              <p className="text-neutral-600">Review and manage all evidence related to the trial simulation.</p>
            </div>
            <button className="btn btn-primary mt-4 sm:mt-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Evidence
            </button>
          </div>

          {/* Search and Filters */}
          <div className="card mb-8">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search evidence..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-input pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select className="form-input">
                    <option>All Types</option>
                    <option>Photographic Evidence</option>
                    <option>Documentary Evidence</option>
                    <option>Expert Evidence</option>
                    <option>Video Evidence</option>
                  </select>
                  <select className="form-input">
                    <option>All Relevance</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral-200 mb-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-neutral-100 text-neutral-600 py-1 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Evidence Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredEvidence.map((item) => (
              <div key={item.id} className="card group hover:shadow-lg transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`status-badge ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className={`status-badge ${getRelevanceColor(item.relevance)}`}>
                      {item.relevance}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <div className="text-white">
                      <p className="text-xs font-medium">Click to view details</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span className="font-medium">{item.type}</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>{item.objections} objections</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredEvidence.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No evidence found</h3>
              <p className="text-neutral-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}

          {/* Objections Timeline */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold text-neutral-900">Objections Timeline</h2>
            </div>
            <div className="card-body">
              <div className="relative pl-6 border-l-2 border-neutral-200">
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute w-4 h-4 bg-primary-600 rounded-full -left-2 top-1"></div>
                    <div className="ml-4">
                      <p className="font-semibold text-neutral-900">Objection to Exhibit A</p>
                      <p className="text-sm text-neutral-500">10:15 AM - Relevance</p>
                      <p className="text-sm text-neutral-600 mt-1">"Your Honor, this evidence is not relevant to the charges at hand."</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute w-4 h-4 bg-primary-600 rounded-full -left-2 top-1"></div>
                    <div className="ml-4">
                      <p className="font-semibold text-neutral-900">Objection to Exhibit C</p>
                      <p className="text-sm text-neutral-500">11:30 AM - Hearsay</p>
                      <p className="text-sm text-neutral-600 mt-1">"This report contains hearsay statements that should not be admitted."</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute w-4 h-4 bg-primary-600 rounded-full -left-2 top-1"></div>
                    <div className="ml-4">
                      <p className="font-semibold text-neutral-900">Objection to Exhibit E</p>
                      <p className="text-sm text-neutral-500">2:45 PM - Foundation</p>
                      <p className="text-sm text-neutral-600 mt-1">"The prosecution has not established proper foundation for this evidence."</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EvidenceManagementPage;
