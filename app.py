import streamlit as st
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# 1. Cargar las llaves secretas del archivo .env
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

# 2. Inicializar el cliente de conexión a Supabase
try:
    supabase: Client = create_client(url, key)
    conexion_exitosa = True
except Exception as e:
    conexion_exitosa = False
    error_msg = str(e)

# 3. Configuración visual de Streamlit
st.set_page_config(page_title="Sistema de Licitaciones", page_icon="🏗️", layout="wide")
st.title("🏗️ Sistema de Gestión de Licitaciones")

with st.sidebar:
    st.write("🔧 **Menú Principal**")
    st.write("Sprint 2: Base de Datos")

# 4. Mostrar el estatus de la conexión en pantalla
if conexion_exitosa:
    st.success("¡Conexión exitosa a Supabase! El cerebro en la nube está respondiendo perfectamente. 🔌⚡")
    
    # Intento de leer la tabla empresas para probar que todo marche bien
    try:
        respuesta = supabase.table("empresas").select("*").execute()
        st.info(f"Tabla 'empresas' detectada correctamente. Registros actuales: {len(respuesta.data)}")
    except Exception as db_err:
        st.error(f"Error al leer la tabla: {db_err}")
else:
    st.error(f"No se pudo establecer la conexión. Revisa tus llaves en el archivo .env. Error: {error_msg}")