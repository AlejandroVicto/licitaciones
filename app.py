import streamlit as st
import os
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client
from reemplazar_etiquetas import reemplazar_etiquetas

# 1. Configuración de la página
st.set_page_config(page_title="Sistema de Licitaciones", page_icon="🏗️", layout="wide")

# 2. Cargar credenciales y conectar a Supabase
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

try:
    supabase: Client = create_client(url, key)
    conexion_ok = True
except Exception as e:
    conexion_ok = False
    st.error(f"Error de conexión: {e}")

# 3. Interfaz Gráfica
st.title("🏗️ Sistema de Gestión de Licitaciones")
st.subheader("Módulo: Registro de Constructoras / Empresas")

if conexion_ok:
    # Creamos dos columnas en la pantalla: izquierda para el formulario, derecha para la tabla
    col1, col2 = st.columns([1, 2])

    with col1:
        st.write("### 📝 Registrar Nueva Empresa")
        
        # Formulario de captura
        with st.form("form_empresa", clear_on_submit=True):
            nombre_empresa = st.text_input("Nombre o Razón Social:")
            rfc_empresa = st.text_input("RFC de la Empresa:")
            rep_legal = st.text_input("Representante Legal:")
            
            boton_guardar = st.form_submit_button("💾 Guardar Empresa")
            
            # Al darle clic al botón, metemos los datos a Supabase
            if boton_guardar:
                if nombre_empresa and rfc_empresa and rep_legal:
                    # Creamos el diccionario con los nombres EXACTOS de tus columnas en Supabase
                    nueva_empresa = {
                        "nombre": nombre_empresa,
                        "rfc": rfc_empresa.upper(), # Guardar RFC en mayúsculas
                        "representante": rep_legal
                    }
                    
                    try:
                        # Orden de inserción en la tabla
                        supabase.table("empresas").insert(nueva_empresa).execute()
                        st.success(f"¡{nombre_empresa} registrada con éxito! 🎉")
                        # Forzar refresco de pantalla para actualizar la tabla
                        st.rerun()
                    except Exception as err:
                        st.error(f"No se pudo guardar en la base de datos: {err}")
                else:
                    st.warning("⚠️ Por favor, llena todos los campos del formulario.")

    with col2:
        st.write("### 🏢 Empresas Registradas")
        
        # Leer las empresas actuales de Supabase
        try:
            respuesta = supabase.table("empresas").select("*").execute()
            datos = respuesta.data
            
            if datos:
                # Transformamos los datos en una tabla limpia usando Pandas
                df = pd.DataFrame(datos)
                # Reordenamos y renombramos las columnas para que se vean profesionales
                df = df[["nombre", "rfc", "representante"]]
                df.columns = ["Razón Social", "RFC", "Representante Legal"]
                
                # Mostramos la tabla interactiva en Streamlit
                st.dataframe(df, use_container_width=True, hide_index=True)
            else:
                st.info("Aún no hay empresas registradas. Utiliza el formulario de la izquierda para agregar la primera.")
                
        except Exception as err_leer:
            st.error(f"Error al leer el listado de empresas: {err_leer}")

# 4. Generador de Documentos
st.divider()
st.write("### 📄 Generador de Documentos")

if conexion_ok:
    try:
        # Consultar las empresas para el dropdown
        empresas_data = supabase.table("empresas").select("*").execute().data
        
        if empresas_data:
            # Crear diccionario para fácil búsqueda
            empresas_dict = {e['nombre']: e for e in empresas_data}
            nombres_empresas = list(empresas_dict.keys())
            
            empresa_seleccionada = st.selectbox("Selecciona una empresa para generar el documento:", nombres_empresas)
            
            if st.button("Generar Escrito de Prueba"):
                datos_empresa = empresas_dict[empresa_seleccionada]
                
                # Configurar los reemplazos para la plantilla
                reemplazos = {
                    "{{REPRESENTANTE}}": datos_empresa.get('representante', ''),
                    "{{RFC}}": datos_empresa.get('rfc', '')
                }
                
                archivo_plantilla = "plantilla_prueba.docx"
                archivo_salida = "resultado_final.docx"
                
                if os.path.exists(archivo_plantilla):
                    try:
                        # Ejecutar la función de reemplazo de nuestro otro script
                        reemplazar_etiquetas(archivo_plantilla, archivo_salida, reemplazos)
                        
                        # Leer el archivo generado para el botón de descarga
                        with open(archivo_salida, "rb") as file:
                            bytes_docx = file.read()
                            
                        # Guardar en session_state para que el botón de descarga no desaparezca al refrescar
                        st.session_state['docx_descarga'] = bytes_docx
                        st.session_state['docx_nombre'] = f"Escrito_{datos_empresa['nombre'].replace(' ', '_')}.docx"
                        st.session_state['docx_empresa'] = empresa_seleccionada
                        
                        st.success("¡Documento generado exitosamente! Haz clic en el botón de abajo para descargarlo.")
                    except Exception as err_gen:
                        st.error(f"Error al generar el documento Word: {err_gen}")
                else:
                    st.error(f"No se encontró el archivo de plantilla: {archivo_plantilla} en la carpeta.")
            
            # Mostrar botón de descarga si existe el documento generado en sesión y corresponde a la empresa seleccionada
            if 'docx_descarga' in st.session_state and st.session_state.get('docx_empresa') == empresa_seleccionada:
                st.download_button(
                    label="📥 Descargar Escrito de Prueba",
                    data=st.session_state['docx_descarga'],
                    file_name=st.session_state['docx_nombre'],
                    mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                )
                
        else:
            st.info("Registra al menos una empresa para poder generar documentos.")
    except Exception as e:
        st.error(f"Error al cargar las empresas para el generador: {e}")

