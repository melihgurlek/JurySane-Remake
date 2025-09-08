"""Trial-related API routes."""

from typing import Dict, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from ...models.trial import Case, CaseRole, TrialPhase, TrialSession, UserRole, Verdict
from ...services.trial_service import TrialService
from ...data.case_store import get_shared_cases, get_case_by_id as get_case_by_id_from_store


router = APIRouter(prefix="/trial", tags=["trial"])

# Global trial service instance (singleton)
_trial_service = None


def get_trial_service() -> TrialService:
    """Get trial service instance (singleton)."""
    global _trial_service
    if _trial_service is None:
        _trial_service = TrialService()
    return _trial_service


def get_case_by_id(case_id: UUID) -> Case:
    """Get a case by its ID.

    Args:
        case_id: The case ID to look up

    Returns:
        The case with the given ID

    Raises:
        HTTPException: If case not found
    """
    try:
        return get_case_by_id_from_store(str(case_id))
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


# Request/Response models
class CreateTrialRequest(BaseModel):
    """Request to create a new trial."""
    case_id: UUID
    user_role: UserRole


class CreateTrialResponse(BaseModel):
    """Response from creating a trial."""
    session_id: UUID
    message: str


class AgentPromptRequest(BaseModel):
    """Request for agent to respond to a prompt."""
    prompt: str
    agent_role: CaseRole
    context: Optional[Dict] = Field(default_factory=dict)


class AgentResponse(BaseModel):
    """Response from an agent."""
    content: str
    speaker: str
    metadata: Dict


class AdvancePhaseRequest(BaseModel):
    """Request to advance trial phase."""
    next_phase: TrialPhase


class CompleteTrialRequest(BaseModel):
    """Request to complete trial with verdict."""
    verdict: Verdict


@router.post("/create", response_model=CreateTrialResponse)
async def create_trial(
    request: CreateTrialRequest,
    trial_service: TrialService = Depends(get_trial_service),
) -> CreateTrialResponse:
    """Create a new trial session.

    Args:
        request: Trial creation request
        trial_service: Trial service instance

    Returns:
        Trial creation response
    """
    try:
        # Get the case by ID
        case = get_case_by_id(request.case_id)

        session = await trial_service.create_trial_session(
            case=case,
            user_role=request.user_role,
        )

        return CreateTrialResponse(
            session_id=session.id,
            message=f"Trial session created successfully. You are playing the {request.user_role.value}.",
        )
    except HTTPException:
        # Re-raise HTTP exceptions (like 404 for case not found)
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create trial session: {str(e)}",
        ) from e


@router.get("/{session_id}", response_model=TrialSession)
async def get_trial_session(
    session_id: UUID,
    trial_service: TrialService = Depends(get_trial_service),
) -> TrialSession:
    """Get a trial session by ID.

    Args:
        session_id: Trial session ID
        trial_service: Trial service instance

    Returns:
        Trial session
    """
    session = await trial_service.get_trial_session(session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trial session {session_id} not found",
        )

    return session


@router.post("/{session_id}/agent-response", response_model=AgentResponse)
async def get_agent_response(
    session_id: UUID,
    request: AgentPromptRequest,
    trial_service: TrialService = Depends(get_trial_service),
) -> AgentResponse:
    """Get a response from an AI agent.

    Args:
        session_id: Trial session ID
        request: Agent prompt request
        trial_service: Trial service instance

    Returns:
        Agent response
    """
    try:
        content = await trial_service.get_agent_response(
            session_id=session_id,
            agent_role=request.agent_role,
            prompt=request.prompt,
            context=request.context,
        )

        return AgentResponse(
            content=content,
            speaker=request.agent_role.value.title(),
            metadata=request.context,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get agent response: {str(e)}",
        ) from e


@router.post("/{session_id}/advance-phase", response_model=TrialSession)
async def advance_trial_phase(
    session_id: UUID,
    request: AdvancePhaseRequest,
    trial_service: TrialService = Depends(get_trial_service),
) -> TrialSession:
    """Advance the trial to the next phase.

    Args:
        session_id: Trial session ID
        request: Phase advance request
        trial_service: Trial service instance

    Returns:
        Updated trial session
    """
    try:
        session = await trial_service.advance_trial_phase(
            session_id=session_id,
            next_phase=request.next_phase,
        )
        return session
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to advance trial phase: {str(e)}",
        ) from e


class AddTranscriptRequest(BaseModel):
    """Request to add transcript entry."""
    speaker: str
    content: str
    metadata: Optional[Dict] = None


