import streamlit as st
from backend.connection import supabase, conexion_ok

# Mapeo de módulos
MODULOS_DOCUMENTOS = {
    "Módulo 1: Legal y Acreditación": [
        "Acta_Constitutiva_y_Modificaciones",
        "INE_Representante_Legal",
        "Poder_Notarial",
        "Constancia_Situacion_Fiscal_SAT",
        "Opinion_Cumplimiento_32D_SAT",
        "Opinion_Cumplimiento_IMSS",
        "Constancia_Situacion_Fiscal_INFONAVIT",
        "Constancia_No_Adeudo_Estatal",
        "Padron_Contratistas_Estatal",
        "Constancia_No_Inhabilitacion",
        "Identificacion_Patronal_IMSS",
        "Padron_Contratistas_SHTFP"
    ],
    "Módulo 2: Experiencia y Operación": [
        "Curriculum_Corporativo",
        "Obras_Ejecutadas_3_Anios",
        "Obras_en_Vigor",
        "Acreditacion_Domicilio",
        "Expedientes_Maquinaria",
        "Listado_Maquinaria"
    ],
    "Módulo 3: Financiero y Contable": [
        "Declaracion_Anual_Previas - Acuse",
        "Declaracion_Anual_Previas - Declaracion",
        "Declaracion_Anual_Previas - Estado_Financiero",
        "Declaraciones_Provisionales",
        "Estados_Financieros",
        "Expediente_Contador_Publico - Cédula_profesional",
        "Expediente_Contador_Publico - Registro_SAT",
        "Expediente_Contador_Publico - Afiliacion_Colegio",
        "Expediente_Contador_Publico - Identificacion_oficial",
        "Expediente_Contador_Publico - Constancia_situacion_fiscal"
    ],
    "Módulo 4: Personal Clave": [
        "Expediente_DRO - Licencia_SIC",
        "Expediente_DRO - Identificacion_oficial",
        "Expediente_DRO - Cedula",
        "Expediente_DRO - Curriculum",
        "Expediente_DRO - Comprobante_domicilio",
        "Expediente_Superintendente - Identificacion_oficial",
        "Expediente_Superintendente - Cedula",
        "Expediente_Superintendente - Curriculum",
        "Expediente_Superintendente - Comprobante_habilidad",
        "Expediente_Superintendente - Comprobante_domicilio",
        "Expediente_Auxiliar_Superintendente - Identificacion_oficial",
        "Expediente_Auxiliar_Superintendente - Cedula",
        "Expediente_Auxiliar_Superintendente - Curriculum",
        "Expediente_Auxiliar_Superintendente - Comprobante_habilidad",
        "Expediente_Auxiliar_Superintendente - Comprobante_domicilio",
        "Expediente_Jefe_Topografia - Identificacion_oficial",
        "Expediente_Jefe_Topografia - Cedula",
        "Expediente_Jefe_Topografia - Curriculum",
        "Expediente_Jefe_Topografia - Comprobante_habilidad",
        "Expediente_Jefe_Topografia - Comprobante_domicilio",
        "Expediente_Jefe_Laboratorio - Identificacion_oficial",
        "Expediente_Jefe_Laboratorio - Cedula",
        "Expediente_Jefe_Laboratorio - Curriculum",
        "Expediente_Jefe_Laboratorio - Comprobante_habilidad",
        "Expediente_Jefe_Laboratorio - Comprobante_domicilio"
    ]
}
#Renderiza la vista de la bóveda digital con sus diferentes modos
def render_boveda_view(modo="subir"):
    st.markdown("## 🗄️ Bóveda Digital")
    st.caption("Repositorio seguro estructurado para documentación de licitaciones.")
    
    empresa = st.session_state.empresa_activa
    id_empresa_destino = empresa.get('id', empresa.get('rfc'))
    
    st.write(f"Gestionando documentos para: **{empresa.get('nombre')}**")
    modo_label = 'Subir Documentos' if modo == 'subir' else ('Explorar y Descargar' if modo == 'descargar' else 'Guía de Documentos')
    st.write(f"**Modo Actual:** {modo_label}")
    st.write("---")
    #Renderiza la guía de documentos
    if modo == "guia":
        st.markdown("### Manual de Ayuda y Requisitos Documentales")
        
        with st.expander("Módulo 1: Legal y Acreditación (Archivos Fijos y Actualizables)", expanded=True):
            st.markdown("""
- **Acta Constitutiva y Modificaciones:** Escrituras públicas inscritas en el Registro Público correspondiente.
- **Identificación Oficial del Representante Legal:** INE, pasaporte o cartilla vigente.
- **Poder Notarial:** Instrumento legal del apoderado (si aplica) e identificación oficial.
- **Constancia de Situación Fiscal (SAT):** Actualización mensual (vigencia máxima de 30 días).
- **Opinión de Cumplimiento SAT (32-D):** Opinión en sentido positivo (vigencia máxima de 30 días).
- **Opinión de Cumplimiento IMSS:** Opinión en sentido positivo (vigencia máxima de 15 días).
- **Constancia de Situación Fiscal INFONAVIT:** Documento vigente en sentido "sin adeudo".
- **Constancia de No Adeudo Estatal:** Emitida por la Secretaría de Finanzas.
- **Padrón de Contratistas:** Constancia de inscripción estatal vigente.
- **Constancia de No Inhabilitación:** Emitida por la Secretaría de Honestidad (vigente).
- **Identificación Patronal:** Tarjeta del IMSS.
- **Padrón de contratistas de la secretaria de honestidad, transparencia y función publica:** Documento vigente.
            """)
            
        with st.expander("Módulo 2: Experiencia y Operación (Archivos Fijos)"):
            st.markdown("""
- **Currículum Corporativo:** Documento general con la historia y capacidad de la empresa.
- **Obras Ejecutadas (Últimos 3 años):** Listado respaldado por contratos, actas de entrega-recepción y fianzas de vicios ocultos.
- **Obras en Vigor:** Relación actualizada de contratos activos con importes totales, ejercidos y por ejercer.
- **Acreditación de Domicilio:** Comprobante domiciliario (menor a 3 meses), croquis de macro y micro localización georreferenciados (coordenadas UTM) y fotografías a color recientes (interior/exterior) del inmueble.
- **Expedientes de Maquinaria:** Facturas o cartas de arrendamiento de la maquinaria disponible.
- **Listado de la maquinaria:** Relación con la que se cuenta.
            """)
            
        with st.expander("Módulo 3: Financiero y Contable (Archivos Fijos)"):
            st.markdown("""
- **Declaración Anual previas:** Incluye acuse de recibo y estados financieros en Excel.
- **Declaraciones Provisionales:** Acuses de pagos provisionales y definitivos de los últimos 3 meses.
- **Estados Financieros (Anual y Parciales):** Balance general, Estado de resultados, Flujo de efectivo y Variaciones, firmados por el representante y el contador.
- **Expediente del Contador Público:** Cédula profesional, registro SAT, afiliación al colegio, identificación y su constancia de situación fiscal.
            """)
            
        with st.expander("Módulo 4: Personal Clave (Archivos Fijos)"):
            st.markdown("""
- **Expediente D.R.O.:** Licencia clase A de la SIC, identificación, cédula, currículum firmado y comprobantes de 5 obras similares, comprobante de domicilio.
- **Expediente Superintendente:** Identificación, cédula, currículum firmado y comprobantes de 5 obras similares, comprobante de domicilio.
- **Expediente Auxiliar de Superintendente:** Cédula profesional, currículum firmado y comprobantes de habilidad/competencia, comprobante de domicilio.
- **Expediente Jefe de Topografía:** Cédula profesional, currículum firmado y comprobantes de habilidad/competencia, comprobante de domicilio.
- **Expediente Jefe de Laboratorio:** Cédula profesional, currículum firmado y comprobantes de habilidad/competencia, comprobante de domicilio.
            """)
        return
    
    
    # Pestañas para los módulos
    nombres_modulos = list(MODULOS_DOCUMENTOS.keys())
    
    # Cargar lista de archivos globalmente para evitar llamadas repetidas
    archivos_empresa = []
    if conexion_ok:
        try:
            lista = supabase.storage.from_("documentos").list(path=str(id_empresa_destino))
            if lista:
                archivos_empresa = [a for a in lista if a['name'] != '.emptyFolderPlaceholder']
        except Exception:
            pass
    
    import streamlit_antd_components as sac
    modulo_actual = sac.tabs([sac.TabsItem(label=m) for m in nombres_modulos], align='center', color='#F5A623')
    
    prefix_modulo = modulo_actual.split(":")[0].replace("ó", "o").replace(" ", "_")
    
    st.markdown(f"### {modulo_actual}")
    
    if modo == "subir":
        with st.container(border=True):
            tipo_documento = st.selectbox(
                "Selecciona el documento específico a subir:", 
                MODULOS_DOCUMENTOS[modulo_actual]
            )
            doc_clean = tipo_documento.replace(" ", "_").replace("/", "_").replace("-", "_")
            
            # Buscar y mostrar archivos ya existentes para este tipo de documento
            archivos_existentes = [a for a in archivos_empresa if a['name'].startswith(f"{prefix_modulo}_{doc_clean}")]
            if archivos_existentes:
                st.markdown(f"**Documentos actuales guardados ({tipo_documento}):**")
                for arch in archivos_existentes:
                    with st.container():
                        c1, c2 = st.columns([8, 2])
                        nombre_corto = arch['name'].replace(f"{prefix_modulo}_", "")
                        c1.write(f" {nombre_corto}")
                        if c2.button("Eliminar", key=f"del_up_{id_empresa_destino}_{arch['name']}", use_container_width=True):
                            try:
                                supabase.storage.from_("documentos").remove([f"{id_empresa_destino}/{arch['name']}"])
                                st.rerun()
                            except Exception as e:
                                st.error("Error al eliminar el archivo.")
                st.markdown("<hr style='margin: 0.5em 0;'>", unsafe_allow_html=True)
            
            is_multiple = ("Acta_Constitutiva" in tipo_documento or "Declaracion_Anual_Previas" in tipo_documento)
            tipos_permitidos = ['pdf']
            if "Financiero" in tipo_documento or "Estado_Financiero" in tipo_documento:
                tipos_permitidos = ['pdf', 'xlsx', 'xls']
                
            archivos_subir = st.file_uploader(
                "Selecciona el archivo(s)", 
                type=tipos_permitidos, 
                accept_multiple_files=is_multiple
            )
            
            if st.button("Subir Documento", type="primary"):
                if archivos_subir and conexion_ok:
                    with st.spinner("Subiendo a Supabase Storage..."):
                        lista_archivos = archivos_subir if isinstance(archivos_subir, list) else [archivos_subir]
                        todos_ok = True
                        
                        for idx, arch in enumerate(lista_archivos):
                            file_bytes = arch.getvalue()
                            ext = arch.name.split('.')[-1].lower() if '.' in arch.name else 'pdf'
                            
                            if is_multiple and len(lista_archivos) > 1:
                                ruta_archivo = f"{id_empresa_destino}/{prefix_modulo}_{doc_clean}_{idx+1}.{ext}"
                            else:
                                ruta_archivo = f"{id_empresa_destino}/{prefix_modulo}_{doc_clean}.{ext}"
                                
                            try:
                                supabase.storage.from_("documentos").upload(
                                    path=ruta_archivo, 
                                    file=file_bytes, 
                                    file_options={"content-type": "application/octet-stream", "upsert": "true"}
                                )
                            except Exception as e:
                                todos_ok = False
                                st.error(f"Error al subir {arch.name}: {e}")
                                
                        if todos_ok:
                            st.success(f"¡Documentos subidos exitosamente en {prefix_modulo}!")
                else:
                    if not conexion_ok:
                        st.error("No hay conexión a Supabase.")
                    else:
                        st.warning("Selecciona un archivo.")
                        
    else: # Explorador y Descargas
        with st.container(border=True):
            # Filtrar archivos que pertenecen a este módulo
            archivos_modulo = [a for a in archivos_empresa if a['name'].startswith(prefix_modulo)]
            
            if archivos_modulo:
                for arch in archivos_modulo:
                    with st.container():
                        c_file, c_btn = st.columns([7, 3])
                        with c_file:
                            # Limpiamos un poco el nombre para que sea más legible
                            nombre_legible = arch['name'].replace(f"{prefix_modulo}_", "").replace("_", " ")
                            st.write(f" **{nombre_legible}**")
                            st.caption(f"Archivo real: {arch['name']}")
                        with c_btn:
                            ruta_archivo = f"{id_empresa_destino}/{arch['name']}"
                            try:
                                bytes_doc = supabase.storage.from_("documentos").download(ruta_archivo)
                                mime_type = "application/pdf" if arch['name'].endswith(".pdf") else "application/octet-stream"
                                
                                st.download_button(
                                    label=" Descargar",
                                    data=bytes_doc,
                                    file_name=arch['name'],
                                    mime=mime_type,
                                    key=f"dl_{id_empresa_destino}_{arch['name']}",
                                    use_container_width=True
                                )
                            except Exception:
                                st.error("Fallo descarga")
                        st.markdown("<hr style='margin: 0.2em 0;'>", unsafe_allow_html=True)
            else:
                st.info(f"No hay documentos guardados para {modulo_actual}.")
