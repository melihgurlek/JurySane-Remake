"""Prosecutor agent for representing the state."""

from typing import Any, Dict, Optional

from langchain.schema import HumanMessage

from ..models.trial import CaseRole, TrialSession
from .base import AgentResponse, BaseAgent


class ProsecutorAgent(BaseAgent):
    """AI agent that plays the role of a prosecutor."""

    def __init__(self):
        system_prompt = """You are an experienced prosecutor representing the State in a criminal trial. Your goal is to prove the defendant's guilt beyond a reasonable doubt.

YOUR RESPONSIBILITIES:
1. OPENING STATEMENTS: Present a clear theory of the case and roadmap of evidence
2. WITNESS EXAMINATION: Conduct direct examination to establish facts
3. EVIDENCE PRESENTATION: Introduce and authenticate evidence
4. CROSS-EXAMINATION: Challenge defense witnesses and testimony
5. OBJECTIONS: Raise appropriate objections to improper questions or evidence
6. CLOSING ARGUMENTS: Synthesize evidence and argue for conviction

LEGAL STRATEGY:
- Build a coherent narrative of guilt
- Establish elements of each crime charged
- Anticipate and counter defense arguments
- Use evidence methodically to build your case
- Challenge witness credibility when appropriate

EXAMINATION TECHNIQUES:
- Ask clear, direct questions
- Establish foundation for evidence
- Use leading questions only on cross-examination
- Follow proper courtroom procedure

COMMUNICATION STYLE:
- Professional and respectful
- Confident but not arrogant
- Address the judge as "Your Honor"
- Address opposing counsel respectfully
- Speak clearly for the jury

ETHICAL OBLIGATIONS:
- Seek justice, not just convictions
- Disclose exculpatory evidence
- Be fair in questioning witnesses
- Follow rules of evidence and procedure

Remember: Your burden is to prove guilt beyond a reasonable doubt. Present facts clearly and let the evidence speak."""

        super().__init__(
            role=CaseRole.PROSECUTOR,
            system_prompt=system_prompt,
            temperature=0.6,
        )

    async def respond(
        self,
        prompt: str,
        trial_session: TrialSession,
        context: Optional[Dict[str, Any]] = None,
    ) -> AgentResponse:
        """Generate a prosecutorial response."""
        messages = self.get_context_messages(trial_session)
        messages.append(HumanMessage(content=prompt))

        metadata = {
            "trial_phase": trial_session.current_phase.value,
            "prosecutor_action": context.get("action") if context else "general_response",
        }

        return await self._generate_response(messages, metadata)

    async def deliver_opening_statement(
        self,
        trial_session: TrialSession,
        case_facts: str,
        charges: list[str],
        evidence_summary: str,
    ) -> AgentResponse:
        """Deliver an opening statement.

        Args:
            trial_session: Current trial session
            case_facts: Facts of the case
            charges: Criminal charges
            evidence_summary: Summary of key evidence

        Returns:
            Opening statement
        """
        charges_text = ", ".join(charges)
        prompt = f"""You must now deliver your opening statement to the jury.

Case Facts: {case_facts}
Charges: {charges_text}
Key Evidence: {evidence_summary}

Deliver a compelling opening statement that:
1. Introduces yourself and your role
2. Explains what the evidence will show
3. Outlines the charges and elements to prove
4. Provides a roadmap of your case
5. Requests the jury find the defendant guilty

Keep it professional, factual, and persuasive. Do not argue - just preview what the evidence will show."""

        return await self.respond(
            prompt,
            trial_session,
            context={"action": "opening_statement"}
        )

    async def examine_witness(
        self,
        witness_name: str,
        witness_background: str,
        examination_goals: list[str],
        trial_session: TrialSession,
    ) -> AgentResponse:
        """Conduct direct examination of a witness.

        Args:
            witness_name: Name of the witness
            witness_background: Background information about the witness
            examination_goals: What you want to establish through this witness
            trial_session: Current trial session

        Returns:
            Opening questions for direct examination
        """
        goals_text = "; ".join(examination_goals)
        prompt = f"""You are about to conduct direct examination of {witness_name}.

Witness Background: {witness_background}
Examination Goals: {goals_text}

Begin your direct examination. Start with establishing the witness's credentials and background, then move to the relevant facts. Ask clear, non-leading questions that allow the witness to tell their story.

Provide your first few questions to begin the examination."""

        return await self.respond(
            prompt,
            trial_session,
            context={"action": "direct_examination", "witness": witness_name}
        )

    async def deliver_closing_argument(
        self,
        trial_session: TrialSession,
        case_summary: str,
        key_evidence: list[str],
        charges: list[str],
    ) -> AgentResponse:
        """Deliver closing argument.

        Args:
            trial_session: Current trial session
            case_summary: Summary of the case
            key_evidence: List of key evidence presented
            charges: Criminal charges

        Returns:
            Closing argument
        """
        evidence_text = "; ".join(key_evidence)
        charges_text = ", ".join(charges)

        prompt = f"""Time for your closing argument to the jury.

Case Summary: {case_summary}
Key Evidence Presented: {evidence_text}
Charges: {charges_text}

Deliver a powerful closing argument that:
1. Summarizes the evidence presented
2. Explains how evidence proves each element of the charges
3. Addresses any defense arguments raised
4. Emphasizes the standard of "beyond reasonable doubt" has been met
5. Requests a guilty verdict

Be persuasive but stick to the evidence and law. This is your final opportunity to convince the jury."""

        return await self.respond(
            prompt,
            trial_session,
            context={"action": "closing_argument"}
        )
