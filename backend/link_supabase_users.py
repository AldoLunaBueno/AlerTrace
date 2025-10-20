#!/usr/bin/env python3
"""
Script para vincular trabajadores existentes con sus user_ids de Supabase Auth
"""

from supabase import create_client
from sqlalchemy.orm import Session
from api.config import settings
from database.connection import get_db
from database.models.database import Trabajador
import sys

def main():
    try:
        # Crear cliente de Supabase
        supabase = create_client(settings.supabase_url, settings.supabase_key)
        
        # Conectar a la base de datos local
        db = next(get_db())
        
        # Obtener todos los trabajadores con email
        trabajadores = db.query(Trabajador).filter(Trabajador.email.isnot(None)).all()
        
        print(f"🔍 Encontrados {len(trabajadores)} trabajadores con email")
        
        updated_count = 0
        for trabajador in trabajadores:
            try:
                # Obtener el user de Supabase por email
                response = supabase.auth.admin.get_user_by_email(trabajador.email)
                
                if response.user and response.user.id:
                    # Asignar el user_id a Supabase Auth
                    trabajador.user_id = response.user.id
                    db.add(trabajador)
                    print(f"✅ {trabajador.email} -> {response.user.id}")
                    updated_count += 1
                else:
                    print(f"⚠️  No se encontró user en Supabase para {trabajador.email}")
                    
            except Exception as e:
                print(f"❌ Error procesando {trabajador.email}: {e}")
        
        db.commit()
        print(f"\n✅ Se actualizaron {updated_count} trabajadores")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    sys.path.insert(0, '/app')
    success = main()
    sys.exit(0 if success else 1)
