"""Case management API routes."""

from typing import List
from fastapi import APIRouter, HTTPException
from uuid import UUID

from ...models.trial import Case
from ...data.case_store import get_shared_cases, get_case_by_id


router = APIRouter(prefix="/cases", tags=["cases"])


@router.get("/", response_model=List[Case])
async def get_all_cases():
    """Get all available cases for trial simulation.

    Returns:
        List of all available cases (sample + generated)
    """
    try:
        return get_shared_cases()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to load cases: {str(e)}")


@router.get("/{case_id}", response_model=Case)
async def get_case_by_id(case_id: UUID):
    """Get a specific case by ID.

    Args:
        case_id: UUID of the case to retrieve

    Returns:
        The requested case

    Raises:
        HTTPException: If case not found
    """
    try:
        return get_case_by_id(str(case_id))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to retrieve case: {str(e)}")


@router.get("/category/{category}", response_model=List[Case])
async def get_cases_by_category(category: str):
    """Get cases filtered by category.

    Args:
        category: Case category (white-collar, violent, drug, property, cybercrime)

    Returns:
        List of cases in the specified category
    """
    try:
        all_cases = get_shared_cases()

        # Simple category mapping based on case titles/descriptions
        category_keywords = {
            "white-collar": ["embezzlement", "fraud", "thompson"],
            "violent": ["assault", "domestic", "violence", "rivera"],
            "drug": ["drug", "possession", "harris"],
            "property": ["burglary", "theft", "lopez"],
            "cybercrime": ["hacking", "identity", "cyber", "chen"]
        }

        if category not in category_keywords:
            raise HTTPException(status_code=400, detail="Invalid category")

        keywords = category_keywords[category]
        filtered_cases = []

        for case in all_cases:
            case_text = f"{case.title} {case.description}".lower()
            if any(keyword in case_text for keyword in keywords):
                filtered_cases.append(case)

        return filtered_cases

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to filter cases: {str(e)}")


@router.get("/search/{query}", response_model=List[Case])
async def search_cases(query: str):
    """Search cases by title, description, or charges.

    Args:
        query: Search query string

    Returns:
        List of cases matching the search query
    """
    try:
        all_cases = get_shared_cases()
        query_lower = query.lower()

        matching_cases = []

        for case in all_cases:
            # Search in title, description, and charges
            searchable_text = f"{case.title} {case.description} {' '.join(case.charges)}".lower(
            )

            if query_lower in searchable_text:
                matching_cases.append(case)

        return matching_cases

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
