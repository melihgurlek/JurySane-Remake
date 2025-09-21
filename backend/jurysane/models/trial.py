"""Trial-related data models."""

from datetime import datetime
from enum import Enum
from typing import Any, Optional
from uuid import UUID, uuid4

from pydantic import Field

from .base import BaseModel


class UserRole(str, Enum):
    """User role in the trial."""
    DEFENSE = "defense"
    PROSECUTOR = "prosecutor"


class CaseRole(str, Enum):
    """All possible roles in a trial."""
    DEFENSE = "defense"
    PROSECUTOR = "prosecutor"
    JUDGE = "judge"
    JURY = "jury"
    WITNESS = "witness"


class TrialPhase(str, Enum):
    """Phases of a trial."""
    SETUP = "setup"
    OPENING_STATEMENTS = "opening_statements"
    WITNESS_EXAMINATION = "witness_examination"
    CLOSING_ARGUMENTS = "closing_arguments"
    JURY_DELIBERATION = "jury_deliberation"
    VERDICT = "verdict"
    COMPLETED = "completed"


class ObjectionType(str, Enum):
    """Types of legal objections."""
    HEARSAY = "hearsay"
    LEADING = "leading"
    RELEVANCE = "relevance"
    SPECULATION = "speculation"
    ARGUMENTATIVE = "argumentative"
    ASKED_AND_ANSWERED = "asked_and_answered"
    COMPOUND = "compound"
    ASSUMES_FACTS = "assumes_facts"


class Participant(BaseModel):
    """A participant in the trial."""
    name: str = Field(description="Name of the participant")
    role: CaseRole = Field(description="Role in the trial")
    is_ai: bool = Field(
        description="Whether this participant is AI-controlled")
    description: Optional[str] = Field(
        default=None, description="Description of the participant")


class Evidence(BaseModel):
    """A piece of evidence in the trial."""
    title: str = Field(description="Title of the evidence")
    description: str = Field(description="Description of the evidence")
    content: str = Field(description="Content of the evidence")
    evidence_type: str = Field(
        description="Type of evidence (document, photo, testimony, etc.)")
    submitted_by: CaseRole = Field(description="Who submitted this evidence")
    is_admitted: bool = Field(
        default=False, description="Whether evidence is admitted")


class Witness(BaseModel):
    """A witness in the trial."""
    name: str = Field(description="Name of the witness")
    background: str = Field(
        description="Background information about the witness")
    knowledge: str = Field(description="What the witness knows about the case")
    bias: Optional[str] = Field(default=None, description="Any potential bias")
    called_by: CaseRole = Field(description="Which side called this witness")


class WitnessTestimony(BaseModel):
    """Testimony given by a witness."""
    witness_id: UUID = Field(description="ID of the witness giving testimony")
    phase: str = Field(description="Direct or cross examination")
    examiner: CaseRole = Field(description="Who is examining the witness")
    question: str = Field(description="Question asked")
    answer: str = Field(description="Witness's answer")
    objections: list[str] = Field(
        default_factory=list, description="Any objections raised")


class Objection(BaseModel):
    """An objection raised during the trial."""
    objection_type: ObjectionType = Field(description="Type of objection")
    raised_by: CaseRole = Field(description="Who raised the objection")
    reason: str = Field(description="Reason for the objection")
    ruling: Optional[str] = Field(
        default=None, description="Judge's ruling (sustained/overruled)")
    context: str = Field(description="Context where objection was raised")


class Case(BaseModel):
    """A legal case for simulation."""
    id: UUID = Field(default_factory=uuid4, description="Unique case ID")
    title: str = Field(description="Title of the case")
    description: str = Field(description="Description of the case")
    charges: list[str] = Field(description="Criminal charges")
    case_facts: str = Field(description="Facts of the case")
    prosecution_theory: str = Field(
        description="Prosecution's theory of the case")
    defense_theory: str = Field(description="Defense theory of the case")
    evidence: list[Evidence] = Field(
        default_factory=list, description="Evidence in the case")
    witnesses: list[Witness] = Field(
        default_factory=list, description="Witnesses in the case")
    legal_precedents: list[str] = Field(
        default_factory=list, description="Relevant legal precedents")


class Verdict(BaseModel):
    """Jury verdict."""
    verdict: str = Field(description="Guilty or Not Guilty")
    reasoning: str = Field(description="Jury's reasoning for the verdict")
    vote_breakdown: Optional[dict[str, int]] = Field(
        default=None, description="Vote breakdown if available")


class TrialSession(BaseModel):
    """A complete trial session."""
    id: UUID = Field(description="Unique session ID")
    case_id: UUID = Field(description="ID of the case being tried")
    user_role: UserRole = Field(description="Role chosen by the user")
    current_phase: TrialPhase = Field(
        default=TrialPhase.SETUP, description="Current phase of the trial")
    participants: list[Participant] = Field(
        default_factory=list, description="All participants")
    transcript: list[dict[str, Any]] = Field(
        default_factory=list, description="Trial transcript")
    evidence_admitted: list[UUID] = Field(
        default_factory=list, description="IDs of admitted evidence")
    objections: list[Objection] = Field(
        default_factory=list, description="Objections raised")
    verdict: Optional[Verdict] = Field(
        default=None, description="Final verdict if reached")
    started_at: datetime = Field(
        default_factory=datetime.utcnow, description="Trial start time")
    completed_at: Optional[datetime] = Field(
        default=None, description="Trial completion time")
    case_data: Optional[Case] = Field(
        default=None, description="Case data for agent context")
    # Turn management fields
    current_turn: Optional[CaseRole] = Field(
        default=None, description="Who should speak next")
    turn_count: int = Field(
        default=0, description="Number of turns taken")
    last_speaker: Optional[CaseRole] = Field(
        default=None, description="Who spoke last")
    awaiting_response: bool = Field(
        default=False, description="Whether system is waiting for a response")
