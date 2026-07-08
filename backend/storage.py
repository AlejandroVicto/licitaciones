from backend.connection import supabase, conexion_ok

def upload_document(empresa_id, tipo_documento, file_bytes):
    if not conexion_ok:
        return False, "Sin conexión a la base de datos"
    ruta_destino = f"{empresa_id}/{tipo_documento}.pdf"
    try:
        supabase.storage.from_('documentos').upload(
            path=ruta_destino, 
            file=file_bytes, 
            file_options={"content-type": "application/pdf", "upsert": "true"}
        )
        return True, "Archivo subido correctamente"
    except Exception as e:
        return False, str(e)

def list_documents(empresa_id):
    if not conexion_ok:
        return []
    try:
        lista_archivos = supabase.storage.from_('documentos').list(str(empresa_id))
        if lista_archivos:
            archivos_reales = [a for a in lista_archivos if a['name'] != '.emptyFolderPlaceholder']
            return archivos_reales
        return []
    except Exception:
        return []

def download_document(empresa_id, filename):
    if not conexion_ok:
        return None
    ruta_archivo = f"{empresa_id}/{filename}"
    try:
        return supabase.storage.from_('documentos').download(ruta_archivo)
    except Exception:
        return None
