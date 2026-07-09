import streamlit as st
from backend.database import update_empresa, get_empresa_by_id

def render_edit_company():
    st.markdown("## ✏️ Edición de Perfil Fiscal")
    st.caption("Actualiza los datos corporativos para la generación de machotes.")
    empresa = st.session_state.empresa_activa
    identificador = empresa.get('id', empresa.get('rfc'))
    
    with st.container(border=True):
        with st.form("form_editar"):
            st.markdown("#### Datos de la Entidad")
            nuevo_nombre = st.text_input("Razón Social:", value=empresa.get('nombre', ''))
            
            col1, col2 = st.columns(2)
            with col1:
                nuevo_rfc = st.text_input("RFC:", value=empresa.get('rfc', ''))
            with col2:
                nuevo_rep = st.text_input("Representante Legal:", value=empresa.get('representante', ''))
            
            st.write("")
            if st.form_submit_button("Guardar Cambios 💾", type="primary"):
                with st.spinner("Guardando en base de datos..."):
                    ok, msg = update_empresa(identificador, nuevo_nombre, nuevo_rfc, nuevo_rep)
                    if ok:
                        st.success("¡Información actualizada exitosamente!")
                        empresa_actualizada = get_empresa_by_id(identificador)
                        if empresa_actualizada:
                            st.session_state.empresa_activa = empresa_actualizada
                        st.rerun()
                    else:
                        st.error(f"Error: {msg}")
