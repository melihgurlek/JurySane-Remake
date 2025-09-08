import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { TrialSession, Evidence } from '@/types/trial';
import { trialApi } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';

interface EvidenceManagerProps {
  session: TrialSession;
  caseEvidence: Evidence[];
  onEvidenceChange: () => void;
}

interface EvidenceSubmission {
  evidenceId: string;
  description: string;
  submittedBy: string;
  status: 'pending' | 'admitted' | 'rejected';
  ruling?: string;
}

const EvidenceManager = ({ session, caseEvidence, onEvidenceChange }: EvidenceManagerProps) => {
  const [submissions, setSubmissions] = useState<EvidenceSubmission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [submissionDescription, setSubmissionDescription] = useState('');

  const submitEvidence = async (evidence: Evidence) => {
    if (!submissionDescription.trim()) {
      toast.error('Please provide a description for the evidence');
      return;
    }

    try {
      setIsSubmitting(true);
      const submittedBy = session.user_role === 'defense' ? 'Defense Attorney' : 'Prosecutor';
      
      await trialApi.submitEvidence(
        session.id,
        evidence.id,
        submittedBy,
        submissionDescription.trim()
      );

      // Add to local submissions
      const newSubmission: EvidenceSubmission = {
        evidenceId: evidence.id,
        description: submissionDescription.trim(),
        submittedBy,
        status: 'pending',
      };
      setSubmissions([newSubmission, ...submissions]);
      setSubmissionDescription('');
      setSelectedEvidence(null);
      onEvidenceChange();
      toast.success('Evidence submitted for admission');
    } catch (error: any) {
      console.error('Failed to submit evidence:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit evidence');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEvidenceStatus = (evidenceId: string) => {
    const submission = submissions.find(s => s.evidenceId === evidenceId);
    if (submission) {
      return submission.status;
    }
    if (session.evidence_admitted.includes(evidenceId)) {
      return 'admitted';
    }
    return 'not_submitted';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'admitted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'admitted':
        return 'Admitted';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending Review';
      default:
        return 'Not Submitted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'admitted':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="evidence-manager">
      <div className="evidence-manager-header">
        <h3 className="evidence-manager-title">
          <FileText className="evidence-manager-icon" />
          Evidence Locker
        </h3>
        <p className="evidence-manager-subtitle">
          Submit evidence for admission to the court
        </p>
      </div>

      <div className="evidence-manager-content">
        {/* Evidence List */}
        <div className="evidence-list">
          {caseEvidence.length === 0 ? (
            <div className="evidence-empty">
              <FileText className="evidence-empty-icon" />
              <h4>No Evidence Available</h4>
              <p>This case has no evidence items to submit.</p>
            </div>
          ) : (
            <div className="evidence-grid">
              {caseEvidence.map((evidence) => {
                const status = getEvidenceStatus(evidence.id);
                const submission = submissions.find(s => s.evidenceId === evidence.id);

                return (
                  <div
                    key={evidence.id}
                    className={cn(
                      'evidence-item',
                      `evidence-item-${status}`,
                      selectedEvidence?.id === evidence.id && 'evidence-item-selected'
                    )}
                    onClick={() => setSelectedEvidence(evidence)}
                  >
                    <div className="evidence-item-header">
                      <div className="evidence-item-icon">
                        {getStatusIcon(status)}
                      </div>
                      <div className="evidence-item-status">
                        <span className={cn(
                          'evidence-status-badge',
                          getStatusColor(status)
                        )}>
                          {getStatusText(status)}
                        </span>
                      </div>
                    </div>

                    <div className="evidence-item-content">
                      <h4 className="evidence-item-title">
                        {evidence.title}
                      </h4>
                      <p className="evidence-item-description">
                        {evidence.description}
                      </p>
                      <div className="evidence-item-meta">
                        <span className="evidence-item-type">
                          {evidence.type}
                        </span>
                        {submission && (
                          <span className="evidence-item-submitted-by">
                            Submitted by: {submission.submittedBy}
                          </span>
                        )}
                      </div>
                    </div>

                    {status === 'not_submitted' && (
                      <div className="evidence-item-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvidence(evidence);
                            setSubmissionDescription('');
                          }}
                          className="evidence-submit-button"
                        >
                          <Upload className="h-4 w-4" />
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Evidence Submission Modal */}
        {selectedEvidence && (
          <div className="evidence-submission-modal">
            <div className="evidence-submission-content">
              <div className="evidence-submission-header">
                <h4 className="evidence-submission-title">
                  Submit Evidence for Admission
                </h4>
                <button
                  onClick={() => {
                    setSelectedEvidence(null);
                    setSubmissionDescription('');
                  }}
                  className="evidence-submission-close"
                >
                  ×
                </button>
              </div>

              <div className="evidence-submission-body">
                <div className="evidence-submission-evidence">
                  <h5 className="evidence-submission-evidence-title">
                    {selectedEvidence.title}
                  </h5>
                  <p className="evidence-submission-evidence-description">
                    {selectedEvidence.description}
                  </p>
                  <span className="evidence-submission-evidence-type">
                    Type: {selectedEvidence.type}
                  </span>
                </div>

                <div className="evidence-submission-form">
                  <label className="evidence-submission-label">
                    Description for the Court
                  </label>
                  <textarea
                    value={submissionDescription}
                    onChange={(e) => setSubmissionDescription(e.target.value)}
                    className="evidence-submission-textarea"
                    placeholder="Explain why this evidence should be admitted and how it relates to the case..."
                    rows={4}
                  />
                  <p className="evidence-submission-hint">
                    Provide a clear explanation of the evidence's relevance and authenticity.
                  </p>
                </div>
              </div>

              <div className="evidence-submission-footer">
                <button
                  onClick={() => {
                    setSelectedEvidence(null);
                    setSubmissionDescription('');
                  }}
                  className="evidence-submission-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={() => submitEvidence(selectedEvidence)}
                  disabled={!submissionDescription.trim() || isSubmitting}
                  className="evidence-submission-submit"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Submit for Admission
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvidenceManager;
