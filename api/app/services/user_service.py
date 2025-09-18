from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional
from ..models.database import Usuario
from ..auth.jwt_service import jwt_service

class UserService:
    """Servicio para manejo de usuarios y autenticación"""
    def __init__(self, db: Session):
        self.db = db
    
    def get_user_by_username(self, username: str) -> Optional[Usuario]:
        """Busca un usuario activo por su nombre de usuario"""
        return self.db.query(Usuario).filter(
            and_(
                Usuario.username == username,
                Usuario.activo == True
            )
        ).first()
    
    def get_user_by_id(self, user_id: int) -> Optional[Usuario]:
        """Busca un usuario activo por su ID"""
        return self.db.query(Usuario).filter(
            and_(
                Usuario.id_usuario == user_id,
                Usuario.activo == True
            )
        ).first()
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verifica una contraseña contra su hash almacenado"""
        return jwt_service.verify_password(plain_password, hashed_password)
    
    def create_user(self, username: str, password: str, nombre: str, 
                   email: str, rol: str = "agricultor") -> Usuario:
        """Crea un nuevo usuario con contraseña hasheada"""
        # Hash de la contraseña
        password_hash = jwt_service.hash_password(password)
        
        # Crear usuario
        user = Usuario(
            username=username,
            password_hash=password_hash,
            nombre=nombre,
            email=email,
            rol=rol
        )
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        
        return user
    
    def authenticate_user(self, username: str, password: str) -> Optional[Usuario]:
        """Autentica un usuario validando credenciales contra la base de datos"""
        user = self.get_user_by_username(username)
        if user and jwt_service.verify_password(password, user.password_hash):
            return user
        return None