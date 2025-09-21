"""Turn management service for trial sessions."""

from typing import Dict, List, Optional, Tuple
from uuid import UUID

from ..models.trial import CaseRole, TrialPhase, TrialSession, UserRole
from ..utils import get_enum_value, is_enum_or_string_equal


class TurnManager:
    """Manages turn-based interactions in trial sessions."""

    def __init__(self):
        """Initialize the turn manager."""
        # Define turn sequences for each trial phase
        self.phase_turn_sequences = {
            TrialPhase.SETUP: [CaseRole.JUDGE],
            TrialPhase.OPENING_STATEMENTS: [CaseRole.PROSECUTOR, CaseRole.DEFENSE],
            TrialPhase.WITNESS_EXAMINATION: [CaseRole.PROSECUTOR, CaseRole.DEFENSE, CaseRole.JUDGE],
            TrialPhase.CLOSING_ARGUMENTS: [CaseRole.PROSECUTOR, CaseRole.DEFENSE],
            TrialPhase.JURY_DELIBERATION: [CaseRole.JURY],
            TrialPhase.VERDICT: [CaseRole.JUDGE],
            TrialPhase.COMPLETED: []
        }

    def get_next_turn(
        self,
        session: TrialSession,
        last_speaker: Optional[CaseRole] = None
    ) -> Optional[CaseRole]:
        """Determine who should speak next based on trial phase and context.

        Args:
            session: Current trial session
            last_speaker: Who spoke last (if any)

        Returns:
            Role that should speak next, or None if no turn is needed
        """
        current_phase = session.current_phase
        user_role = session.user_role

        # Handle both enum and string values for current_phase
        phase_value = get_enum_value(current_phase)

        # Get the turn sequence for current phase
        turn_sequence = self.phase_turn_sequences.get(current_phase, [])

        if not turn_sequence:
            return None

        # Handle different phases
        if phase_value == "setup":
            # In setup phase, judge speaks first, then prosecutor begins opening statements
            if last_speaker == CaseRole.JUDGE:
                return CaseRole.PROSECUTOR  # Prosecutor should start opening statements
            return CaseRole.JUDGE

        elif phase_value == "opening_statements":
            # Prosecutor goes first, then defense
            if not last_speaker:
                return CaseRole.PROSECUTOR
            elif last_speaker == CaseRole.PROSECUTOR:
                return CaseRole.DEFENSE
            else:
                # Both opening statements done, advance to next phase
                return None

        elif phase_value == "witness_examination":
            return self._get_witness_examination_turn(session, last_speaker)

        elif phase_value == "closing_arguments":
            # Prosecutor goes first, then defense
            if not last_speaker:
                return CaseRole.PROSECUTOR
            elif last_speaker == CaseRole.PROSECUTOR:
                return CaseRole.DEFENSE
            else:
                # Both closing arguments done, advance to jury deliberation
                return None

        elif phase_value == "jury_deliberation":
            return CaseRole.JURY

        elif phase_value == "verdict":
            return CaseRole.JUDGE

        return None

    def _get_witness_examination_turn(
        self,
        session: TrialSession,
        last_speaker: Optional[CaseRole]
    ) -> Optional[CaseRole]:
        """Determine turn for witness examination phase.

        Args:
            session: Current trial session
            last_speaker: Who spoke last

        Returns:
            Role that should speak next
        """
        # This is a simplified version - in a real implementation,
        # you'd track which witness is being examined and whether
        # it's direct or cross-examination

        if not last_speaker:
            # Start with prosecutor calling first witness
            return CaseRole.PROSECUTOR
        elif last_speaker == CaseRole.PROSECUTOR:
            # Prosecutor finished direct examination, defense cross-examines
            return CaseRole.DEFENSE
        elif last_speaker == CaseRole.DEFENSE:
            # Defense finished cross-examination, prosecutor can call next witness
            return CaseRole.PROSECUTOR
        else:
            # Judge or other speaker, continue with current pattern
            return CaseRole.PROSECUTOR

    def should_agent_respond(
        self,
        session: TrialSession,
        agent_role: CaseRole
    ) -> bool:
        """Check if an agent should respond based on current turn.

        Args:
            session: Current trial session
            agent_role: Role of the agent asking to respond

        Returns:
            True if the agent should respond
        """
        # If it's the agent's turn, they should respond
        if session.current_turn is None:
            return False

        if is_enum_or_string_equal(session.current_turn, agent_role):
            return True

        # Special cases where agents can always respond
        if agent_role == CaseRole.JUDGE:
            # Judge can always respond to maintain order
            return True

        # Check if user is playing this role
        user_case_role = CaseRole.DEFENSE if session.user_role == UserRole.DEFENSE else CaseRole.PROSECUTOR
        if agent_role == user_case_role:
            # User is playing this role, so agent should not respond
            return False

        return False

    def update_turn_after_response(
        self,
        session: TrialSession,
        speaker: CaseRole
    ) -> TrialSession:
        """Update turn information after a response.

        Args:
            session: Current trial session
            speaker: Who just spoke

        Returns:
            Updated trial session
        """
        session.last_speaker = speaker
        session.turn_count += 1

        # Determine next turn
        next_turn = self.get_next_turn(session, speaker)
        session.current_turn = next_turn

        # If no next turn, we might need to advance phase
        if next_turn is None:
            session.awaiting_response = False
        else:
            session.awaiting_response = True

        return session

    def initialize_turn_for_phase(
        self,
        session: TrialSession
    ) -> TrialSession:
        """Initialize turn management for a new phase.

        Args:
            session: Current trial session

        Returns:
            Updated trial session
        """
        # Reset turn information
        session.last_speaker = None
        session.turn_count = 0

        # Get first turn for this phase
        session.current_turn = self.get_next_turn(session)

        if session.current_turn:
            session.awaiting_response = True
        else:
            session.awaiting_response = False

        return session

    def get_available_agents_for_user(
        self,
        session: TrialSession
    ) -> List[CaseRole]:
        """Get list of agents the user can interact with.

        Args:
            session: Current trial session

        Returns:
            List of available agent roles
        """
        user_case_role = CaseRole.DEFENSE if session.user_role == UserRole.DEFENSE else CaseRole.PROSECUTOR

        available_agents = [CaseRole.JUDGE, CaseRole.JURY]

        # Add opposing counsel
        if session.user_role == UserRole.DEFENSE:
            available_agents.append(CaseRole.PROSECUTOR)
        else:
            available_agents.append(CaseRole.DEFENSE)

        # Add witnesses if in witness examination phase
        if session.current_phase == TrialPhase.WITNESS_EXAMINATION:
            available_agents.append(CaseRole.WITNESS)

        return available_agents

    def can_user_speak_now(self, session: TrialSession) -> bool:
        """Check if it's the user's turn to speak.

        Args:
            session: Current trial session

        Returns:
            True if user can speak now
        """
        user_case_role = CaseRole.DEFENSE if session.user_role == UserRole.DEFENSE else CaseRole.PROSECUTOR
        return session.current_turn == user_case_role
