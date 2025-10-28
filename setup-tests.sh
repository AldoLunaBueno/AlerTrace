#!/bin/bash
# Setup script for installing test dependencies

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend setup
cd backend

if [ ! -d "venv" ]; then
    python -m venv venv
fi

source venv/bin/activate

pip install pytest pytest-asyncio pytest-cov --quiet

# Frontend setup
cd ../front

pnpm install -D \
    jest \
    @types/jest \
    jest-environment-jsdom \
    @testing-library/react \
    @testing-library/jest-dom \
    @testing-library/user-event \
    --quiet


# Verify installation
cd ../backend
source venv/bin/activate
python -c "import pytest; print(f'✓ pytest {pytest.__version__}')" 2>/dev/null || echo "⚠ pytest not found"
python -c "import pytest_asyncio; print('✓ pytest-asyncio installed')" 2>/dev/null || echo "⚠ pytest-asyncio not found"

cd ../front
pnpm list jest @testing-library/react 2>/dev/null | grep -E "jest|testing-library" || echo "⚠ Jest/Testing Library not found"

echo -e "${GREEN} Setup complete${NC}"

