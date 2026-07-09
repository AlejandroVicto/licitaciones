import streamlit as st
from backend.database import get_empresas, create_empresa

def render_select_company():
    st.markdown("<h1 style='text-align: center; color: #F5A623;'>🏗️ Gestión de Licitaciones</h1>", unsafe_allow_html=True)
    st.markdown("<p style='text-align: center; font-size: 1.1em; color: #555;'>Bienvenido al portal operativo. Selecciona una empresa del portafolio o registra una nueva constructora para comenzar.</p>", unsafe_allow_html=True)
    st.write("---")
    
    empresas = get_empresas()
    
    col1, col_space, col2 = st.columns([1, 0.1, 1])
    
    with col1:
        with st.container(border=True):
            st.markdown("### 🏢 Seleccionar Portafolio")
            st.write("Accede a los documentos y Bóveda de una empresa existente.")
            if empresas:
                empresas_dict = {e['nombre']: e for e in empresas}
                opciones = list(empresas_dict.keys())
                seleccion = st.selectbox("Elige una constructora:", opciones)
                
                st.write("") # Espaciador
                if st.button("Ingresar al Panel ➔", type="primary", use_container_width=True):
                    st.session_state.empresa_activa = empresas_dict[seleccion]
                    st.rerun()
            else:
                st.info("Aún no hay empresas registradas en la base de datos.")
            
    with col2:
        with st.container(border=True):
            st.markdown("### 📝 Alta de Nueva Empresa")
            st.write("Registra una nueva entidad legal para licitaciones.")
            with st.form("form_nueva_empresa", clear_on_submit=True):
                nombre = st.text_input("Razón Social:", placeholder="Ej. Constructora del Norte S.A.")
                rfc = st.text_input("RFC:", placeholder="XAXX010101000")
                rep = st.text_input("Representante Legal:", placeholder="Nombre completo")
                
                submit = st.form_submit_button("Crear Perfil y Entrar", type="primary", use_container_width=True)
                if submit:
                    if nombre and rfc and rep:
                        ok, msg = create_empresa(nombre, rfc, rep)
                        if ok:
                            st.success("¡Empresa registrada con éxito!")
                            nuevas_empresas = get_empresas()
                            empresa_creada = next((e for e in nuevas_empresas if e['rfc'] == rfc.upper()), None)
                            if empresa_creada:
                                st.session_state.empresa_activa = empresa_creada
                                st.rerun()
                        else:
                            st.error(f"Error: {msg}")
                    else:
                        st.warning("⚠️ Es necesario completar todos los campos del formulario.")
