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

def create_empresa(nombre, rfc, representante):
    if not conexion_ok:
        return False, "Sin conexión a la base de datos"
    try:
        nueva_empresa = {
            "nombre": nombre,
            "rfc": rfc.upper(),
            "representante": representante
        }
        supabase.table("empresas").insert(nueva_empresa).execute()
        return True, "Empresa creada exitosamente"
    except Exception as e:
        return False, str(e)

def update_empresa(identificador, nombre, rfc, representante):
    if not conexion_ok:
        return False, "Sin conexión a la base de datos"
    try:
        data = {
            "nombre": nombre,
            "rfc": rfc.upper(),
            "representante": representante
        }
        if isinstance(identificador, int) or str(identificador).isdigit():
            supabase.table("empresas").update(data).eq("id", identificador).execute()
        else:
            supabase.table("empresas").update(data).eq("rfc", identificador).execute()
        return True, "Empresa actualizada exitosamente"
    except Exception as e:
        return False, str(e)
