import streamlit as st

def render_info_view():
    empresa = st.session_state.empresa_activa
    st.markdown(f"## 🏢 Resumen: {empresa.get('nombre', '')}")
    st.caption("Panel de control de la entidad legal seleccionada")
    
    st.write("---")
    
    with st.container(border=True):
        col1, col2, col3 = st.columns(3)
        col1.metric(label="📄 Razón Social", value=empresa.get('nombre', '-'))
        col2.metric(label="🆔 RFC", value=empresa.get('rfc', '-'))
        col3.metric(label="👤 Representante Legal", value=empresa.get('representante', '-'))
    
    st.write("---")
    
    # Añadir un poco de texto descriptivo del flujo de trabajo
    st.markdown("""
    ### 📌 Flujo de Trabajo Operativo
    1. **Generar Documentos:** Ve a esta sección para autocompletar machotes en formato Word (`.docx`) usando los datos fiscales de esta empresa.
    2. **Bóveda Digital:** Utiliza el repositorio en la nube para resguardar las constancias, identificaciones y actas oficiales de la empresa.
    3. **Editar Empresa:** Mantén la información fiscal siempre actualizada para la elaboración de propuestas técnicas y económicas.
    """)
