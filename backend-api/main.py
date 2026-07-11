from fastapi import FastAPI, HTTPException, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
from models import EmpresaBase, SocioBase
from database import supabase
from document_engine import generar_documento_word

app = FastAPI(title="Licitaciones API")

# Configuración del middleware CORS
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
def ping():
    return {"mensaje": "API conectada y funcionando"}

@app.get("/empresas")
def get_empresas():
    try:
        response = supabase.table("empresas").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/empresas")
def create_empresa(empresa: EmpresaBase):
    try:
        data = empresa.model_dump(exclude_unset=True)
        if "rfc" in data and data["rfc"]:
            data["rfc"] = data["rfc"].upper()
        response = supabase.table("empresas").insert(data).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/empresas/{empresa_id}")
def update_empresa(empresa_id: int, empresa: EmpresaBase):
    try:
        data = empresa.model_dump(exclude_unset=True)
        if "rfc" in data and data["rfc"]:
            data["rfc"] = data["rfc"].upper()
        response = supabase.table("empresas").update(data).eq("id", empresa_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Empresa no encontrada")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/empresas/{empresa_id}/socios")
def get_socios(empresa_id: int):
    try:
        response = supabase.table("socios").select("*").eq("empresa_id", empresa_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/empresas/{empresa_id}/socios")
def add_socio(empresa_id: int, socio: SocioBase):
    try:
        data = socio.model_dump(exclude_unset=True)
        data["empresa_id"] = empresa_id
        if "rfc" in data and data["rfc"]:
            data["rfc"] = data["rfc"].upper()
        response = supabase.table("socios").insert(data).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/socios/{socio_id}")
def delete_socio(socio_id: int):
    try:
        response = supabase.table("socios").delete().eq("id", socio_id).execute()
        return {"mensaje": "Socio eliminado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/empresas/{empresa_id}/generar-documento")
def generar_documento(empresa_id: int):
    try:
        # Obtener empresa
        emp_resp = supabase.table("empresas").select("*").eq("id", empresa_id).execute()
        if not emp_resp.data:
            raise HTTPException(status_code=404, detail="Empresa no encontrada")
        empresa = emp_resp.data[0]
        
        # Obtener socios
        soc_resp = supabase.table("socios").select("*").eq("empresa_id", empresa_id).execute()
        socios = soc_resp.data
        
        # Procesar socios_text
        socios_list = []
        for i, s in enumerate(socios, 1):
            rfc_text = f" (RFC: {s['rfc']})" if s.get("rfc") else ""
            socios_list.append(f"{i}.- {s['nombre']}{rfc_text}")
        socios_text = "\n".join(socios_list) if socios_list else "Sin socios registrados."
        
        # Procesar domicilio_text
        partes_domicilio = []
        if empresa.get("calle"):
            calle_num = empresa["calle"]
            if empresa.get("num_ext"):
                calle_num += f" {empresa['num_ext']}"
            if empresa.get("num_int"):
                calle_num += f" Int. {empresa['num_int']}"
            partes_domicilio.append(calle_num)
        
        if empresa.get("colonia"):
            partes_domicilio.append(f"Col. {empresa['colonia']}")
        if empresa.get("cp"):
            partes_domicilio.append(f"C.P. {empresa['cp']}")
        if empresa.get("municipio"):
            partes_domicilio.append(empresa["municipio"])
        if empresa.get("estado"):
            partes_domicilio.append(empresa["estado"])
            
        domicilio_text = ", ".join(partes_domicilio) if partes_domicilio else "Domicilio no registrado."
        
        # Generar documento
        file_path = generar_documento_word(empresa, socios_text, domicilio_text)
        
        # Retornar archivo
        nombre_archivo = f"Machote_{empresa.get('nombre', 'Empresa').replace(' ', '_')}.docx"
        return FileResponse(path=file_path, filename=nombre_archivo, media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/empresas/{empresa_id}/documentos")
def get_documentos(empresa_id: int):
    try:
        lista = supabase.storage.from_("documentos").list(path=str(empresa_id))
        if lista:
            archivos = [a for a in lista if a['name'] != '.emptyFolderPlaceholder']
            return archivos
        return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/empresas/{empresa_id}/documentos")
async def upload_documento(empresa_id: int, file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        ruta = f"{empresa_id}/{file.filename}"
        supabase.storage.from_("documentos").upload(
            path=ruta, 
            file=file_bytes, 
            file_options={"content-type": file.content_type, "upsert": "true"}
        )
        return {"mensaje": "Archivo subido correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/empresas/{empresa_id}/documentos/{file_name:path}")
def delete_documento(empresa_id: int, file_name: str):
    try:
        ruta = f"{empresa_id}/{file_name}"
        supabase.storage.from_("documentos").remove([ruta])
        return {"mensaje": "Archivo eliminado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/empresas/{empresa_id}/documentos/{file_name:path}")
def download_documento(empresa_id: int, file_name: str):
    try:
        ruta = f"{empresa_id}/{file_name}"
        bytes_doc = supabase.storage.from_("documentos").download(ruta)
        ext = file_name.split('.')[-1].lower() if '.' in file_name else ''
        media_type = "application/pdf"
        if ext in ['xlsx', 'xls']:
            media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        
        return Response(content=bytes_doc, media_type=media_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


