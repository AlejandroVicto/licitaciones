from fastapi import FastAPI, HTTPException, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import jwt
import datetime
from passlib.context import CryptContext
from models import EmpresaBase, SocioBase, SocioUpdateAcciones, UsuarioCreate, UsuarioLogin, UsuarioUpdate, UsuarioDelete
from database import supabase
from document_engine import generar_documento_word

app = FastAPI(title="Licitaciones API")

# Configuración del middleware CORS
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
def ping():
    return {"mensaje": "API conectada y funcionando"}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET", "super_secret_key_123") # En produccion deberia estar en .env

def get_super_user_key():
    return os.getenv("SUPER_USER_KEY", "Prueba26!")

@app.post("/auth/registrar-usuario")
def registrar_usuario(user_data: UsuarioCreate):
    if user_data.super_user_password != get_super_user_key():
        raise HTTPException(status_code=403, detail="Contraseña maestra incorrecta")
    
    # Check si usuario ya existe
    existing = supabase.table("usuarios").select("id").eq("username", user_data.username).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Usuario ya existe")
        
    hashed_password = pwd_context.hash(user_data.password)
    
    nuevo_usuario = {
        "username": user_data.username,
        "password_hash": hashed_password,
        "permisos": user_data.permisos
    }
    
    response = supabase.table("usuarios").insert(nuevo_usuario).execute()
    
    return {"mensaje": "Usuario creado exitosamente", "usuario": user_data.username}

@app.post("/auth/login")
def login(user_data: UsuarioLogin):
    # Hardcoded admin bypass
    if user_data.username == "admin" and user_data.password == get_super_user_key():
        admin_permisos = ["Generar", "Editar", "Crear_Empresa", "Boveda_Subir"]
        payload = {
            "sub": "admin",
            "permisos": admin_permisos,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=2) # 48 hrs
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return {
            "access_token": token,
            "token_type": "bearer",
            "username": "admin",
            "permisos": admin_permisos
        }

    response = supabase.table("usuarios").select("*").eq("username", user_data.username).execute()
    
    if not response.data:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
        
    user = response.data[0]
    
    if not pwd_context.verify(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
        
    # Crear JWT
    payload = {
        "sub": user["username"],
        "permisos": user.get("permisos", []),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=2) # 48 hrs
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user["username"],
        "permisos": user.get("permisos", [])
    }

@app.get("/usuarios")
def get_usuarios():
    # Solo retornamos id, username y permisos por seguridad
    response = supabase.table("usuarios").select("id, username, permisos").execute()
    return response.data

@app.put("/usuarios/{usuario_id}/permisos")
def update_permisos_usuario(usuario_id: str, user_data: UsuarioUpdate):
    if user_data.super_user_password != get_super_user_key():
        raise HTTPException(status_code=403, detail="Contraseña maestra incorrecta")
        
    response = supabase.table("usuarios").update({"permisos": user_data.permisos}).eq("id", usuario_id).execute()
    return {"mensaje": "Permisos actualizados correctamente", "data": response.data}

@app.delete("/usuarios/{usuario_id}")
def delete_usuario(usuario_id: str, user_data: UsuarioDelete):
    if user_data.super_user_password != get_super_user_key():
        raise HTTPException(status_code=403, detail="Contraseña maestra incorrecta")
        
    response = supabase.table("usuarios").delete().eq("id", usuario_id).execute()
    return {"mensaje": "Usuario eliminado correctamente"}

@app.get("/empresas")
def get_empresas():
    response = supabase.table("empresas").select("*").execute()
    return response.data

@app.post("/empresas")
def create_empresa(empresa: EmpresaBase):
    data = empresa.model_dump(exclude_unset=True)
    response = supabase.table("empresas").insert(data).execute()
    return response.data[0] if response.data else {}

@app.put("/empresas/{empresa_id}")
def update_empresa(empresa_id: int, empresa: EmpresaBase):
    data = empresa.model_dump(exclude_unset=True)
    response = supabase.table("empresas").update(data).eq("id", empresa_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")
    return response.data[0]

@app.get("/empresas/{empresa_id}/socios")
def get_socios(empresa_id: int):
    response = supabase.table("socios").select("*").eq("empresa_id", empresa_id).execute()
    return response.data

@app.post("/empresas/{empresa_id}/socios")
def add_socio(empresa_id: int, socio: SocioBase):
    data = socio.model_dump(exclude_unset=True)
    data["empresa_id"] = empresa_id
    response = supabase.table("socios").insert(data).execute()
    return response.data[0] if response.data else {}

@app.delete("/socios/{socio_id}")
def delete_socio(socio_id: int):
    response = supabase.table("socios").delete().eq("id", socio_id).execute()
    return {"mensaje": "Socio eliminado correctamente"}

@app.put("/socios/{socio_id}/acciones")
def update_socio_acciones(socio_id: int, data: SocioUpdateAcciones):
    response = supabase.table("socios").update({"acciones": data.acciones}).eq("id", socio_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Socio no encontrado")
    return response.data[0]

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
    lista = supabase.storage.from_("documentos").list(path=str(empresa_id))
    if lista:
        archivos = [a for a in lista if a['name'] != '.emptyFolderPlaceholder']
        return archivos
    return []

@app.post("/empresas/{empresa_id}/documentos")
async def upload_documento(empresa_id: int, file: UploadFile = File(...)):
    file_bytes = await file.read()
    ruta = f"{empresa_id}/{file.filename}"
    supabase.storage.from_("documentos").upload(
        path=ruta, 
        file=file_bytes, 
        file_options={"content-type": file.content_type, "upsert": "true"}
    )
    return {"mensaje": "Archivo subido correctamente"}

@app.delete("/empresas/{empresa_id}/documentos/{file_name:path}")
def delete_documento(empresa_id: int, file_name: str):
    ruta = f"{empresa_id}/{file_name}"
    supabase.storage.from_("documentos").remove([ruta])
    return {"mensaje": "Archivo eliminado correctamente"}

@app.get("/empresas/{empresa_id}/documentos/{file_name:path}")
def download_documento(empresa_id: int, file_name: str):
    ruta = f"{empresa_id}/{file_name}"
    bytes_doc = supabase.storage.from_("documentos").download(ruta)
    ext = file_name.split('.')[-1].lower() if '.' in file_name else ''
    media_type = "application/pdf"
    if ext in ['xlsx', 'xls']:
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    
    return Response(content=bytes_doc, media_type=media_type)


