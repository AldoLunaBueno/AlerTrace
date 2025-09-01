#!/usr/bin/env python3
"""
Script simple de migraciones para SachaTrace
Ejecuta archivos SQL en orden numérico
"""

import os
import psycopg2
from pathlib import Path
import sys

def get_db_connection():
    """Conecta a la base de datos usando variables de entorno"""
    try:
        return psycopg2.connect(
            host=os.getenv('POSTGRES_HOST', 'localhost'),
            port=os.getenv('POSTGRES_PORT', '5432'),
            user=os.getenv('POSTGRES_USER', 'postgres'),
            password=os.getenv('POSTGRES_PASSWORD', ''),
            database=os.getenv('POSTGRES_DB', 'sachatrace_dev')
        )
    except Exception as e:
        print(f"❌ Error conectando a la base de datos: {e}")
        sys.exit(1)

def create_migrations_table(conn):
    """Crea tabla para tracking de migraciones"""
    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version VARCHAR(255) PRIMARY KEY,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
    conn.commit()

def get_applied_migrations(conn):
    """Obtiene lista de migraciones ya aplicadas"""
    with conn.cursor() as cur:
        cur.execute("SELECT version FROM schema_migrations ORDER BY version;")
        return [row[0] for row in cur.fetchall()]

def get_pending_migrations(applied_migrations):
    """Obtiene lista de migraciones pendientes"""
    migrations_dir = Path(__file__).parent / "migrations"
    if not migrations_dir.exists():
        print(f"❌ Directorio de migraciones no encontrado: {migrations_dir}")
        return []
    
    all_migrations = sorted([
        f.stem for f in migrations_dir.glob("*.sql")
        if f.stem not in applied_migrations
    ])
    
    return all_migrations

def apply_migration(conn, migration_file):
    """Aplica una migración específica"""
    migrations_dir = Path(__file__).parent / "migrations"
    file_path = migrations_dir / f"{migration_file}.sql"
    
    if not file_path.exists():
        print(f"❌ Archivo de migración no encontrado: {file_path}")
        return False
    
    print(f"🔄 Aplicando migración: {migration_file}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        with conn.cursor() as cur:
            # Ejecutar el SQL de la migración
            cur.execute(sql_content)
            
            # Marcar como aplicada
            cur.execute(
                "INSERT INTO schema_migrations (version) VALUES (%s);",
                (migration_file,)
            )
        
        conn.commit()
        print(f"✅ Migración aplicada: {migration_file}")
        return True
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error aplicando migración {migration_file}: {e}")
        return False

def main():
    print("🚀 SachaTrace - Sistema de Migraciones")
    print("=" * 40)
    
    # Conectar a la base de datos
    conn = get_db_connection()
    
    # Crear tabla de migraciones si no existe
    create_migrations_table(conn)
    
    # Obtener migraciones aplicadas y pendientes
    applied = get_applied_migrations(conn)
    pending = get_pending_migrations(applied)
    
    if not pending:
        print("✅ No hay migraciones pendientes")
        return
    
    print(f"📋 Migraciones pendientes: {len(pending)}")
    for migration in pending:
        print(f"  - {migration}")
    
    # Confirmar aplicación
    response = input(f"\n¿Aplicar {len(pending)} migración(es)? (y/N): ")
    if response.lower() != 'y':
        print("❌ Migración cancelada")
        return
    
    # Aplicar migraciones
    for migration in pending:
        if not apply_migration(conn, migration):
            print(f"❌ Deteniendo proceso por error en: {migration}")
            break
    
    conn.close()
    print("\n🎉 ¡Migraciones completadas!")

if __name__ == "__main__":
    main()
