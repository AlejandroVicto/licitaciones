import streamlit as st
from backend.storage import upload_document, list_documents, download_document

def render_boveda_view():
    st.markdown("## 🗄️ Bóveda Digital")
    st.caption("Repositorio seguro en la nube (Supabase Storage) para documentación legal.")
    empresa = st.session_state.empresa_activa
    empresa_id = empresa.get('id', empresa.get('rfc'))
    
    st.write("---")
    
    col1, col2 = st.columns([1.2, 1])
    
    with col1:
        with st.container(border=True):
            st.markdown("#### 📤 Subir Nuevo Documento")
            st.write("El archivo reemplazará a cualquier documento previo del mismo tipo.")
            tipo_documento = st.selectbox(
                "Clasificación del Documento:", 
                ["Constancia_SAT", "INE_Representante", "Acta_Constitutiva", "Comprobante_Domicilio", "Opinion_Cumplimiento"]
            )
            
            archivo_subir = st.file_uploader("Selecciona un archivo (Solo PDF)", type=['pdf'])
            
            if st.button("Subir a la Bóveda ☁️", type="primary"):
                if archivo_subir is not None:
                    with st.spinner("Subiendo a Supabase..."):
                        file_bytes = archivo_subir.getvalue()
                        ok, msg = upload_document(empresa_id, tipo_documento, file_bytes)
                        if ok:
                            st.success(f"¡{tipo_documento}.pdf subido correctamente!")
                        else:
                            st.error(f"Error al subir: {msg}")
                else:
                    st.warning("⚠️ Selecciona un archivo PDF antes de presionar el botón.")
                
    with col2:
        with st.container(border=True):
            st.markdown("#### 📁 Archivos Resguardados")
            archivos = list_documents(empresa_id)
            
            if archivos:
                for arch in archivos:
                    with st.container():
                        c_file, c_btn = st.columns([7, 3])
                        with c_file:
                            st.write(f"📄 **{arch['name']}**")
                        with c_btn:
                            try:
                                bytes_pdf = download_document(empresa_id, arch['name'])
                                if bytes_pdf:
                                    st.download_button(
                                        label="⬇️ Descargar",
                                        data=bytes_pdf,
                                        file_name=arch['name'],
                                        mime="application/pdf",
                                        key=f"dl_btn_{empresa_id}_{arch['name']}",
                                        use_container_width=True
                                    )
                                else:
                                    st.error("Fallo")
                            except Exception:
                                st.error("Fallo")
                        st.markdown("<hr style='margin: 0.5em 0;'>", unsafe_allow_html=True)
            else:
                st.info("No hay documentos guardados para esta empresa.")
