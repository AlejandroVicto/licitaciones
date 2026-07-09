import streamlit as st
from backend.connection import supabase, conexion_ok

# Mapeo de módulos solicitado por el usuario
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

def render_boveda_view(modo="subir"):
    st.markdown("## 🗄️ Bóveda Digital")
    st.caption("Repositorio seguro estructurado para documentación de licitaciones.")
    
    empresa = st.session_state.empresa_activa
    id_empresa_destino = empresa.get('id', empresa.get('rfc'))
    
    st.write(f"Gestionando documentos para: **{empresa.get('nombre')}**")
    st.write(f"**Modo Actual:** {'Subir Documentos' if modo == 'subir' else 'Explorar y Descargar'}")
    st.write("---")
    
    # Pestañas para los 4 módulos
    nombres_modulos = list(MODULOS_DOCUMENTOS.keys())
    tabs = st.tabs(nombres_modulos)
    
    # Cargar lista de archivos globalmente si estamos en modo descarga para evitar llamadas repetidas
    archivos_empresa = []
    if modo == "descargar" and conexion_ok:
        try:
            lista = supabase.storage.from_("documentos").list(path=str(id_empresa_destino))
            if lista:
                archivos_empresa = [a for a in lista if a['name'] != '.emptyFolderPlaceholder']
        except Exception:
            pass

    for i, tab in enumerate(tabs):
        with tab:
            modulo_actual = nombres_modulos[i]
            prefix_modulo = modulo_actual[:8]  # e.g., "Módulo 1"
            
            st.markdown(f"### {modulo_actual}")
            
            if modo == "subir":
                with st.container(border=True):
                    tipo_documento = st.selectbox(
                        "Selecciona el documento específico a subir:", 
                        MODULOS_DOCUMENTOS[modulo_actual],
                        key=f"sel_{i}"
                    )
                    
                    is_multiple = ("Acta_Constitutiva" in tipo_documento or "Declaracion_Anual_Previas" in tipo_documento)
                    tipos_permitidos = ['pdf']
                    if "Financiero" in tipo_documento or "Estado_Financiero" in tipo_documento:
                        tipos_permitidos = ['pdf', 'xlsx', 'xls']
                        
                    archivos_subir = st.file_uploader(
                        "Selecciona el archivo(s)", 
                        type=tipos_permitidos, 
                        accept_multiple_files=is_multiple,
                        key=f"file_{i}"
                    )
                    
                    if st.button("Subir Documento ☁️", type="primary", key=f"btn_up_{i}"):
                        if archivos_subir and conexion_ok:
                            with st.spinner("Subiendo a Supabase Storage..."):
                                lista_archivos = archivos_subir if isinstance(archivos_subir, list) else [archivos_subir]
                                todos_ok = True
                                
                                for idx, arch in enumerate(lista_archivos):
                                    file_bytes = arch.getvalue()
                                    doc_clean = tipo_documento.replace(" ", "_").replace("/", "_").replace("-", "_")
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
                                st.warning("⚠️ Selecciona un archivo.")
                                
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
                                    st.write(f"📄 **{nombre_legible}**")
                                    st.caption(f"Archivo real: {arch['name']}")
                                with c_btn:
                                    ruta_archivo = f"{id_empresa_destino}/{arch['name']}"
                                    try:
                                        bytes_doc = supabase.storage.from_("documentos").download(ruta_archivo)
                                        mime_type = "application/pdf" if arch['name'].endswith(".pdf") else "application/octet-stream"
                                        
                                        st.download_button(
                                            label="⬇️ Descargar",
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
