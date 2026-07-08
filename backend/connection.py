import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

try:
    if url and key:
        supabase: Client = create_client(url, key)
        conexion_ok = True
    else:
        supabase = None
        conexion_ok = False
except Exception:
    supabase = None
    conexion_ok = False
