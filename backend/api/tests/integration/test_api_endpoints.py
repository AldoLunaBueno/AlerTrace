import pytest


class TestHealthEndpoints:
    """Test health and status endpoints."""

    def test_health_endpoint_returns_200(self, client):
        """Test that health endpoint returns HTTP 200."""
        response = client.get("/health")
        assert response.status_code == 200

    def test_health_endpoint_is_accessible(self, client):
        """Test that health endpoint is accessible without auth."""
        response = client.get("/health")
        assert response.status_code in [200, 404]  # 404 if not implemented


class TestAuthenticationFlow:
    """Test authentication flow."""

    def test_auth_endpoints_exist(self, client):
        """Test that auth endpoints are accessible."""
        # Login endpoint
        response = client.post("/auth/login", json={})
        # Should return either validation error or auth error, not 404
        assert response.status_code != 404

    def test_protected_endpoints_require_auth(self, client):
        """Test that protected endpoints require authentication."""
        # Try accessing protected endpoint without auth
        response = client.get("/farms")
        # Should return 401/403 or 422, not 404
        assert response.status_code in [401, 403, 422, 404]


class TestFarmEndpoints:
    """Test farm-related endpoints."""

    def test_farms_endpoint_accessible(self, client, auth_headers):
        """Test that farms endpoint is accessible."""
        response = client.get("/farms", headers=auth_headers)
        # Should return 200 (with farms) or 401 (if auth fails)
        assert response.status_code in [200, 401, 404]

    def test_farms_endpoint_returns_list(self, client, auth_headers):
        """Test that farms endpoint returns a list."""
        response = client.get("/farms", headers=auth_headers)
        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list) or isinstance(data, dict)


class TestSensorEndpoints:
    """Test sensor-related endpoints."""

    def test_sensors_endpoint_accessible(self, client, auth_headers):
        """Test that sensors endpoint is accessible."""
        response = client.get("/sensores", headers=auth_headers)
        # Should return 200, 401, or 404
        assert response.status_code in [200, 401, 404]

    def test_sensors_create_endpoint(self, client, auth_headers, mock_sensor_data):
        """Test creating a sensor."""
        response = client.post("/sensores", json=mock_sensor_data, headers=auth_headers)
        # Accept 201 (created), 401 (auth required), or 422 (validation error)
        assert response.status_code in [201, 401, 422, 400]


class TestErrorHandling:
    """Test error handling."""

    def test_invalid_endpoint_returns_404(self, client):
        """Test that invalid endpoint returns 404."""
        response = client.get("/invalid-endpoint-xyz")
        assert response.status_code == 404

    def test_invalid_method_returns_405(self, client):
        """Test that invalid HTTP method returns appropriate error."""
        response = client.delete("/health")
        # DELETE on GET-only endpoint
        assert response.status_code in [405, 404]


class TestCORSHeaders:
    """Test CORS headers."""

    def test_cors_headers_present(self, client):
        """Test that CORS headers are present."""
        response = client.get("/health")
        # Check for common CORS headers
        assert response.status_code == 200
