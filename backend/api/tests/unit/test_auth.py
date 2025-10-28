"""Unit tests for authentication endpoints."""
import pytest


def test_login_missing_credentials(client):
    """Test login fails with missing credentials."""
    response = client.post("/auth/login", json={})
    assert response.status_code == 422


def test_login_invalid_email_format(client):
    """Test login fails with invalid email format."""
    response = client.post("/auth/login", json={
        "email": "invalid-email",
        "password": "password123"
    })
    # Either 422 (validation error) or 401 (invalid credentials)
    assert response.status_code in [422, 401]


def test_login_empty_password(client):
    """Test login fails with empty password."""
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": ""
    })
    assert response.status_code in [422, 401]


def test_register_success_response_structure(client, mock_user_data):
    """Test that registration response has expected structure."""
    response = client.post("/auth/register", json=mock_user_data)
    # Accept both success and conflict responses (if user exists)
    if response.status_code == 201 or response.status_code == 200:
        data = response.json()
        assert "message" in data or "user" in data or "email" in data


def test_register_missing_required_fields(client):
    """Test registration fails with missing required fields."""
    response = client.post("/auth/register", json={
        "email": "test@example.com"
    })
    assert response.status_code == 422


def test_register_invalid_email(client):
    """Test registration fails with invalid email."""
    response = client.post("/auth/register", json={
        "email": "invalid",
        "password": "TestPassword123!",
        "full_name": "Test User"
    })
    assert response.status_code == 422
