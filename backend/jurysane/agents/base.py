"""Base agent class for all trial participants."""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

from langchain.schema import BaseMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

from ..config import settings
from ..models.trial import CaseRole, TrialSession


class AgentResponse(BaseModel):
    """Response from an agent."""

    content: str = Field(description="The agent's response content")
    role: CaseRole = Field(description="The agent's role")
    metadata: Dict[str, Any] = Field(
        default_factory=dict, description="Additional metadata")
    confidence: float = Field(
        default=0.8, description="Confidence in the response")


class BaseAgent(ABC):
    """Base class for all trial agents."""

    def __init__(
        self,
        role: CaseRole,
        system_prompt: str,
        model_name: Optional[str] = None,
        temperature: float = 0.7,
    ):
        """Initialize the agent.

        Args:
            role: The role this agent plays in the trial
            system_prompt: The system prompt defining the agent's behavior
            model_name: Optional override for the LLM model
            temperature: Temperature for response generation
        """
        self.role = role
        self.system_prompt = system_prompt
        self.model_name = model_name or settings.llm.model_name
        self.temperature = temperature
        self.memory: List[BaseMessage] = []

        # Initialize the LLM
        self.llm = ChatOpenAI(
            model=self.model_name,
            temperature=self.temperature,
            max_tokens=settings.llm.max_tokens,
            openai_api_key=settings.openai_api_key,
        )

    def add_to_memory(self, message: BaseMessage) -> None:
        """Add a message to the agent's memory."""
        self.memory.append(message)

    def clear_memory(self) -> None:
        """Clear the agent's memory."""
        self.memory.clear()

    def get_context_messages(self, trial_session: TrialSession) -> List[BaseMessage]:
        """Get context messages for the current trial state.

        Args:
            trial_session: Current trial session

        Returns:
            List of messages providing context
        """
        messages = [SystemMessage(content=self.system_prompt)]

        # Add case context
        case_context = self._build_case_context(trial_session)
        if case_context:
            messages.append(SystemMessage(content=case_context))

        # Add memory (conversation history)
        messages.extend(self.memory)

        return messages

    def _build_case_context(self, trial_session: TrialSession) -> str:
        """Build case context string.

        Args:
            trial_session: Current trial session

        Returns:
            Formatted case context
        """
        context_parts = [
            f"Trial Phase: {trial_session.current_phase.value if hasattr(trial_session.current_phase, 'value') else trial_session.current_phase}",
            f"User Role: {trial_session.user_role.value if hasattr(trial_session.user_role, 'value') else trial_session.user_role}",
        ]

        # Add case information if available
        # Note: Case data should be passed through the trial service
        if hasattr(trial_session, 'case_data') and trial_session.case_data:
            case = trial_session.case_data
            context_parts.extend([
                f"Case: {case.title}",
                f"Charges: {', '.join(case.charges)}",
                f"Case Description: {case.description}",
            ])

        # Add recent transcript entries
        if trial_session.transcript:
            recent_entries = trial_session.transcript[-5:]  # Last 5 entries
            context_parts.append("Recent Transcript:")
            for entry in recent_entries:
                speaker = entry.get("speaker", "Unknown")
                content = entry.get("content", "")
                context_parts.append(f"{speaker}: {content}")

        return "\n".join(context_parts)

    @abstractmethod
    async def respond(
        self,
        prompt: str,
        trial_session: TrialSession,
        context: Optional[Dict[str, Any]] = None,
    ) -> AgentResponse:
        """Generate a response to the given prompt.

        Args:
            prompt: The prompt to respond to
            trial_session: Current trial session
            context: Additional context for the response

        Returns:
            Agent's response
        """
        pass

    async def _generate_response(
        self,
        messages: List[BaseMessage],
        metadata: Optional[Dict[str, Any]] = None,
    ) -> AgentResponse:
        """Generate a response using the LLM.

        Args:
            messages: Messages to send to the LLM
            metadata: Additional metadata to include

        Returns:
            Agent's response
        """
        try:
            response = await self.llm.ainvoke(messages)
            content = response.content if hasattr(
                response, 'content') else str(response)

            # Add the response to memory
            self.add_to_memory(HumanMessage(content=messages[-1].content))
            self.add_to_memory(response)

            return AgentResponse(
                content=content,
                role=self.role,
                metadata=metadata or {},
                confidence=0.8,  # Default confidence
            )

        except Exception as e:
            # Fallback response
            return AgentResponse(
                content=f"I apologize, but I'm having difficulty responding right now. Error: {str(e)}",
                role=self.role,
                metadata={"error": str(e)},
                confidence=0.1,
            )
