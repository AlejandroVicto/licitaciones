from pydantic import BaseModel
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

class SocioBase(BaseModel):
    nombre: str
    rfc: Optional[str] = None
