import streamlit as st
from streamlit_option_menu import option_menu

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
        
        opcion = option_menu(
            menu_title=None,
            options=["Información Básica", "Generar Documentos", "Bóveda Digital", "Editar Empresa"],
            icons=["info-circle", "file-earmark-word", "cloud-arrow-up", "pencil-square"],
            menu_icon="cast",
            default_index=0,
            styles={
                "container": {"padding": "0!important", "background-color": "transparent"},
                "icon": {"color": "inherit", "font-size": "18px"},
                "nav-link": {
                    "font-size": "16px",
                    "text-align": "left",
                    "margin": "5px 0px",
                    "--hover-color": "#eee"
                },
                "nav-link-selected": {"background-color": "#F5A623", "color": "white"},
            }
        )
        
        st.divider()
        if st.button("🚪 Cambiar Empresa", use_container_width=True):
            st.session_state.empresa_activa = None
            st.rerun()
            
    return opcion
