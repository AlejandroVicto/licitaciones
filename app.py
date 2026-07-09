import streamlit as st
from backend.connection import conexion_ok
from frontend.components.sidebar import render_sidebar
from frontend.views.select_company import render_select_company
from frontend.views.info_view import render_info_view
from frontend.views.doc_gen_view import render_doc_gen_view
from frontend.views.boveda_view import render_boveda_view
from frontend.views.edit_company import render_edit_company

st.set_page_config(page_title="Sistema de Licitaciones", page_icon="🏗️", layout="wide")

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
    opcion = render_sidebar()
    
    if opcion == "Información Básica":
        render_info_view()
    elif opcion == "Generar Documentos":
        render_doc_gen_view()
    elif opcion == "Guía de Documentos":
        render_boveda_view(modo="guia")
    elif opcion == "Subir y Actualizar":
        render_boveda_view(modo="subir")
    elif opcion == "Explorar y Descargar":
        render_boveda_view(modo="descargar")
    elif opcion == "Bóveda Digital":
        # Render empty or default since it's just the parent folder now
        st.info("👈 Selecciona 'Subir y Actualizar' o 'Explorar y Descargar' en el menú lateral.")
    elif opcion == "Editar Empresa":
        render_edit_company()