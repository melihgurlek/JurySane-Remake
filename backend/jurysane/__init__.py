"""JurySane: AI-Powered Legal Trial Simulation"""

__version__ = "0.1.0"
__author__ = "Melih Gürlek"
__description__ = "AI-Powered Legal Trial Simulation"

from .utils import get_enum_value, safe_get_enum_value, format_case_role, format_trial_phase, is_enum_or_string_equal

__all__ = [
    "get_enum_value",
    "safe_get_enum_value",
    "format_case_role",
    "format_trial_phase",
    "is_enum_or_string_equal",
]
