"""Test main FastAPI application."""

import pytest
from fastapi.testclient import TestClient

from jurysane.main import app

client = TestClient(app)


def test_root():
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data


def test_health_check():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_api_docs():
    """Test API documentation is accessible."""
    response = client.get("/docs")
    assert response.status_code == 200
