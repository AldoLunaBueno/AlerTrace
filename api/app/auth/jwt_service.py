from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from ..config import settings

# Context for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class JWTService:
    """Service for JWT token handling and authentication"""
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Generate JWT token with user data and expiration time"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.jwt_access_token_expire_minutes)
            
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.jwt_secret_key, 
            algorithm=settings.jwt_algorithm
        )
        
        return encoded_jwt

    @staticmethod
    def verify_token(token: str) -> Optional[dict]:
        """Verify and decode JWT token, returning None if invalid or expired"""
        try:
            payload = jwt.decode(
                token, 
                settings.jwt_secret_key, 
                algorithms=[settings.jwt_algorithm]
            )
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except JWTError:
            return None

    @staticmethod
    def hash_password(password: str) -> str:
        """Generate secure password hash using bcrypt"""
        # Truncar password a 72 bytes para bcrypt
        if len(password.encode('utf-8')) > 72:
            password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify if password matches its hash"""
        try:
            # Truncar password a 72 bytes para bcrypt
            if len(plain_password.encode('utf-8')) > 72:
                plain_password = plain_password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
            return pwd_context.verify(plain_password, hashed_password)
        except:
            # Fallback para hashes SHA256 (temporalmente para usuarios demo)
            import hashlib
            return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

# Global service instance
jwt_service = JWTService()