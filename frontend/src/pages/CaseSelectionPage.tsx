import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/design-system.css';
import { CaseService } from '../services/caseService';
import { Case } from '../types/trial';
import CasePreviewModal from '../components/modals/CasePreviewModal';

const CaseSelectionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedRole = location.state?.role || 'defense';
  
  const [allCases, setAllCases] = useState<Case[]>([]);
  const [displayedCases, setDisplayedCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewCase, setPreviewCase] = useState<Case | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const categories = ['All', ...CaseService.getCaseCategories()];

  // Consistent category detection (mirrors backend logic)
  const detectCategory = (caseItem: Case): string => {
    const text = `${caseItem.title} ${caseItem.description}`.toLowerCase();
    // Prefer cybercrime over property when "identity theft" or any cyber indicators are present
    if (text.includes('hacking') || text.includes('cyber') || text.includes('identity theft') || text.includes('chen')) {
      return 'cybercrime';
    }
    if (text.includes('burglary') || text.includes('theft') || text.includes('lopez')) {
      return 'property';
    }
    if (text.includes('embezzlement') || text.includes('fraud') || text.includes('thompson')) {
      return 'white-collar';
    }
    if (text.includes('assault') || text.includes('domestic') || text.includes('violence') || text.includes('rivera')) {
      return 'violent';
    }
    if (text.includes('drug') || text.includes('possession') || text.includes('harris')) {
      return 'drug';
    }
    return 'criminal';
  };

  // Load cases on component mount
  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedCases = await CaseService.getAllCases();
        setAllCases(loadedCases);
        setDisplayedCases(loadedCases);
      } catch (err) {
        setError('Failed to load cases. Please try again.');
        console.error('Error loading cases:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  // Debounced server-side filtering when search/category changes
  useEffect(() => {
    // If neither search nor category filter is applied, show all
    if ((searchQuery ?? '').trim() === '' && (selectedCategory === 'All')) {
      setDisplayedCases(allCases);
      return;
    }

    let isCancelled = false;
    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const hasSearch = (searchQuery ?? '').trim() !== '';
        const hasCategory = selectedCategory !== 'All';

        if (hasSearch && !hasCategory) {
          const searchResults = await CaseService.searchCases(searchQuery.trim());
          const sorted = [...searchResults].sort((a, b) => a.title.localeCompare(b.title));
          if (!isCancelled) setDisplayedCases(sorted);
        } else if (!hasSearch && hasCategory) {
          // Use local filtering for stability
          const localCategory = allCases.filter(c => detectCategory(c) === selectedCategory);
          const sorted = [...localCategory].sort((a, b) => a.title.localeCompare(b.title));
          if (!isCancelled) setDisplayedCases(sorted);
        } else if (hasSearch && hasCategory) {
          // Intersect server search with local category classification
          const searchResults = await CaseService.searchCases(searchQuery.trim());
          const intersected = searchResults.filter(c => detectCategory(c) === selectedCategory);
          const sorted = [...intersected].sort((a, b) => a.title.localeCompare(b.title));
          if (!isCancelled) setDisplayedCases(sorted);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error applying filters:', err);
          // Fall back to client-side filtering if server filter fails
          const queryLower = (searchQuery ?? '').toLowerCase();
          const local = allCases.filter(caseItem => {
            const categoryMatch = selectedCategory === 'All' || detectCategory(caseItem) === selectedCategory;
            const searchMatch = queryLower === '' ||
              caseItem.title.toLowerCase().includes(queryLower) ||
              caseItem.description.toLowerCase().includes(queryLower) ||
              caseItem.charges.some(charge => charge.toLowerCase().includes(queryLower));
            return categoryMatch && searchMatch;
          });
          const sorted = [...local].sort((a, b) => a.title.localeCompare(b.title));
          setDisplayedCases(sorted);
          setError('Some filters could not be applied via server. Showing best local results.');
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }, 300); // debounce

    return () => {
      isCancelled = true;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [searchQuery, selectedCategory, allCases]);

  // Initial alphabetical sort after first load
  useEffect(() => {
    if (allCases.length) {
      const sorted = [...allCases].sort((a, b) => a.title.localeCompare(b.title));
      setDisplayedCases(sorted);
    }
  }, [allCases]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'white-collar': return 'text-blue-600';
      case 'violent': return 'text-red-600';
      case 'drug': return 'text-orange-600';
      case 'property': return 'text-green-600';
      case 'cybercrime': return 'text-purple-600';
      default: return 'text-neutral-600';
    }
  };

  const getCaseCategory = (caseItem: Case): string => {
    if (caseItem.title.toLowerCase().includes('thompson')) return 'white-collar';
    if (caseItem.title.toLowerCase().includes('rivera')) return 'violent';
    if (caseItem.title.toLowerCase().includes('harris')) return 'drug';
    if (caseItem.title.toLowerCase().includes('lopez')) return 'property';
    if (caseItem.title.toLowerCase().includes('chen')) return 'cybercrime';
    return 'criminal';
  };

  const getDifficultyLevel = (caseItem: Case): string => {
    // Simple difficulty based on number of charges and evidence
    const complexity = caseItem.charges.length + caseItem.evidence.length;
    if (complexity <= 6) return 'Beginner';
    if (complexity <= 10) return 'Intermediate';
    return 'Advanced';
  };

  const handleCasePreview = (caseItem: Case) => {
    setPreviewCase(caseItem);
    setIsPreviewOpen(true);
  };

  const handleCaseSelect = (caseId: string) => {
    navigate('/trial-setup', { state: { role: selectedRole, caseId } });
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewCase(null);
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
          <div className="text-center mb-8 relative">
            {/* Back button top-left */}
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 top-0 btn btn-ghost"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
              Select a Case
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Choose a case to begin your trial simulation. Each case offers a unique legal challenge and learning opportunity.
            </p>
          </div>

          {/* Search, Filters and Sort */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`btn btn-sm ${
                    selectedCategory === category ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {category === 'All' ? 'All' : CaseService.getCategoryDisplayName(category)}
                </button>
              ))}
            </div>
            {/* Default alphabetical sort applied automatically; no explicit sort control */}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Loading cases...</h3>
              <p className="text-neutral-600">Please wait while we fetch the available cases.</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Error loading cases</h3>
              <p className="text-neutral-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Cases Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayedCases.map((caseItem) => {
                const category = getCaseCategory(caseItem);
                const difficulty = getDifficultyLevel(caseItem);
                
                return (
                  <div
                    key={caseItem.id}
                    className="card group hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-neutral-100 h-48 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                        <p className="text-sm text-neutral-600 font-medium">Legal Case</p>
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <span className={`status-badge ${
                          difficulty === 'Beginner' ? 'status-success' :
                          difficulty === 'Intermediate' ? 'status-warning' : 'status-error'
                        }`}>
                          {difficulty}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center">
                          <p className="text-sm font-medium mb-2">Preview or Select Case</p>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCasePreview(caseItem);
                              }}
                              className="btn btn-sm btn-white"
                            >
                              Preview
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCaseSelect(caseItem.id);
                              }}
                              className="btn btn-sm btn-primary"
                            >
                              Select
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${getCategoryColor(category)}`}>
                          {CaseService.getCategoryDisplayName(category)}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {caseItem.charges.length} charges
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                        {caseItem.title}
                      </h3>
                      
                      <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                        {caseItem.description}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-neutral-700">Charges:</h4>
                        <div className="flex flex-wrap gap-1">
                          {caseItem.charges.slice(0, 2).map((charge, index) => (
                            <span
                              key={index}
                              className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full"
                            >
                              {charge}
                            </span>
                          ))}
                          {caseItem.charges.length > 2 && (
                            <span className="text-xs text-neutral-500">
                              +{caseItem.charges.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && displayedCases.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No cases found</h3>
              <p className="text-neutral-600">Try adjusting your search or filters to see more cases.</p>
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

      {/* Case Preview Modal */}
      {previewCase && (
        <CasePreviewModal
          caseData={previewCase}
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          onSelect={handleCaseSelect}
        />
      )}
    </div>
  );
};

export default CaseSelectionPage;
