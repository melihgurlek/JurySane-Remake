"""AI agents for different trial roles."""

from .base import BaseAgent
from .defense import DefenseAgent
from .judge import JudgeAgent
from .jury import JuryAgent
from .prosecutor import ProsecutorAgent
from .witness import WitnessAgent

__all__ = [
    "BaseAgent",
    "DefenseAgent",
    "JudgeAgent",
    "JuryAgent",
    "ProsecutorAgent",
    "WitnessAgent",
]
