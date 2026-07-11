import streamlit as st
from backend.database import update_empresa, get_empresa_by_id, obtener_socios, agregar_socio, eliminar_socio

def render_edit_company():
    st.markdown("## Edición de Perfil Fiscal")
    st.caption("Actualiza los datos corporativos.")
    empresa = st.session_state.empresa_activa
    identificador = empresa.get('id', empresa.get('rfc'))
    
    with st.expander("Editar Empresa", expanded=True):
        with st.form("form_editar"):
            st.markdown("#### Perfil")
            c1, c2, c3 = st.columns(3)
            nuevo_nombre = c1.text_input("Razón Social *", value=empresa.get('nombre', ''))
            nuevo_rfc = c2.text_input("RFC *", value=empresa.get('rfc', ''))
            nuevo_num_padron = c3.text_input("Padrón de Contratista", value=empresa.get('num_padron', ''))
            
            st.markdown("#### Domicilio Fiscal")
            d1, d2, d3, d4 = st.columns([2, 1, 1, 2])
            nueva_calle = d1.text_input("Calle", value=empresa.get('calle', ''))
            nuevo_num_ext = d2.text_input("Num. Ext", value=empresa.get('num_ext', ''))
            nuevo_num_int = d3.text_input("Num. Int", value=empresa.get('num_int', ''))
            nueva_colonia = d4.text_input("Colonia", value=empresa.get('colonia', ''))
            
            d5, d6, d7 = st.columns([1, 2, 2])
            nuevo_cp = d5.text_input("C.P.", value=empresa.get('cp', ''))
            nuevo_municipio = d6.text_input("Municipio", value=empresa.get('municipio', ''))
            nuevo_estado = d7.text_input("Estado", value=empresa.get('estado', ''))
            
            st.markdown("#### Contacto y Legal")
            co1, co2 = st.columns(2)
            nuevo_email = co1.text_input("Correo Electrónico", value=empresa.get('email', ''))
            nuevo_telefono = co2.text_input("Teléfono", value=empresa.get('telefono', ''))
            nuevo_objeto = st.text_area("Objeto Social", value=empresa.get('objeto_social', ''))
            
            st.markdown("#### Administración")
            a1, a2 = st.columns(2)
            nuevo_admin = a1.text_input("Administrador Único", value=empresa.get('admin_unico', ''))
            nuevo_rfc_admin = a2.text_input("RFC Administrador Único", value=empresa.get('rfc_admin_unico', ''))
            a3, a4 = st.columns(2)
            nuevo_rep = a3.text_input("Representante Legal", value=empresa.get('representante', ''))
            nuevo_rfc_rep = a4.text_input("RFC Representante Legal", value=empresa.get('rfc_representante', ''))
            
            st.write("")
            if st.form_submit_button("Guardar Cambios", type="primary"):
                if nuevo_nombre and nuevo_rfc:
                    with st.spinner("Guardando en base de datos..."):
                        data = {
                            "nombre": nuevo_nombre, "rfc": nuevo_rfc, "num_padron": nuevo_num_padron,
                            "calle": nueva_calle, "num_ext": nuevo_num_ext, "num_int": nuevo_num_int, "colonia": nueva_colonia,
                            "cp": nuevo_cp, "municipio": nuevo_municipio, "estado": nuevo_estado,
                            "email": nuevo_email, "telefono": nuevo_telefono, "objeto_social": nuevo_objeto,
                            "admin_unico": nuevo_admin, "rfc_admin_unico": nuevo_rfc_admin,
                            "representante": nuevo_rep, "rfc_representante": nuevo_rfc_rep
                        }
                        ok, msg = update_empresa(identificador, data)
                        if ok:
                            st.success("¡Información actualizada exitosamente!")
                            empresa_actualizada = get_empresa_by_id(identificador)
                            if empresa_actualizada:
                                st.session_state.empresa_activa = empresa_actualizada
                            st.rerun()
                        else:
                            st.error(f"Error: {msg}")
                else:
                    st.warning("Los campos Razón Social y RFC son obligatorios.")

    with st.expander("Gestión de Socios (Relación Uno a Muchos)"):
        st.write("Administra los socios registrados para esta empresa.")
        socios = obtener_socios(identificador)
        if socios:
            for s in socios:
                sc1, sc2, sc3 = st.columns([4, 4, 2])
                sc1.text(s['nombre'])
                sc2.text(s['rfc'])
                if sc3.button("🗑️ Eliminar", key=f"del_socio_{s['id']}", use_container_width=True):
                    ok, msg = eliminar_socio(s['id'])
                    if ok:
                        obtener_socios.clear()
                        st.rerun()
                    else:
                        st.error(msg)
        else:
            st.info("No hay socios registrados para esta empresa.")
            
        st.write("---")
        st.markdown("**Agregar Nuevo Socio**")
        with st.form("form_nuevo_socio", clear_on_submit=True):
            nsc1, nsc2 = st.columns(2)
            n_nombre = nsc1.text_input("Nombre del Socio *")
            n_rfc = nsc2.text_input("RFC")
            
            if st.form_submit_button("Agregar Socio", type="primary"):
                if n_nombre:
                    ok, msg = agregar_socio(identificador, n_nombre, n_rfc)
                    if ok:
                        st.success("Socio agregado correctamente.")
                        obtener_socios.clear()
                        st.rerun()
                    else:
                        st.error(msg)
                else:
                    st.warning("El nombre del socio es obligatorio.")