@router.post("/{session_id}/transcript", response_model=TrialSession)
async def add_transcript_entry(
    session_id: UUID,
    request: AddTranscriptRequest,
    trial_service: TrialService = Depends(get_trial_service),
) -> TrialSession:
    """Add an entry to the trial transcript.

    Args:
        session_id: Trial session ID
        speaker: Who is speaking
        content: What was said
        metadata: Additional metadata
        trial_service: Trial service instance

    Returns:
        Updated trial session
    """
    try:
        session = await trial_service.add_transcript_entry(
            session_id=session_id,
            speaker=request.speaker,
            content=request.content,
            metadata=request.metadata,
        )
        return session
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add transcript entry: {str(e)}",
        ) from e


@router.post("/{session_id}/complete", response_model=TrialSession)
async def complete_trial(
    session_id: UUID,
    request: CompleteTrialRequest,
    trial_service: TrialService = Depends(get_trial_service),
) -> TrialSession:
    """Complete the trial with a verdict.

    Args:
        session_id: Trial session ID
        request: Trial completion request
        trial_service: Trial service instance

    Returns:
        Completed trial session
    """
    try:
        session = await trial_service.complete_trial(
            session_id=session_id,
            verdict=request.verdict,
        )
        return session
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to complete trial: {str(e)}",
        ) from e


@router.get("/{session_id}/transcript", response_model=List[Dict])
async def get_trial_transcript(
    session_id: UUID,
    trial_service: TrialService = Depends(get_trial_service),
) -> List[Dict]:
    """Get the trial transcript.

    Args:
        session_id: Trial session ID
        trial_service: Trial service instance

    Returns:
        Trial transcript
    """
    session = await trial_service.get_trial_session(session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trial session {session_id} not found",
        )

    return session.transcript


# Evidence Management
class SubmitEvidenceRequest(BaseModel):
    """Request to submit evidence."""
    evidence_id: str
    submitted_by: str
    description: str


class RuleOnEvidenceRequest(BaseModel):
    """Request to rule on evidence."""
    evidence_id: str
    ruling: str  # "admitted" or "rejected"
    reason: str


@router.post("/{session_id}/evidence/submit", response_model=TrialSession)
async def submit_evidence(
    session_id: UUID,
    request: SubmitEvidenceRequest,
    trial_service: TrialService = Depends(get_trial_service),
) -> TrialSession:
    """Submit evidence for admission.

    Args:
        session_id: Trial session ID
        request: Evidence submission request
        trial_service: Trial service instance

    Returns:
        Updated trial session
    """
    try:
        session = await trial_service.submit_evidence(
            session_id=session_id,
            evidence_id=request.evidence_id,
            submitted_by=request.submitted_by,
            description=request.description,
        )
        return session
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit evidence: {str(e)}",
        ) from e


@router.post("/{session_id}/evidence/rule", response_model=TrialSession)
async def rule_on_evidence(
    session_id: UUID,
    request: RuleOnEvidenceRequest,
    trial_service: TrialService = Depends(get_trial_service),
) -> TrialSession:
    """Judge rules on evidence admission.

    Args:
        session_id: Trial session ID
        request: Evidence ruling request
        trial_service: Trial service instance

    Returns:
        Updated trial session
    """
    try:
        session = await trial_service.rule_on_evidence(
            session_id=session_id,
            evidence_id=request.evidence_id,
            ruling=request.ruling,
            reason=request.reason,
        )
        return session
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to rule on evidence: {str(e)}",
        ) from e


# Objection Management
class RaiseObjectionRequest(BaseModel):
    """Request to raise an objection."""
    objection_type: str
    reason: str
    raised_by: str


class RuleOnObjectionRequest(BaseModel):
    """Request to rule on an objection."""
    objection_id: str
    ruling: str  # "sustained" or "overruled"
    reason: str


@router.post("/{session_id}/objection/raise", response_model=TrialSession)
async def raise_objection(
    session_id: UUID,
    request: RaiseObjectionRequest,
    trial_service: TrialService = Depends(get_trial_service),
) -> TrialSession:
    """Raise an objection during trial.

    Args:
        session_id: Trial session ID
        request: Objection request
        trial_service: Trial service instance

    Returns:
        Updated trial session
    """
    try:
        session = await trial_service.raise_objection(
            session_id=session_id,
            objection_type=request.objection_type,
            reason=request.reason,
            raised_by=request.raised_by,
        )
        return session
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to raise objection: {str(e)}",
        ) from e


@router.post("/{session_id}/objection/rule", response_model=TrialSession)
async def rule_on_objection(
    session_id: UUID,
    request: RuleOnObjectionRequest,
    trial_service: TrialService = Depends(get_trial_service),
) -> TrialSession:
    """Judge rules on an objection.

    Args:
        session_id: Trial session ID
        request: Objection ruling request
        trial_service: Trial service instance

    Returns:
        Updated trial session
    """
    try:
        session = await trial_service.rule_on_objection(
            session_id=session_id,
            objection_id=request.objection_id,
            ruling=request.ruling,
            reason=request.reason,
        )
        return session
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to rule on objection: {str(e)}",
        ) from e
