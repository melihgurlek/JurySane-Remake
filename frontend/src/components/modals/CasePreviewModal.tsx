import React from 'react';
import { Case } from '../../types/trial';
import { CaseService } from '../../services/caseService';

interface CasePreviewModalProps {
  caseData: Case;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (caseId: string) => void;
}

const CasePreviewModal: React.FC<CasePreviewModalProps> = ({
  caseData,
  isOpen,
  onClose,
  onSelect
}) => {
  if (!isOpen) return null;

  const getCaseCategory = (caseItem: Case): string => {
    if (caseItem.title.toLowerCase().includes('thompson')) return 'white-collar';
    if (caseItem.title.toLowerCase().includes('rivera')) return 'violent';
    if (caseItem.title.toLowerCase().includes('harris')) return 'drug';
    if (caseItem.title.toLowerCase().includes('lopez')) return 'property';
    if (caseItem.title.toLowerCase().includes('chen')) return 'cybercrime';
    return 'criminal';
  };

  const getDifficultyLevel = (caseItem: Case): string => {
    const complexity = caseItem.charges.length + caseItem.evidence.length;
    if (complexity <= 6) return 'Beginner';
    if (complexity <= 10) return 'Intermediate';
    return 'Advanced';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'white-collar': return 'text-blue-600 bg-blue-50';
      case 'violent': return 'text-red-600 bg-red-50';
      case 'drug': return 'text-orange-600 bg-orange-50';
      case 'property': return 'text-green-600 bg-green-50';
      case 'cybercrime': return 'text-purple-600 bg-purple-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const category = getCaseCategory(caseData);
  const difficulty = getDifficultyLevel(caseData);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{caseData.title}</h2>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
                    {CaseService.getCategoryDisplayName(category)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {difficulty}
                  </span>
                  <span className="text-sm opacity-90">
                    {caseData.charges.length} charges • {caseData.evidence.length} evidence items
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Case Description</h3>
              <p className="text-neutral-700 leading-relaxed">{caseData.description}</p>
            </div>

            {/* Charges */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Charges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {caseData.charges.map((charge, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <span className="text-red-700 font-medium">{charge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Case Facts */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Case Facts</h3>
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                  {caseData.case_facts}
                </p>
              </div>
            </div>

            {/* Prosecution vs Defense Theories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-3">Prosecution Theory</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 leading-relaxed">{caseData.prosecution_theory}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-3">Defense Theory</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-700 leading-relaxed">{caseData.defense_theory}</p>
                </div>
              </div>
            </div>

            {/* Evidence Preview */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Evidence ({caseData.evidence.length} items)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {caseData.evidence.slice(0, 4).map((evidence, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-neutral-900">{evidence.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        evidence.is_admitted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {evidence.is_admitted ? 'Admitted' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">{evidence.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500 capitalize">{evidence.evidence_type}</span>
                      <span className="text-xs text-neutral-500 capitalize">{evidence.submitted_by}</span>
                    </div>
                  </div>
                ))}
                {caseData.evidence.length > 4 && (
                  <div className="border border-neutral-200 rounded-lg p-3 flex items-center justify-center">
                    <span className="text-sm text-neutral-500">
                      +{caseData.evidence.length - 4} more evidence items
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Witnesses Preview */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Witnesses ({caseData.witnesses.length} people)</h3>
              <div className="space-y-3">
                {caseData.witnesses.slice(0, 3).map((witness, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-neutral-900">{witness.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        witness.called_by === 'prosecutor' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {witness.called_by}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">{witness.background}</p>
                    <p className="text-sm text-neutral-700">{witness.knowledge}</p>
                    {witness.bias && (
                      <p className="text-xs text-orange-600 mt-2">
                        <strong>Potential Bias:</strong> {witness.bias}
                      </p>
                    )}
                  </div>
                ))}
                {caseData.witnesses.length > 3 && (
                  <div className="border border-neutral-200 rounded-lg p-3 flex items-center justify-center">
                    <span className="text-sm text-neutral-500">
                      +{caseData.witnesses.length - 3} more witnesses
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Legal Precedents */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Legal Precedents</h3>
              <div className="bg-neutral-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {caseData.legal_precedents.map((precedent, index) => (
                    <li key={index} className="text-sm text-neutral-700 flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      {precedent}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-neutral-50 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-neutral-600">
              Ready to start this trial simulation?
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => onSelect(caseData.id)}
                className="btn btn-primary"
              >
                Select This Case
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasePreviewModal;
