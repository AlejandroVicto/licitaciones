import streamlit as st
from backend.document_engine import generate_document

def render_doc_gen_view():
    st.markdown("## 📄 Generador de Documentos")
    st.caption("Módulo de autocompletado de machotes para licitación")
    empresa = st.session_state.empresa_activa
    
    with st.container(border=True):
        st.write(f"Empresa objetivo: **{empresa.get('nombre')}**")
        st.info("💡 Este módulo inyectará el RFC y Representante Legal de la empresa actual dentro de la plantilla maestra (Word).")
        
        col1, col2 = st.columns([1, 1])
        with col1:
            if st.button("⚙️ Procesar Plantilla de Licitación", type="primary", use_container_width=True):
                with st.spinner("Procesando documento..."):
                    bytes_docx, nombre_o_error = generate_document(empresa)
                    
                    if bytes_docx:
                        st.session_state['docx_descarga'] = bytes_docx
                        st.session_state['docx_nombre'] = nombre_o_error
                        st.session_state['docx_empresa'] = empresa.get('id', empresa.get('rfc'))
                        st.success("¡Documento procesado exitosamente!")
                    else:
                        st.error(nombre_o_error)
                
        with col2:
            empresa_id = empresa.get('id', empresa.get('rfc'))
            if 'docx_descarga' in st.session_state and st.session_state.get('docx_empresa') == empresa_id:
                st.download_button(
                    label="📥 Descargar Escrito en Word (.docx)",
                    data=st.session_state['docx_descarga'],
                    file_name=st.session_state['docx_nombre'],
                    mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    type="primary",
                    use_container_width=True
                )
