from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from api.config import settings

# Contexto para el hashing de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class JWTService:
    """Servicio para manejo de tokens JWT y autenticación"""
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Generar token JWT con datos de usuario y tiempo de expiración"""
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
        """Verificar y decodificar token JWT, retorna None si es inválido o expirado"""
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
        """Generar hash seguro de contraseña"""
        # Truncar password a 72 bytes para bcrypt
        if len(password.encode('utf-8')) > 72:
            password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verificar si la contraseña coincide con su hash"""
        try:
            # Truncar password a 72 bytes para bcrypt
            if len(plain_password.encode('utf-8')) > 72:
                plain_password = plain_password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
            return pwd_context.verify(plain_password, hashed_password)
        except:
            # Fallback para hashes SHA256 (temporalmente para usuarios demo)
            import hashlib
            return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

# Instancia global del servicio
jwt_service = JWTService()