# 5. Bóveda Digital
st.divider()
st.write("### 🗄️ Bóveda Digital")

if conexion_ok:
    try:
        empresas_data_boveda = supabase.table("empresas").select("*").execute().data
        
        if empresas_data_boveda:
            empresas_dict_boveda = {e['nombre']: e for e in empresas_data_boveda}
            nombres_empresas_boveda = list(empresas_dict_boveda.keys())
            
            empresa_boveda_seleccionada = st.selectbox("Selecciona una empresa para la Bóveda:", nombres_empresas_boveda, key="boveda_empresa")
            datos_empresa_boveda = empresas_dict_boveda[empresa_boveda_seleccionada]
            
            # Usar 'id' si existe en la base de datos, si no, usar 'rfc' como identificador de carpeta
            empresa_id = datos_empresa_boveda.get('id', datos_empresa_boveda.get('rfc'))
            
            col_boveda1, col_boveda2 = st.columns(2)
            
            with col_boveda1:
                st.write("#### 📤 Subir Documento")
                tipo_documento = st.selectbox(
                    "Tipo de Documento:", 
                    ["Constancia_SAT", "INE_Representante", "Acta_Constitutiva"]
                )
                
                archivo_subir = st.file_uploader("Selecciona un archivo PDF", type=['pdf'])
                
                if st.button("Subir a la Bóveda"):
                    if archivo_subir is not None:
                        ruta_destino = f"{empresa_id}/{tipo_documento}.pdf"
                        try:
                            file_bytes = archivo_subir.getvalue()
                            supabase.storage.from_('documentos').upload(
                                path=ruta_destino, 
                                file=file_bytes, 
                                file_options={"content-type": "application/pdf", "upsert": "true"}
                            )
                            st.success(f"¡{tipo_documento}.pdf subido correctamente!")
                        except Exception as e_upload:
                            st.error(f"Error al subir el archivo: {e_upload}")
                    else:
                        st.warning("⚠️ Por favor, selecciona un archivo PDF primero.")
            
            with col_boveda2:
                st.write("#### 📁 Archivos en la Nube")
                try:
                    lista_archivos = supabase.storage.from_('documentos').list(str(empresa_id))
                    
                    if lista_archivos:
                        # Filtrar posibles placeholders de carpeta de Supabase
                        archivos_reales = [a for a in lista_archivos if a['name'] != '.emptyFolderPlaceholder']
                        if archivos_reales:
                            for arch in archivos_reales:
                                col_nom, col_btn = st.columns([7, 3])
                                with col_nom:
                                    st.write(f"📄 {arch['name']}")
                                with col_btn:
                                    ruta_archivo = f"{empresa_id}/{arch['name']}"
                                    try:
                                        # Descargar el archivo directamente a la memoria RAM
                                        bytes_pdf = supabase.storage.from_('documentos').download(ruta_archivo)
                                        
                                        # Conectar los bytes al botón de descarga con un key único
                                        st.download_button(
                                            label="⬇️ Descargar",
                                            data=bytes_pdf,
                                            file_name=arch['name'],
                                            mime="application/pdf",
                                            key=f"dl_btn_{empresa_id}_{arch['name']}"
                                        )
                                    except Exception as e_descarga:
                                        st.error("No disponible")
                        else:
                            st.info("No hay documentos guardados para esta empresa.")
                    else:
                        st.info("No hay documentos guardados para esta empresa.")
                except Exception:
                    # En algunos casos, si la carpeta no existe lanza una excepción
                    st.info("No hay documentos guardados para esta empresa.")
                    
        else:
            st.info("Registra al menos una empresa para usar la Bóveda Digital.")
    except Exception as e_boveda:
        st.error(f"Error al cargar la Bóveda Digital: {e_boveda}")