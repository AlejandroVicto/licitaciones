import streamlit as st
import streamlit_antd_components as sac
#Barra lateral de la aplicación 
def render_sidebar():
    with st.sidebar:
        st.markdown(
            f"""
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #F5A623; margin-bottom: 0;">🏗️ Licitaciones</h2>
                <h4 style="color: #666; font-weight: normal; margin-top: 5px;">{st.session_state.empresa_activa['nombre']}</h4>
            </div>
            """,
            unsafe_allow_html=True
        )
        
        opcion = sac.menu([
            sac.MenuItem('Información Básica', icon='info-circle'),
            sac.MenuItem('Generar Documentos', icon='file-earmark-word'),
            sac.MenuItem('Bóveda Digital', icon='cloud-arrow-down', children=[
                sac.MenuItem('Guía de Documentos', icon='book'),
                sac.MenuItem('Subir y Actualizar', icon='cloud-upload'),
                sac.MenuItem('Explorar y Descargar', icon='folder2-open'),
            ]),
            sac.MenuItem('Editar Empresa', icon='pencil-square'),
        ], color='#F5A623', open_all=False, size='md')
        
        st.divider()
        if st.button(" Cambiar Empresa", use_container_width=True):
            st.session_state.empresa_activa = None
            st.rerun()
            
    return opcion
