import pytest


def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert "uptime" in data or "message" in data


def test_health_check_contains_required_fields(client):
    """Test that health check response contains required fields."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()

    required_fields = ["status"]
    for field in required_fields:
        assert field in data, f"Missing required field: {field}"


def test_health_status_is_string(client):
    """Test that health status is a valid string value."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["status"], str)
    assert data["status"] in ["healthy", "ok", "up"]
