"""Service for managing trial sessions and agent interactions."""

from typing import Dict, List, Optional, Union
import os
import re
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
from ..utils import get_enum_value, is_enum_or_string_equal, format_case_role
from .turn_manager import TurnManager


class TrialService:
    """Service for managing trial sessions."""

    def __init__(self):
        """Initialize the trial service."""
        self.active_sessions: Dict[UUID, TrialSession] = {}
        self.cases: Dict[UUID, Case] = {}
        self.turn_manager = TurnManager()

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

        # Initialize turn management
        trial_session = self.turn_manager.initialize_turn_for_phase(
            trial_session)

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
            current_str = get_enum_value(current_phase)
            next_str = get_enum_value(next_phase)
            raise ValueError(
                f"Invalid phase transition from {current_str} to {next_str}")

        # Add phase transition to transcript
        current_str = get_enum_value(current_phase)
        next_str = get_enum_value(next_phase)
        await self.add_transcript_entry(
            session_id,
            "Court Clerk",
            f"Trial phase advanced from {current_str.replace('_', ' ').title()} to {next_str.replace('_', ' ').title()}",
            {"phase_transition": True, "from_phase": current_str, "to_phase": next_str}
        )

        session.current_phase = next_phase

        # Initialize turn management for new phase
        session = self.turn_manager.initialize_turn_for_phase(session)

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
            "phase": get_enum_value(session.current_phase),
            "metadata": metadata or {},
        }

        session.transcript.append(transcript_entry)
        return session

    def _create_judge_agent(self) -> JudgeAgent:
        """Create a judge agent."""
        model, provider = self._resolve_provider_and_model_for_role(
            CaseRole.JUDGE)
        return JudgeAgent(model_name=model, provider_name=provider)

    def _create_prosecutor_agent(self) -> ProsecutorAgent:
        """Create a prosecutor agent."""
        model, provider = self._resolve_provider_and_model_for_role(
            CaseRole.PROSECUTOR)
        return ProsecutorAgent(model_name=model, provider_name=provider)

    def _create_defense_agent(self) -> DefenseAgent:
        """Create a defense agent."""
        model, provider = self._resolve_provider_and_model_for_role(
            CaseRole.DEFENSE)
        return DefenseAgent(model_name=model, provider_name=provider)

    def _create_jury_agent(self) -> JuryAgent:
        """Create a jury agent."""
        model, provider = self._resolve_provider_and_model_for_role(
            CaseRole.JURY)
        return JuryAgent(model_name=model, provider_name=provider)

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
        model, provider = self._resolve_provider_and_model_for_role(
            CaseRole.WITNESS)
        return WitnessAgent(witness_data, model_name=model, provider_name=provider)

    def _resolve_provider_and_model_for_role(self, role: CaseRole) -> tuple[str, str]:
        """Resolve provider and model for a given role using Gemini 2.5 Flash for testing.

        Environment overrides (if set) take precedence:
        - JUDGE_PROVIDER/JUDGE_MODEL
        - PROSECUTOR_PROVIDER/PROSECUTOR_MODEL
        - DEFENSE_PROVIDER/DEFENSE_MODEL
        - JURY_PROVIDER/JURY_MODEL
        - WITNESS_PROVIDER/WITNESS_MODEL

        Defaults for testing (cost-effective with Gemini 2.5 Flash at $0.30/1M tokens):
        - All roles: provider=gemini, model=gemini-2.5-flash
        """
        role_key = None
        if role == CaseRole.JUDGE:
            role_key = "JUDGE"
            default_provider, default_model = "gemini", "gemini-2.5-flash"
        elif role == CaseRole.PROSECUTOR:
            role_key = "PROSECUTOR"
            default_provider, default_model = "gemini", "gemini-2.5-flash"
        elif role == CaseRole.DEFENSE:
            role_key = "DEFENSE"
            default_provider, default_model = "gemini", "gemini-2.5-flash"
        elif role == CaseRole.JURY:
            role_key = "JURY"
            default_provider, default_model = "gemini", "gemini-2.5-flash"
        elif role == CaseRole.WITNESS:
            role_key = "WITNESS"
            default_provider, default_model = "gemini", "gemini-2.5-flash"
        else:
            default_provider, default_model = os.getenv(
                "LLM_PROVIDER", "gemini"), os.getenv("LLM_MODEL", "gemini-2.5-flash")

        provider = os.getenv(
            f"{role_key}_PROVIDER", default_provider) if role_key else default_provider
        model = os.getenv(f"{role_key}_MODEL",
                          default_model) if role_key else default_model
        return model, provider

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

        # Check if agent should respond based on turn management
        if not self.turn_manager.should_agent_respond(session, agent_role):
            user_case_role = CaseRole.DEFENSE if session.user_role == UserRole.DEFENSE else CaseRole.PROSECUTOR
            if agent_role == user_case_role:
                agent_name = agent_role.value if hasattr(
                    agent_role, 'value') else str(agent_role)
                raise ValueError(
                    f"It's the user's turn to speak as {agent_name}")
            else:
                agent_name = agent_role.value if hasattr(
                    agent_role, 'value') else str(agent_role)
                raise ValueError(
                    f"It's not {agent_name}'s turn to speak")

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

        # Parse turn management information from judge responses
        turn_info = self._parse_turn_management_from_response(response.content)

        # Clean the response content by removing TURN_MANAGEMENT lines
        cleaned_content = self._clean_response_content(response.content)

        # Add to transcript
        agent_name = format_case_role(agent_role)
        await self.add_transcript_entry(
            session_id,
            agent_name,
            cleaned_content,
            {"confidence": response.confidence,
                "metadata": response.metadata, "turn_info": turn_info},
        )

        # Update turn management
        session = self.turn_manager.update_turn_after_response(
            session, agent_role)

        # If judge specified a turn, override the turn manager's decision
        if turn_info and agent_role == CaseRole.JUDGE:
            session.current_turn = turn_info

        return cleaned_content

    def _clean_response_content(self, response_content: str) -> str:
        """Clean response content by removing TURN_MANAGEMENT lines.

        Args:
            response_content: The agent's raw response content

        Returns:
            Cleaned response content without TURN_MANAGEMENT lines
        """
        # Remove TURN_MANAGEMENT lines from the response
        lines = response_content.split('\n')
        cleaned_lines = []

        for line in lines:
            # Skip lines that contain TURN_MANAGEMENT
            if not re.search(r'TURN_MANAGEMENT:\s*\w+', line, re.IGNORECASE):
                cleaned_lines.append(line)

        return '\n'.join(cleaned_lines).strip()

    def _parse_turn_management_from_response(self, response_content: str) -> Optional[CaseRole]:
        """Parse turn management information from agent response.

        Args:
            response_content: The agent's response content

        Returns:
            CaseRole if turn management info found, None otherwise
        """
        # Look for TURN_MANAGEMENT: pattern in response
        turn_match = re.search(r'TURN_MANAGEMENT:\s*(\w+)',
                               response_content, re.IGNORECASE)
        if turn_match:
            turn_role = turn_match.group(1).lower()
            try:
                return CaseRole(turn_role)
            except ValueError:
                pass
        return None

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

    async def get_automatic_agent_response(
        self,
        session_id: UUID,
        context: Optional[Dict] = None,
    ) -> Optional[str]:
        """Get an automatic response from the agent whose turn it is.

        Args:
            session_id: Session ID
            context: Additional context

        Returns:
            Agent response if it's an AI agent's turn, None if user's turn
        """
        session = self.active_sessions.get(session_id)
        if not session:
            raise ValueError(f"Trial session {session_id} not found")

        current_turn = session.current_turn
        if not current_turn:
            return None

        # Check if it's the user's turn
        user_case_role = CaseRole.DEFENSE if session.user_role == UserRole.DEFENSE else CaseRole.PROSECUTOR

        # Ensure current_turn is a CaseRole enum for comparison
        if isinstance(current_turn, str):
            try:
                current_turn = CaseRole(current_turn.lower())
            except ValueError:
                # Invalid current_turn value, return None
                return None

        if current_turn == user_case_role:
            return None

        # It's an AI agent's turn, get their response
        try:
            # Ensure current_turn is a CaseRole enum for get_agent_response
            if isinstance(current_turn, str):
                try:
                    current_turn = CaseRole(current_turn.lower())
                except ValueError:
                    # Invalid current_turn value, return None
                    return None

            # Create a generic prompt for the agent to respond
            prompt = self._get_turn_prompt_for_agent(current_turn, session)
            response = await self.get_agent_response(
                session_id=session_id,
                agent_role=current_turn,
                prompt=prompt,
                context=context
            )
            return response
        except Exception as e:
            # Log error getting automatic response
            return None

    def _get_turn_prompt_for_agent(self, agent_role: CaseRole, session: TrialSession) -> str:
        """Get an appropriate prompt for an agent based on their turn.

        Args:
            agent_role: Role of the agent
            session: Current trial session

        Returns:
            Prompt for the agent
        """
        # Ensure agent_role is a CaseRole enum
        if isinstance(agent_role, str):
            try:
                agent_role = CaseRole(agent_role.lower())
            except ValueError:
                return "Please respond appropriately to the current situation."

        # Handle both enum and string values for current_phase
        phase = get_enum_value(session.current_phase)

        if agent_role == CaseRole.JUDGE:
            if phase == "setup":
                return "Please open the court session and call the case. Welcome everyone and begin the trial proceedings."
            else:
                return "Please proceed with your judicial duties for this phase of the trial."
        elif agent_role == CaseRole.PROSECUTOR:
            if phase == "opening_statements":
                return "Please present your opening statement to the jury."
            elif phase == "witness_examination":
                return "Please call your first witness or continue with witness examination."
            elif phase == "closing_arguments":
                return "Please present your closing argument to the jury."
        elif agent_role == CaseRole.DEFENSE:
            if phase == "opening_statements":
                return "Please present your opening statement to the jury."
            elif phase == "witness_examination":
                return "Please cross-examine the witness or call your own witness."
            elif phase == "closing_arguments":
                return "Please present your closing argument to the jury."
        elif agent_role == CaseRole.JURY:
            return "Please deliberate on the case and reach a verdict."
        elif agent_role == CaseRole.WITNESS:
            return "Please respond to the questions being asked."

        return "Please respond appropriately to the current situation."
