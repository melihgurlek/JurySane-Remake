"""Judge agent for moderating the trial."""

from typing import Any, Dict, Optional

from langchain.schema import HumanMessage

from ..models.trial import CaseRole, TrialSession
from .base import AgentResponse, BaseAgent


class JudgeAgent(BaseAgent):
    """AI agent that plays the role of a judge."""

    def __init__(self):
        system_prompt = """You are a federal judge presiding over a criminal trial. Your responsibilities include:

1. MAINTAINING ORDER: Ensure proper courtroom procedure and decorum
2. RULING ON OBJECTIONS: Make quick, decisive rulings on legal objections
3. MANAGING FLOW: Guide the trial through its phases (opening statements, witness examination, closing arguments)
4. ENSURING FAIRNESS: Protect the rights of both prosecution and defense
5. JURY INSTRUCTIONS: Provide clear instructions to the jury

OBJECTION RULINGS:
- "Sustained" - if objection is valid
- "Overruled" - if objection is invalid
- Provide brief reasoning when necessary

COMMUNICATION STYLE:
- Authoritative but fair
- Clear and concise
- Professional courtroom language
- Address attorneys as "Counsel" and maintain formality

LEGAL STANDARDS:
- Apply rules of evidence
- Ensure due process
- Maintain presumption of innocence
- Require proof beyond reasonable doubt for conviction

You must make decisions that serve justice and maintain the integrity of the legal process."""

        super().__init__(
            role=CaseRole.JUDGE,
            system_prompt=system_prompt,
            temperature=0.3,  # Lower temperature for more consistent judicial behavior
        )

    async def respond(
        self,
        prompt: str,
        trial_session: TrialSession,
        context: Optional[Dict[str, Any]] = None,
    ) -> AgentResponse:
        """Generate a judicial response."""
        messages = self.get_context_messages(trial_session)
        messages.append(HumanMessage(content=prompt))

        # Add specific context for judicial decisions
        metadata = {
            "trial_phase": trial_session.current_phase.value,
            "judge_action": context.get("action") if context else "general_response",
        }

        return await self._generate_response(messages, metadata)

    async def rule_on_objection(
        self,
        objection_type: str,
        objection_reason: str,
        trial_session: TrialSession,
        context: Optional[str] = None,
    ) -> AgentResponse:
        """Rule on a specific objection.

        Args:
            objection_type: Type of objection raised
            objection_reason: Reason given for the objection
            trial_session: Current trial session
            context: Additional context about the objection

        Returns:
            Judge's ruling on the objection
        """
        prompt = f"""An objection has been raised:

Objection Type: {objection_type}
Reason: {objection_reason}
Context: {context or 'Not provided'}

Please rule on this objection. Respond with either "Sustained" or "Overruled" followed by a brief explanation if necessary."""

        return await self.respond(
            prompt,
            trial_session,
            context={"action": "objection_ruling",
                     "objection_type": objection_type}
        )

    async def provide_jury_instructions(
        self,
        trial_session: TrialSession,
        charges: list[str],
    ) -> AgentResponse:
        """Provide jury instructions before deliberation.

        Args:
            trial_session: Current trial session
            charges: Criminal charges to instruct on

        Returns:
            Jury instructions
        """
        charges_text = ", ".join(charges)
        prompt = f"""The trial has concluded and you must now provide jury instructions. 

Charges: {charges_text}

Please provide comprehensive jury instructions covering:
1. The burden of proof (beyond reasonable doubt)
2. Presumption of innocence
3. How to evaluate evidence and witness credibility
4. Definitions of the specific charges
5. The deliberation process

Keep instructions clear and legally accurate."""

        return await self.respond(
            prompt,
            trial_session,
            context={"action": "jury_instructions", "charges": charges}
        )
