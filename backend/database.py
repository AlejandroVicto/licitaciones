import streamlit as st
from backend.connection import supabase, conexion_ok
#Funciones basicas de la base de datos
def get_empresas():
    if not conexion_ok:
        return []
    try:
        response = supabase.table("empresas").select("*").execute()
        return response.data if response.data else []
    except Exception as e:
        print(f"Error fetching empresas: {e}")
        return []

def get_empresa_by_id(empresa_id):
    if not conexion_ok:
        return None
    try:
        response = supabase.table("empresas").select("*").eq("id", empresa_id).execute()
        if response.data:
            return response.data[0]
        
        # Fallback to RFC if 'id' is not used
        response_rfc = supabase.table("empresas").select("*").eq("rfc", empresa_id).execute()
        if response_rfc.data:
            return response_rfc.data[0]
        return None
    except Exception as e:
        print(f"Error fetching empresa: {e}")
        return None

def create_empresa(data):
    if not conexion_ok:
        return False, "Sin conexión a la base de datos", None
    try:
        if "rfc" in data and data["rfc"]:
            data["rfc"] = data["rfc"].upper()
        # insert returning ID
        response = supabase.table("empresas").insert(data).execute()
        return True, "Empresa creada exitosamente", response.data[0]['id'] if response.data else None
    except Exception as e:
        return False, str(e), None

def update_empresa(identificador, data):
    if not conexion_ok:
        return False, "Sin conexión a la base de datos"
    try:
        if "rfc" in data and data["rfc"]:
            data["rfc"] = data["rfc"].upper()
            
        if isinstance(identificador, int) or str(identificador).isdigit():
            supabase.table("empresas").update(data).eq("id", identificador).execute()
        else:
            supabase.table("empresas").update(data).eq("rfc", identificador).execute()
        return True, "Empresa actualizada exitosamente"
    except Exception as e:
        return False, str(e)

@st.cache_data(show_spinner=False)
def obtener_socios(empresa_id):
    if not conexion_ok:
        return []
    try:
        response = supabase.table("socios").select("*").eq("empresa_id", empresa_id).execute()
        return response.data if response.data else []
    except Exception as e:
        print(f"Error fetching socios: {e}")
        return []

def agregar_socio(empresa_id, nombre, rfc):
    if not conexion_ok:
        return False, "Sin conexión a la base de datos"
    try:
        nuevo_socio = {
            "empresa_id": empresa_id,
            "nombre": nombre,
            "rfc": rfc.upper() if rfc else ""
        }
        supabase.table("socios").insert(nuevo_socio).execute()
        return True, "Socio agregado exitosamente"
    except Exception as e:
        return False, str(e)

def eliminar_socio(socio_id):
    if not conexion_ok:
        return False, "Sin conexión a la base de datos"
    try:
        supabase.table("socios").delete().eq("id", socio_id).execute()
        return True, "Socio eliminado exitosamente"
    except Exception as e:
        return False, str(e)
