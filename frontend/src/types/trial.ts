// Trial-related TypeScript types matching the backend models

export enum UserRole {
  DEFENSE = 'defense',
  PROSECUTOR = 'prosecutor',
}

export enum CaseRole {
  DEFENSE = 'defense',
  PROSECUTOR = 'prosecutor',
  JUDGE = 'judge',
  JURY = 'jury',
  WITNESS = 'witness',
}

export enum TrialPhase {
  SETUP = 'setup',
  OPENING_STATEMENTS = 'opening_statements',
  WITNESS_EXAMINATION = 'witness_examination',
  CLOSING_ARGUMENTS = 'closing_arguments',
  JURY_DELIBERATION = 'jury_deliberation',
  VERDICT = 'verdict',
  COMPLETED = 'completed',
}

export enum ObjectionType {
  HEARSAY = 'hearsay',
  LEADING = 'leading',
  RELEVANCE = 'relevance',
  SPECULATION = 'speculation',
  ARGUMENTATIVE = 'argumentative',
  ASKED_AND_ANSWERED = 'asked_and_answered',
  COMPOUND = 'compound',
  ASSUMES_FACTS = 'assumes_facts',
}

export interface Participant {
  id: string;
  name: string;
  role: CaseRole;
  is_ai: boolean;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface Evidence {
  id: string;
  title: string;
  description: string;
  content: string;
  evidence_type: string;
  submitted_by: CaseRole;
  is_admitted: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Witness {
  id: string;
  name: string;
  background: string;
  knowledge: string;
  bias?: string;
  called_by: CaseRole;
  created_at: string;
  updated_at?: string;
}

export interface WitnessTestimony {
  id: string;
  witness_id: string;
  phase: string;
  examiner: CaseRole;
  question: string;
  answer: string;
  objections: string[];
  created_at: string;
  updated_at?: string;
}

export interface Objection {
  id: string;
  objection_type: ObjectionType;
  raised_by: CaseRole;
  reason: string;
  ruling?: string;
  context: string;
  created_at: string;
  updated_at?: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  charges: string[];
  case_facts: string;
  prosecution_theory: string;
  defense_theory: string;
  evidence: Evidence[];
  witnesses: Witness[];
  legal_precedents: string[];
  created_at: string;
  updated_at?: string;
}

export interface Verdict {
  id: string;
  verdict: string;
  reasoning: string;
  vote_breakdown?: Record<string, number>;
  created_at: string;
  updated_at?: string;
}

export interface TranscriptEntry {
  speaker: string;
  content: string;
  timestamp: string;
  phase: string;
  metadata: Record<string, any>;
}

export interface TrialSession {
  id: string;
  case_id: string;
  user_role: UserRole;
  current_phase: TrialPhase;
  participants: Participant[];
  transcript: TranscriptEntry[];
  evidence_admitted: string[];
  objections: Objection[];
  verdict?: Verdict;
  started_at: string;
  completed_at?: string;
  created_at: string;
  updated_at?: string;
}

// API Request/Response types
export interface CreateTrialRequest {
  case: Case;
  user_role: UserRole;
}

export interface CreateTrialResponse {
  session_id: string;
  message: string;
}

export interface AgentPromptRequest {
  prompt: string;
  agent_role: CaseRole;
  context?: Record<string, any>;
}

export interface AgentResponse {
  content: string;
  speaker: string;
  metadata: Record<string, any>;
}

export interface AdvancePhaseRequest {
  next_phase: TrialPhase;
}

export interface CompleteTrialRequest {
  verdict: Verdict;
}
