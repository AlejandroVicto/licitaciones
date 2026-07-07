import streamlit as st

# 1. Configuración básica de la pestaña del navegador
st.set_page_config(
    page_title="Sistema de Licitaciones", 
    page_icon="🏗️", 
    layout="wide"
)

# 2. Título principal de tu aplicación
st.title("🏗️ Sistema de Gestión de Licitaciones")
st.subheader("Bienvenido al panel de control de tu Constructora")

# 3. Un panel lateral (Sidebar) para futuros menús
with st.sidebar:
    st.write("🔧 **Menú Principal**")
    st.write("Por ahora estamos en construcción...")

# 4. Mensaje de éxito en la pantalla principal
st.success("¡Felicidades! Tu entorno local y Streamlit están funcionando a la perfección.")
st.info("Sprint 1 completado. Listos para conectar la Base de Datos.")