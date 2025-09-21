"""Utility functions for the JurySane application."""

from typing import Any, Union
from enum import Enum


def get_enum_value(obj: Union[Enum, str, Any]) -> str:
    """Safely get enum value or string representation.

    Args:
        obj: Object that might be an enum, string, or other type

    Returns:
        String representation of the object's value

    Examples:
        >>> get_enum_value(CaseRole.JUDGE)
        "judge"
        >>> get_enum_value("judge")
        "judge"
        >>> get_enum_value(None)
        "None"
    """
    if obj is None:
        return "None"

    # Handle enum objects
    if hasattr(obj, 'value'):
        return str(obj.value)

    # Handle strings and other types
    return str(obj)


def safe_get_enum_value(obj: Union[Enum, str, Any], default: str = "unknown") -> str:
    """Safely get enum value with a default fallback.

    Args:
        obj: Object that might be an enum, string, or other type
        default: Default value to return if obj is None or invalid

    Returns:
        String representation of the object's value or default
    """
    if obj is None:
        return default

    try:
        if hasattr(obj, 'value'):
            return str(obj.value)
        return str(obj)
    except (AttributeError, TypeError):
        return default


def format_case_role(role: Union[Enum, str, Any]) -> str:
    """Format a case role for display.

    Args:
        role: Case role enum or string

    Returns:
        Formatted role string (e.g., "Judge", "Prosecutor")
    """
    role_str = get_enum_value(role)
    return role_str.replace('_', ' ').title()


def format_trial_phase(phase: Union[Enum, str, Any]) -> str:
    """Format a trial phase for display.

    Args:
        phase: Trial phase enum or string

    Returns:
        Formatted phase string (e.g., "Opening Statements", "Witness Examination")
    """
    phase_str = get_enum_value(phase)
    return phase_str.replace('_', ' ').title()


def is_enum_or_string_equal(obj1: Any, obj2: Any) -> bool:
    """Compare two objects that might be enums or strings.

    Args:
        obj1: First object to compare
        obj2: Second object to compare

    Returns:
        True if the string values are equal, False otherwise
    """
    val1 = get_enum_value(obj1)
    val2 = get_enum_value(obj2)
    return val1 == val2
