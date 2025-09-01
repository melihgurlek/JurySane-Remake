"""Witness agent for providing testimony."""

from typing import Any, Dict, Optional

from langchain.schema import HumanMessage

from ..models.trial import CaseRole, TrialSession
from .base import AgentResponse, BaseAgent


class WitnessAgent(BaseAgent):
    """AI agent that plays the role of a witness."""

    def __init__(self, witness_data: Dict[str, Any]):
        """Initialize witness with specific background and knowledge.

        Args:
            witness_data: Dictionary containing witness information
                - name: Witness name
                - background: Personal/professional background
                - knowledge: What they know about the case
                - bias: Any potential bias (optional)
                - personality: Personality traits (optional)
        """
        self.witness_name = witness_data.get("name", "Unknown Witness")
        self.background = witness_data.get("background", "")
        self.knowledge = witness_data.get("knowledge", "")
        self.bias = witness_data.get("bias", "")
        self.personality = witness_data.get("personality", "cooperative")

        system_prompt = f"""You are {self.witness_name}, a witness testifying in a criminal trial.

YOUR BACKGROUND:
{self.background}

WHAT YOU KNOW ABOUT THE CASE:
{self.knowledge}

POTENTIAL BIAS OR MOTIVATION:
{self.bias if self.bias else "None - you are a neutral witness"}

PERSONALITY TRAITS:
{self.personality}

TESTIMONY GUIDELINES:
1. ANSWER ONLY WHAT YOU KNOW: Don't speculate or guess
2. BE TRUTHFUL: Answer honestly based on your knowledge
3. LISTEN CAREFULLY: Answer the specific question asked
4. ADMIT UNCERTAINTY: Say "I don't know" or "I don't remember" when appropriate
5. STAY IN CHARACTER: Maintain consistency with your background and personality

EXAMINATION RULES:
- Direct examination: Provide detailed answers that tell your story
- Cross-examination: Be more cautious, answer only what's asked
- If confused by a question, ask for clarification
- Object if you don't understand or if the question is inappropriate

COMMUNICATION STYLE:
- Speak clearly and at appropriate volume
- Address attorneys as "Sir" or "Ma'am" unless told otherwise
- Be respectful to the judge and all counsel
- Don't volunteer information beyond what's asked (especially on cross)

MEMORY AND PERCEPTION:
- Your memory may not be perfect - admit when unclear
- You can only testify to what you personally observed
- You cannot speculate about others' thoughts or motivations
- Time, distance, lighting, and stress can affect what you remember

Remember: You are here to tell the truth about what you know, saw, or experienced. Don't try to help either side - just answer honestly."""

        super().__init__(
            role=CaseRole.WITNESS,
            system_prompt=system_prompt,
            temperature=0.6,
        )

    async def respond(
        self,
        prompt: str,
        trial_session: TrialSession,
        context: Optional[Dict[str, Any]] = None,
    ) -> AgentResponse:
        """Generate a witness response."""
        messages = self.get_context_messages(trial_session)
        messages.append(HumanMessage(content=prompt))

        metadata = {
            "trial_phase": trial_session.current_phase.value,
            "witness_name": self.witness_name,
            "examination_type": context.get("examination_type") if context else "general",
        }

        return await self._generate_response(messages, metadata)

    async def answer_direct_examination(
        self,
        question: str,
        trial_session: TrialSession,
        examining_attorney: str,
    ) -> AgentResponse:
        """Answer a question during direct examination.

        Args:
            question: Question being asked
            trial_session: Current trial session
            examining_attorney: Which attorney is asking (prosecution/defense)

        Returns:
            Witness's answer
        """
        prompt = f"""The {examining_attorney} attorney is conducting direct examination and asks:

"{question}"

Answer this question based on your knowledge and experience. During direct examination, you can provide detailed explanations and tell your story. Be thorough but stick to what you actually know."""

        return await self.respond(
            prompt,
            trial_session,
            context={"examination_type": "direct",
                     "attorney": examining_attorney}
        )

    async def answer_cross_examination(
        self,
        question: str,
        trial_session: TrialSession,
        examining_attorney: str,
    ) -> AgentResponse:
        """Answer a question during cross-examination.

        Args:
            question: Question being asked
            trial_session: Current trial session
            examining_attorney: Which attorney is asking (prosecution/defense)

        Returns:
            Witness's answer
        """
        prompt = f"""The {examining_attorney} attorney is conducting cross-examination and asks:

"{question}"

This is cross-examination, so be more cautious in your answers. Answer only what is specifically asked. Don't volunteer additional information. If the question is confusing or compound, ask for clarification. If you don't know or don't remember, say so."""

        return await self.respond(
            prompt,
            trial_session,
            context={"examination_type": "cross",
                     "attorney": examining_attorney}
        )

    async def handle_objection_response(
        self,
        original_question: str,
        objection_ruling: str,
        trial_session: TrialSession,
    ) -> AgentResponse:
        """Respond after an objection has been ruled on.

        Args:
            original_question: The original question that was objected to
            objection_ruling: Judge's ruling (sustained/overruled)
            trial_session: Current trial session

        Returns:
            How witness should proceed
        """
        if "sustained" in objection_ruling.lower():
            prompt = f"""An objection was made to the question: "{original_question}"

The judge ruled: {objection_ruling}

Since the objection was sustained, you should not answer the original question. Wait for the attorney to ask a different question or for further instruction from the judge."""
        else:
            prompt = f"""An objection was made to the question: "{original_question}"

The judge ruled: {objection_ruling}

Since the objection was overruled, you should now answer the original question."""

        return await self.respond(
            prompt,
            trial_session,
            context={"examination_type": "objection_response"}
        )

    def get_witness_summary(self) -> Dict[str, str]:
        """Get a summary of witness information for case planning.

        Returns:
            Dictionary with witness details
        """
        return {
            "name": self.witness_name,
            "background": self.background,
            "knowledge": self.knowledge,
            "bias": self.bias,
            "personality": self.personality,
        }
