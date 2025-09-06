"""Shared case store to ensure consistent IDs across all APIs."""

from typing import List
from ..models.trial import Case
from .sample_cases import get_sample_case
from .generated_cases import get_generated_cases

# Global case store
_all_cases: List[Case] = None


def get_shared_cases() -> List[Case]:
    """Get all cases with consistent IDs.

    Returns:
        List of all available cases (sample + generated)
    """
    global _all_cases
    if _all_cases is None:
        sample_case = get_sample_case()
        generated_cases = get_generated_cases()
        _all_cases = [sample_case] + generated_cases
    return _all_cases


def get_case_by_id(case_id: str) -> Case:
    """Get a case by its ID.

    Args:
        case_id: The case ID to look up

    Returns:
        The case with the given ID

    Raises:
        ValueError: If case not found
    """
    all_cases = get_shared_cases()
    for case in all_cases:
        if str(case.id) == case_id:
            return case

    raise ValueError(f"Case {case_id} not found")
