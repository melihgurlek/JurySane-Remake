"""Service for managing trial sessions and agent interactions."""

from typing import Dict, List, Optional, Union
from uuid import UUID, uuid4

from ..agents import DefenseAgent, JudgeAgent, JuryAgent, ProsecutorAgent, WitnessAgent
from ..models.trial import (
    Case,
    CaseRole,
    Participant,
    TrialPhase,
    TrialSession,
    UserRole,
    Verdict,
    Witness,
)


class TrialService:
    """Service for managing trial sessions."""

    def __init__(self):
        """Initialize the trial service."""
        self.active_sessions: Dict[UUID, TrialSession] = {}
        self.cases: Dict[UUID, Case] = {}

    async def create_trial_session(
        self,
        case: Case,
        user_role: UserRole,
    ) -> TrialSession:
        """Create a new trial session.

        Args:
            case: The case to try
            user_role: Role chosen by the user

        Returns:
            New trial session
        """
        session_id = uuid4()

        # Create participants
        participants = [
            Participant(
                name="User",
                role=CaseRole.DEFENSE if user_role == UserRole.DEFENSE else CaseRole.PROSECUTOR,
                is_ai=False,
            ),
            Participant(
                name="Judge",
                role=CaseRole.JUDGE,
                is_ai=True,
                description="Presiding judge for the trial",
            ),
            Participant(
                name="Jury",
                role=CaseRole.JURY,
                is_ai=True,
                description="12-person jury",
            ),
        ]

        # Add opposing counsel
        if user_role == UserRole.DEFENSE:
            participants.append(
                Participant(
                    name="Prosecutor",
                    role=CaseRole.PROSECUTOR,
                    is_ai=True,
                    description="State prosecutor",
                )
            )
        else:
            participants.append(
                Participant(
                    name="Defense Attorney",
                    role=CaseRole.DEFENSE,
                    is_ai=True,
                    description="Defense counsel",
                )
            )

        # Add witnesses as participants
        for witness in case.witnesses:
            participants.append(
                Participant(
                    name=witness.name,
                    role=CaseRole.WITNESS,
                    is_ai=True,
                    description=f"Witness: {witness.background[:100]}...",
                )
            )

        # Create trial session
        trial_session = TrialSession(
            id=session_id,
            case_id=case.id,
            user_role=user_role,
            current_phase=TrialPhase.SETUP,
            participants=participants,
        )

        # Store session and case
        self.active_sessions[session_id] = trial_session
        self.cases[case.id] = case

        return trial_session

    async def get_trial_session(self, session_id: UUID) -> Optional[TrialSession]:
        """Get a trial session by ID.

        Args:
            session_id: Session ID

        Returns:
            Trial session if found
        """
        return self.active_sessions.get(session_id)

    async def get_case(self, case_id: UUID) -> Optional[Case]:
        """Get a case by ID.

        Args:
            case_id: Case ID

        Returns:
            Case if found
        """
        return self.cases.get(case_id)

    async def advance_trial_phase(
        self,
        session_id: UUID,
        next_phase: TrialPhase,
    ) -> TrialSession:
        """Advance the trial to the next phase.

        Args:
            session_id: Session ID
            next_phase: Next phase to advance to

        Returns:
            Updated trial session

        Raises:
            ValueError: If session not found
        """
        session = self.active_sessions.get(session_id)
        if not session:
            raise ValueError(f"Trial session {session_id} not found")

        # Validate phase transition
        current_phase = session.current_phase
        if not self._is_valid_phase_transition(current_phase, next_phase):
            current_str = current_phase.value if hasattr(
                current_phase, 'value') else current_phase
            next_str = next_phase.value if hasattr(
                next_phase, 'value') else next_phase
            raise ValueError(
                f"Invalid phase transition from {current_str} to {next_str}")

        # Add phase transition to transcript
        current_str = current_phase.value if hasattr(
            current_phase, 'value') else current_phase
        next_str = next_phase.value if hasattr(
            next_phase, 'value') else next_phase
        await self.add_transcript_entry(
            session_id,
            "Court Clerk",
            f"Trial phase advanced from {current_str.replace('_', ' ').title()} to {next_str.replace('_', ' ').title()}",
            {"phase_transition": True, "from_phase": current_str, "to_phase": next_str}
        )

        session.current_phase = next_phase
        return session

    def _is_valid_phase_transition(self, current: TrialPhase, next_phase: TrialPhase) -> bool:
        """Check if a phase transition is valid.

        Args:
            current: Current trial phase
            next_phase: Proposed next phase

        Returns:
            True if transition is valid
        """
        # Define valid phase transitions
        valid_transitions = {
            TrialPhase.SETUP: [TrialPhase.OPENING_STATEMENTS],
            TrialPhase.OPENING_STATEMENTS: [TrialPhase.WITNESS_EXAMINATION],
            TrialPhase.WITNESS_EXAMINATION: [TrialPhase.CLOSING_ARGUMENTS],
            TrialPhase.CLOSING_ARGUMENTS: [TrialPhase.JURY_DELIBERATION],
            TrialPhase.JURY_DELIBERATION: [TrialPhase.VERDICT],
            TrialPhase.VERDICT: [TrialPhase.COMPLETED],
            TrialPhase.COMPLETED: []  # No further transitions from completed
        }

        return next_phase in valid_transitions.get(current, [])

    async def add_transcript_entry(
        self,
        session_id: UUID,
        speaker: str,
        content: str,
        metadata: Optional[Dict] = None,
    ) -> TrialSession:
        """Add an entry to the trial transcript.

        Args:
            session_id: Session ID
            speaker: Who is speaking
            content: What was said
            metadata: Additional metadata

        Returns:
            Updated trial session

        Raises:
            ValueError: If session not found
        """
        session = self.active_sessions.get(session_id)
        if not session:
            raise ValueError(f"Trial session {session_id} not found")

        transcript_entry = {
            "speaker": speaker,
            "content": content,
            "timestamp": "",  # Will be set by the model
            "phase": session.current_phase.value if hasattr(session.current_phase, 'value') else session.current_phase,
            "metadata": metadata or {},
        }

        session.transcript.append(transcript_entry)
        print(f"Added transcript entry: {transcript_entry}")
        print(f"Session transcript length: {len(session.transcript)}")
        return session

    def _create_judge_agent(self) -> JudgeAgent:
        """Create a judge agent."""
        return JudgeAgent()

    def _create_prosecutor_agent(self) -> ProsecutorAgent:
        """Create a prosecutor agent."""
        return ProsecutorAgent()

    def _create_defense_agent(self) -> DefenseAgent:
        """Create a defense agent."""
        return DefenseAgent()

    def _create_jury_agent(self) -> JuryAgent:
        """Create a jury agent."""
        return JuryAgent()

    def _create_witness_agent(self, witness: Witness) -> WitnessAgent:
        """Create a witness agent.

        Args:
            witness: Witness data

        Returns:
            Witness agent
        """
        witness_data = {
            "name": witness.name,
            "background": witness.background,
            "knowledge": witness.knowledge,
            "bias": witness.bias,
            "personality": "cooperative",  # Default personality
        }
        return WitnessAgent(witness_data)

    async def get_agent_response(
        self,
        session_id: UUID,
        agent_role: Union[CaseRole, str],
        prompt: str,
        context: Optional[Dict] = None,
    ) -> str:
        """Get a response from a specific agent.

        Args:
            session_id: Session ID
            agent_role: Role of the agent to respond
            prompt: Prompt for the agent
            context: Additional context

        Returns:
            Agent's response

        Raises:
            ValueError: If session not found or invalid agent role
        """
        # Convert string to CaseRole enum if needed
        if isinstance(agent_role, str):
            try:
                agent_role = CaseRole(agent_role.lower())
            except ValueError:
                raise ValueError(f"Invalid agent role: {agent_role}")

        session = self.active_sessions.get(session_id)
        if not session:
            raise ValueError(f"Trial session {session_id} not found")

        # Get case data and attach to session for context
        case = await self.get_case(session.case_id)
        if case:
            # Add case data to session for agent context
            session.case_data = case

        # Create appropriate agent
        if agent_role == CaseRole.JUDGE:
            agent = self._create_judge_agent()
        elif agent_role == CaseRole.PROSECUTOR:
            agent = self._create_prosecutor_agent()
        elif agent_role == CaseRole.DEFENSE:
            agent = self._create_defense_agent()
        elif agent_role == CaseRole.JURY:
            agent = self._create_jury_agent()
        elif agent_role == CaseRole.WITNESS:
            # For witness, we need to get the specific witness data
            witness_name = context.get("witness_name") if context else None
            if not witness_name:
                raise ValueError("Witness name required for witness agent")

            if not case:
                raise ValueError(f"Case {session.case_id} not found")

            witness = next(
                (w for w in case.witnesses if w.name == witness_name), None)
            if not witness:
                raise ValueError(f"Witness {witness_name} not found")

            agent = self._create_witness_agent(witness)
        else:
            raise ValueError(f"Invalid agent role: {agent_role}")

        # Get response from agent
        response = await agent.respond(prompt, session, context)

        # Add to transcript
        agent_name = agent_role.value.title() if hasattr(
            agent_role, 'value') else agent_role.title()
        await self.add_transcript_entry(
            session_id,
            agent_name,
            response.content,
            {"confidence": response.confidence, "metadata": response.metadata},
        )

        return response.content

    async def submit_evidence(
        self,
        session_id: UUID,
        evidence_id: str,
        submitted_by: str,
        description: str,
    ) -> TrialSession:
        """Submit evidence for admission.

        Args:
            session_id: Session ID
            evidence_id: ID of the evidence being submitted
            submitted_by: Who is submitting the evidence
            description: Description of the evidence

        Returns:
            Updated trial session

        Raises:
            ValueError: If session not found
        """
        session = self.active_sessions.get(session_id)
        if not session:
            raise ValueError(f"Trial session {session_id} not found")

        # Add evidence submission to transcript
        await self.add_transcript_entry(
            session_id,
            submitted_by,
            f"Your Honor, I would like to submit evidence for admission: {description}",
            {"evidence_submission": True, "evidence_id": evidence_id,
                "submitted_by": submitted_by}
        )

        return session

    async def rule_on_evidence(
        self,
        session_id: UUID,
        evidence_id: str,
        ruling: str,
        reason: str,
    ) -> TrialSession:
        """Judge rules on evidence admission.

        Args:
            session_id: Session ID
            evidence_id: ID of the evidence
            ruling: "admitted" or "rejected"
            reason: Reason for the ruling

        Returns:
            Updated trial session

        Raises:
            ValueError: If session not found
        """
        session = self.active_sessions.get(session_id)
        if not session:
            raise ValueError(f"Trial session {session_id} not found")

        # Add ruling to transcript
        await self.add_transcript_entry(
            session_id,
            "Judge",
            f"Evidence {evidence_id} is {ruling}. {reason}",
            {"evidence_ruling": True, "evidence_id": evidence_id,
                "ruling": ruling, "reason": reason}
        )

        # Update evidence status
        if ruling == "admitted":
            if evidence_id not in session.evidence_admitted:
                session.evidence_admitted.append(evidence_id)

        return session

    async def raise_objection(
        self,
        session_id: UUID,
        objection_type: str,
        reason: str,
        raised_by: str,
    ) -> TrialSession:
        """Raise an objection during trial.

        Args:
            session_id: Session ID
            objection_type: Type of objection
            reason: Reason for the objection
            raised_by: Who raised the objection

        Returns:
            Updated trial session

        Raises:
            ValueError: If session not found
        """
        session = self.active_sessions.get(session_id)
        if not session:
            raise ValueError(f"Trial session {session_id} not found")

        # Add objection to transcript
        await self.add_transcript_entry(
            session_id,
            raised_by,
            f"Objection, Your Honor! {objection_type}: {reason}",
            {"objection": True, "objection_type": objection_type,
                "reason": reason, "raised_by": raised_by}
        )

        return session

    async def rule_on_objection(
        self,
        session_id: UUID,
        objection_id: str,
        ruling: str,
        reason: str,
    ) -> TrialSession:
        """Judge rules on an objection.

        Args:
            session_id: Session ID
            objection_id: ID of the objection
            ruling: "sustained" or "overruled"
            reason: Reason for the ruling

        Returns:
            Updated trial session

        Raises:
            ValueError: If session not found
        """
        session = self.active_sessions.get(session_id)
        if not session:
            raise ValueError(f"Trial session {session_id} not found")

        # Add ruling to transcript
        await self.add_transcript_entry(
            session_id,
            "Judge",
            f"Objection {ruling}. {reason}",
            {"objection_ruling": True, "objection_id": objection_id,
                "ruling": ruling, "reason": reason}
        )

        return session

    async def complete_trial(
        self,
        session_id: UUID,
        verdict: Verdict,
    ) -> TrialSession:
        """Complete the trial with a verdict.

        Args:
            session_id: Session ID
            verdict: Final verdict

        Returns:
            Completed trial session

        Raises:
            ValueError: If session not found
        """
        session = self.active_sessions.get(session_id)
        if not session:
            raise ValueError(f"Trial session {session_id} not found")

        session.verdict = verdict
        session.current_phase = TrialPhase.COMPLETED
        session.completed_at = None  # Will be set by the model

        return session
