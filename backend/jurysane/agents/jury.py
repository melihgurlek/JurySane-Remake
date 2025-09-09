"""Jury agent for deliberating and rendering verdicts."""

from typing import Any, Dict, Optional

from langchain.schema import HumanMessage

from ..models.trial import CaseRole, TrialSession, Verdict
from .base import AgentResponse, BaseAgent


class JuryAgent(BaseAgent):
    """AI agent that plays the role of a jury."""

    def __init__(self, model_name: Optional[str] = None, provider_name: Optional[str] = None):
        system_prompt = """You are a jury of 12 citizens deliberating a criminal case. Your duty is to determine guilt or innocence based solely on the evidence presented at trial.

YOUR RESPONSIBILITIES:
1. EVALUATE EVIDENCE: Consider all testimony, documents, and exhibits
2. ASSESS CREDIBILITY: Judge the believability of witnesses
3. APPLY THE LAW: Follow the judge's instructions on legal standards
4. DELIBERATE FAIRLY: Consider all viewpoints and evidence
5. RENDER VERDICT: Decide guilty or not guilty on each charge

DELIBERATION PROCESS:
- Review all evidence presented during trial
- Discuss prosecution and defense arguments
- Consider witness credibility and reliability
- Identify strengths and weaknesses of each side
- Apply burden of proof (beyond reasonable doubt)

BURDEN OF PROOF:
- Prosecution must prove guilt beyond a reasonable doubt
- This is a high standard - not absolute certainty, but very high confidence
- Any reasonable doubt should result in not guilty verdict
- Defense does not need to prove innocence

EVALUATION CRITERIA:
- Witness credibility (consistency, bias, ability to observe)
- Physical evidence reliability
- Expert testimony validity
- Logical consistency of arguments
- Gaps or weaknesses in the case

DECISION MAKING:
- Consider each charge separately
- Guilty verdict requires proof beyond reasonable doubt
- Not guilty if reasonable doubt exists
- Base decision only on evidence presented in court
- Not on sympathy, prejudice, or outside knowledge

Remember: Better to let a guilty person go free than convict an innocent person. When in doubt, vote not guilty."""

        super().__init__(
            role=CaseRole.JURY,
            system_prompt=system_prompt,
            model_name=model_name,
            provider_name=provider_name,
            temperature=0.5,  # Moderate temperature for balanced deliberation
        )

    async def respond(
        self,
        prompt: str,
        trial_session: TrialSession,
        context: Optional[Dict[str, Any]] = None,
    ) -> AgentResponse:
        """Generate a jury response."""
        messages = self.get_context_messages(trial_session)
        messages.append(HumanMessage(content=prompt))

        phase_value = trial_session.current_phase.value if hasattr(
            trial_session.current_phase, 'value') else trial_session.current_phase

        metadata = {
            "trial_phase": phase_value,
            "jury_action": context.get("action") if context else "general_response",
        }

        return await self._generate_response(messages, metadata)

    async def deliberate_verdict(
        self,
        trial_session: TrialSession,
        charges: list[str],
        prosecution_summary: str,
        defense_summary: str,
        key_evidence: list[str],
        judge_instructions: str,
    ) -> AgentResponse:
        """Deliberate and render a verdict.

        Args:
            trial_session: Current trial session
            charges: Criminal charges to decide on
            prosecution_summary: Summary of prosecution's case
            defense_summary: Summary of defense arguments
            key_evidence: List of key evidence presented
            judge_instructions: Judge's instructions to jury

        Returns:
            Jury's verdict with reasoning
        """
        charges_text = ", ".join(charges)
        evidence_text = "; ".join(key_evidence)

        prompt = f"""The trial has concluded and you must now deliberate on the verdict.

CHARGES: {charges_text}

PROSECUTION'S CASE:
{prosecution_summary}

DEFENSE ARGUMENTS:
{defense_summary}

KEY EVIDENCE:
{evidence_text}

JUDGE'S INSTRUCTIONS:
{judge_instructions}

Deliberate carefully and render your verdict. For each charge, consider:

1. What evidence supports guilt?
2. What evidence creates doubt?
3. How credible were the witnesses?
4. Did prosecution prove guilt beyond reasonable doubt?

Provide your verdict (Guilty or Not Guilty) for each charge along with detailed reasoning for your decision. Explain how you weighed the evidence and why you reached this conclusion."""

        return await self.respond(
            prompt,
            trial_session,
            context={"action": "verdict_deliberation", "charges": charges}
        )

    async def assess_witness_credibility(
        self,
        witness_name: str,
        testimony_summary: str,
        cross_examination: str,
        trial_session: TrialSession,
    ) -> AgentResponse:
        """Assess the credibility of a specific witness.

        Args:
            witness_name: Name of the witness
            testimony_summary: Summary of their testimony
            cross_examination: Summary of cross-examination
            trial_session: Current trial session

        Returns:
            Assessment of witness credibility
        """
        prompt = f"""Assess the credibility of witness {witness_name}.

DIRECT EXAMINATION TESTIMONY:
{testimony_summary}

CROSS-EXAMINATION:
{cross_examination}

Consider the following factors:
1. Consistency of testimony
2. Ability to observe and remember events
3. Any apparent bias or motivation to lie
4. How they handled cross-examination
5. Detail and specificity of their account
6. Whether testimony makes logical sense

Provide your assessment of this witness's credibility and reliability. How much weight should their testimony carry in your deliberations?"""

        return await self.respond(
            prompt,
            trial_session,
            context={"action": "witness_assessment", "witness": witness_name}
        )

    async def evaluate_evidence_strength(
        self,
        evidence_list: list[str],
        trial_session: TrialSession,
    ) -> AgentResponse:
        """Evaluate the strength of evidence presented.

        Args:
            evidence_list: List of evidence to evaluate
            trial_session: Current trial session

        Returns:
            Evaluation of evidence strength
        """
        evidence_text = "\n".join(
            [f"- {evidence}" for evidence in evidence_list])

        prompt = f"""Evaluate the strength and reliability of the evidence presented:

EVIDENCE:
{evidence_text}

For each piece of evidence, consider:
1. How reliable is this evidence?
2. Does it directly support guilt or innocence?
3. Are there alternative explanations?
4. Was the evidence properly authenticated?
5. How strong is the chain of custody?

Provide your overall assessment of the evidence. Which pieces are most compelling? Which are weakest? How does the evidence as a whole support or undermine the prosecution's case?"""

        return await self.respond(
            prompt,
            trial_session,
            context={"action": "evidence_evaluation"}
        )
