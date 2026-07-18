from pydantic import BaseModel, field_validator
from typing import Optional

class EmpresaBase(BaseModel):
    nombre: str
    rfc: str
    num_padron: Optional[str] = None
    calle: Optional[str] = None
    num_ext: Optional[str] = None
    num_int: Optional[str] = None
    colonia: Optional[str] = None
    cp: Optional[str] = None
    municipio: Optional[str] = None
    estado: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None
    objeto_social: Optional[str] = None
    admin_unico: Optional[str] = None
    rfc_admin_unico: Optional[str] = None
    representante: Optional[str] = None
    rfc_representante: Optional[str] = None

    @field_validator('rfc', 'rfc_admin_unico', 'rfc_representante')
    @classmethod
    def rfc_to_upper(cls, v: str | None) -> str | None:
        if v is not None:
            return v.upper()
        return v

class SocioBase(BaseModel):
    nombre: str
    rfc: Optional[str] = None
    acciones: Optional[int] = None

    @field_validator('rfc')
    @classmethod
    def rfc_to_upper(cls, v: str | None) -> str | None:
        if v is not None:
            return v.upper()
        return v

class SocioUpdateAcciones(BaseModel):
    acciones: int

class UsuarioCreate(BaseModel):
    username: str
    password: str
    super_user_password: str
    permisos: list[str] = []

class UsuarioLogin(BaseModel):
    username: str
    password: str

class UsuarioUpdate(BaseModel):
    permisos: list[str]
    super_user_password: str

class UsuarioDelete(BaseModel):
    super_user_password: str
