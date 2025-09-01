"""Base model classes."""

from datetime import datetime
from typing import Any, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel as PydanticBaseModel, Field


class BaseModel(PydanticBaseModel):
    """Base model with common fields and configuration."""

    id: UUID = Field(default_factory=uuid4, description="Unique identifier")
    created_at: datetime = Field(
        default_factory=datetime.utcnow, description="Creation timestamp")
    updated_at: Optional[datetime] = Field(
        default=None, description="Last update timestamp")

    class Config:
        """Pydantic configuration."""
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            UUID: lambda v: str(v),
        }
        use_enum_values = True
        validate_assignment = True

    def dict(self, **kwargs: Any) -> dict[str, Any]:
        """Convert model to dictionary with proper serialization."""
        data = super().dict(**kwargs)
        # Convert UUIDs to strings for JSON serialization
        if isinstance(data.get("id"), UUID):
            data["id"] = str(data["id"])
        return data
