import streamlit as st
from backend.connection import conexion_ok
from frontend.components.sidebar import render_sidebar
from frontend.views.select_company import render_select_company
from frontend.views.info_view import render_info_view
from frontend.views.doc_gen_view import render_doc_gen_view
from frontend.views.boveda_view import render_boveda_view
from frontend.views.edit_company import render_edit_company

st.set_page_config(page_title="Sistema de Licitaciones", page_icon="🏗️", layout="wide")

# Inyectar CSS global
try:
    with open("frontend/styles/main.css") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)
except FileNotFoundError:
    pass

if not conexion_ok:
    st.error("Error: No se pudo conectar a Supabase. Verifica tus credenciales en el archivo .env")
    st.stop()

# Inicializar estado de la sesión
if 'empresa_activa' not in st.session_state:
    st.session_state.empresa_activa = None

# Enrutador principal
if st.session_state.empresa_activa is None:
    render_select_company()
else:
    if 'vista_actual' not in st.session_state:
        st.session_state.vista_actual = "Información Básica"
        
    opcion = render_sidebar()
    
    # Si la opción es una vista real, actualizamos la vista activa
    vistas_validas = ["Información Básica", "Generar Documentos", "Guía de Documentos", "Subir y Actualizar", "Explorar y Descargar", "Editar Empresa"]
    if opcion in vistas_validas:
        st.session_state.vista_actual = opcion
        
    # Renderizamos la vista activa, pase lo que pase
    vista = st.session_state.vista_actual
    
    if vista == "Información Básica":
        render_info_view()
    elif vista == "Generar Documentos":
        render_doc_gen_view()
    elif vista == "Guía de Documentos":
        render_boveda_view(modo="guia")
    elif vista == "Subir y Actualizar":
        render_boveda_view(modo="subir")
    elif vista == "Explorar y Descargar":
        render_boveda_view(modo="descargar")
    elif vista == "Editar Empresa":
        render_edit_company()