import streamlit as st
from backend.database import get_empresas, create_empresa

def render_select_company():
    st.markdown("<h1 style='text-align: center; color: #F5A623;'>🏗️ Gestión de Licitaciones</h1>", unsafe_allow_html=True)
    st.markdown("<p style='text-align: center; font-size: 1.1em; color: #555;'>Bienvenido al portal operativo. Selecciona una empresa del portafolio o registra una nueva constructora para comenzar.</p>", unsafe_allow_html=True)
    st.write("---")
    
    empresas = get_empresas()
    
    if 'show_register_form' not in st.session_state:
        st.session_state.show_register_form = False

    if not st.session_state.show_register_form:
        col_s1, col_center, col_s3 = st.columns([1, 2, 1])
        
        with col_center:
            with st.container(border=True):
                st.markdown("<h3 style='text-align: center;'>Seleccionar Portafolio</h3>", unsafe_allow_html=True)
                st.write("<div style='text-align: center;'>Accede a los documentos y Bóveda de una empresa existente.</div>", unsafe_allow_html=True)
                st.write("")
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
                
                st.write("---")
                if st.button("➕ Registrar Nueva Empresa", use_container_width=True):
                    st.session_state.show_register_form = True
                    st.rerun()
    else:
        # Modo de registro
        if st.button("⬅️ Volver al Portafolio"):
            st.session_state.show_register_form = False
            st.rerun()
            
        with st.container(border=True):
            st.markdown("### Alta de Nueva Empresa")
            st.write("Registra una nueva entidad legal para licitaciones.")
            with st.form("form_nueva_empresa", clear_on_submit=True):
                st.markdown("#### Perfil")
                c1, c2, c3 = st.columns(3)
                nombre = c1.text_input("Razón Social *")
                rfc = c2.text_input("RFC *")
                num_padron = c3.text_input("Padrón de Contratista")
                
                st.markdown("#### Domicilio Fiscal")
                d1, d2, d3, d4 = st.columns([2, 1, 1, 2])
                calle = d1.text_input("Calle")
                num_ext = d2.text_input("Num. Ext")
                num_int = d3.text_input("Num. Int")
                colonia = d4.text_input("Colonia")
                
                d5, d6, d7 = st.columns([1, 2, 2])
                cp = d5.text_input("C.P.")
                municipio = d6.text_input("Municipio")
                estado = d7.text_input("Estado")
                
                st.markdown("#### Contacto y Legal")
                co1, co2 = st.columns(2)
                email = co1.text_input("Correo Electrónico")
                telefono = co2.text_input("Teléfono")
                objeto_social = st.text_area("Objeto Social")
                
                st.markdown("#### Administración")
                a1, a2 = st.columns(2)
                admin_unico = a1.text_input("Administrador Único")
                rfc_admin = a2.text_input("RFC Administrador Único")
                a3, a4 = st.columns(2)
                rep = a3.text_input("Representante Legal")
                rfc_rep = a4.text_input("RFC Representante Legal")
                
                st.markdown("#### Socios")
                if 'num_socios_form' not in st.session_state:
                    st.session_state.num_socios_form = 0
                
                # Botones para controlar dinámicamente la cantidad de socios
                btn_col1, btn_col2, btn_col_spacer = st.columns([2, 2, 8])
                add_socio = btn_col1.form_submit_button("➕ Agregar Socio")
                rem_socio = btn_col2.form_submit_button("➖ Quitar Socio")
                
                if add_socio:
                    st.session_state.num_socios_form += 1
                    st.rerun()
                if rem_socio and st.session_state.num_socios_form > 0:
                    st.session_state.num_socios_form -= 1
                    st.rerun()

                socios_data = []
                for i in range(st.session_state.num_socios_form):
                    s1, s2 = st.columns(2)
                    s_nom = s1.text_input(f"Nombre del Socio {i+1}", key=f"s_nom_{i}")
                    s_rfc = s2.text_input(f"RFC del Socio {i+1}", key=f"s_rfc_{i}")
                    socios_data.append({"nombre": s_nom, "rfc": s_rfc})
                
                st.write("")
                submit = st.form_submit_button("Crear Perfil y Entrar", type="primary", use_container_width=True)
                
                if submit:
                    if nombre and rfc:
                        data = {
                            "nombre": nombre, "rfc": rfc, "num_padron": num_padron,
                            "calle": calle, "num_ext": num_ext, "num_int": num_int, "colonia": colonia,
                            "cp": cp, "municipio": municipio, "estado": estado,
                            "email": email, "telefono": telefono, "objeto_social": objeto_social,
                            "admin_unico": admin_unico, "rfc_admin_unico": rfc_admin,
                            "representante": rep, "rfc_representante": rfc_rep
                        }
                        ok, msg, new_id = create_empresa(data)
                        if ok:
                            from backend.database import agregar_socio
                            # Insert socios
                            for s in socios_data:
                                if s["nombre"]:
                                    agregar_socio(new_id, s["nombre"], s["rfc"])
                                    
                            st.success("¡Empresa registrada con éxito!")
                            st.session_state.show_register_form = False
                            nuevas_empresas = get_empresas()
                            empresa_creada = next((e for e in nuevas_empresas if e['id'] == new_id), None)
                            if empresa_creada:
                                st.session_state.empresa_activa = empresa_creada
                                st.rerun()
                        else:
                            st.error(f"Error: {msg}")
                    else:
                        st.warning("Los campos Razón Social y RFC son obligatorios.")
