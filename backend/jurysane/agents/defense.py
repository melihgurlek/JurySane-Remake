"""Defense attorney agent for representing the defendant."""

from typing import Any, Dict, Optional

from langchain.schema import HumanMessage

from ..models.trial import CaseRole, TrialSession
from .base import AgentResponse, BaseAgent


class DefenseAgent(BaseAgent):
    """AI agent that plays the role of a defense attorney."""

    def __init__(self):
        system_prompt = """You are an experienced defense attorney representing the defendant in a criminal trial. Your goal is to create reasonable doubt and protect your client's rights.

YOUR RESPONSIBILITIES:
1. OPENING STATEMENTS: Challenge prosecution's theory and preview your defense
2. CROSS-EXAMINATION: Challenge prosecution witnesses and their testimony
3. WITNESS EXAMINATION: Present defense witnesses if beneficial
4. OBJECTIONS: Protect your client by raising appropriate objections
5. CLOSING ARGUMENTS: Argue for acquittal based on reasonable doubt

DEFENSE STRATEGY:
- Challenge the prosecution's evidence and witnesses
- Highlight inconsistencies and gaps in their case
- Present alternative theories when possible
- Emphasize burden of proof is on the prosecution
- Protect constitutional rights (presumption of innocence)

EXAMINATION TECHNIQUES:
- Use cross-examination to expose weaknesses
- Ask pointed questions that create doubt
- Challenge witness credibility and memory
- Highlight biases and motivations

COMMUNICATION STYLE:
- Passionate advocate for your client
- Professional and respectful to all
- Address the judge as "Your Honor"
- Confident in challenging the prosecution
- Clear and persuasive with the jury

KEY PRINCIPLES:
- Presumption of innocence until proven guilty
- Burden is on prosecution to prove beyond reasonable doubt
- You don't have to prove innocence - just create doubt
- Every defendant deserves zealous representation
- Challenge everything that can be challenged

ETHICAL OBLIGATIONS:
- Zealous advocacy within legal bounds
- Protect client confidentiality
- Ensure fair trial procedures
- Challenge prosecution fairly but aggressively

Remember: One juror with reasonable doubt is all you need for acquittal. Focus on creating that doubt."""

        super().__init__(
            role=CaseRole.DEFENSE,
            system_prompt=system_prompt,
            temperature=0.7,
        )

    async def respond(
        self,
        prompt: str,
        trial_session: TrialSession,
        context: Optional[Dict[str, Any]] = None,
    ) -> AgentResponse:
        """Generate a defense response."""
        messages = self.get_context_messages(trial_session)
        messages.append(HumanMessage(content=prompt))

        metadata = {
            "trial_phase": trial_session.current_phase.value,
            "defense_action": context.get("action") if context else "general_response",
        }

        return await self._generate_response(messages, metadata)

    async def deliver_opening_statement(
        self,
        trial_session: TrialSession,
        case_facts: str,
        charges: list[str],
        defense_theory: str,
    ) -> AgentResponse:
        """Deliver an opening statement.

        Args:
            trial_session: Current trial session
            case_facts: Facts of the case
            charges: Criminal charges
            defense_theory: Defense theory of the case

        Returns:
            Opening statement
        """
        charges_text = ", ".join(charges)
        prompt = f"""You must now deliver your opening statement to the jury.

Case Facts: {case_facts}
Charges: {charges_text}
Defense Theory: {defense_theory}

Deliver a compelling opening statement that:
1. Introduces yourself as the defense attorney
2. Reminds jury of presumption of innocence
3. Explains burden of proof (beyond reasonable doubt)
4. Challenges prosecution's theory
5. Previews weaknesses in their case
6. Sets up your defense strategy

Focus on creating doubt from the start. This is not the time to argue - just preview what the evidence will NOT show."""

        return await self.respond(
            prompt,
            trial_session,
            context={"action": "opening_statement"}
        )

    async def cross_examine_witness(
        self,
        witness_name: str,
        witness_testimony: str,
        attack_points: list[str],
        trial_session: TrialSession,
    ) -> AgentResponse:
        """Conduct cross-examination of a prosecution witness.

        Args:
            witness_name: Name of the witness
            witness_testimony: Summary of their direct examination
            attack_points: Specific points to challenge
            trial_session: Current trial session

        Returns:
            Cross-examination questions
        """
        attack_text = "; ".join(attack_points)
        prompt = f"""You are about to cross-examine {witness_name}, a prosecution witness.

Their Direct Examination: {witness_testimony}
Points to Challenge: {attack_text}

Conduct an effective cross-examination. Use leading questions to:
1. Challenge their perception, memory, or ability to observe
2. Expose biases, motivations, or inconsistencies
3. Highlight limitations in their knowledge
4. Create doubt about their testimony

Be aggressive but professional. Only ask questions you know the answer to. Make your points and sit down.

Provide your first few cross-examination questions."""

        return await self.respond(
            prompt,
            trial_session,
            context={"action": "cross_examination", "witness": witness_name}
        )

    async def deliver_closing_argument(
        self,
        trial_session: TrialSession,
        prosecution_case: str,
        reasonable_doubt_points: list[str],
        charges: list[str],
    ) -> AgentResponse:
        """Deliver closing argument.

        Args:
            trial_session: Current trial session
            prosecution_case: Summary of prosecution's case
            reasonable_doubt_points: Specific points creating reasonable doubt
            charges: Criminal charges

        Returns:
            Closing argument
        """
        doubt_points = "; ".join(reasonable_doubt_points)
        charges_text = ", ".join(charges)

        prompt = f"""Time for your closing argument to the jury.

Prosecution's Case: {prosecution_case}
Reasonable Doubt Points: {doubt_points}
Charges: {charges_text}

Deliver a powerful closing argument that:
1. Reminds jury of presumption of innocence
2. Emphasizes burden of proof (beyond reasonable doubt)
3. Attacks weaknesses in prosecution's case
4. Highlights evidence that creates doubt
5. Argues prosecution has failed to meet their burden
6. Requests a not guilty verdict

Be passionate but focus on the evidence (or lack thereof). One reasonable doubt is enough for acquittal."""

        return await self.respond(
            prompt,
            trial_session,
            context={"action": "closing_argument"}
        )
