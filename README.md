# Portal de Licitaciones y Boveda Digital - Documentacion Tecnica

Este repositorio contiene el codigo fuente del Portal de Licitaciones y Boveda Digital. 

El objetivo de este documento es proporcionar el contexto tecnico necesario para que cualquier desarrollador que asuma el mantenimiento del proyecto pueda comprender la arquitectura, el flujo de datos y las reglas de negocio implementadas.

---

## 1. Arquitectura del Sistema

El sistema esta dividido en tres componentes principales:

1. **Frontend (Cliente SPA):** Construido en React 18, empaquetado con Vite. Encargado de la presentacion, enrutamiento y manejo del estado local.
2. **Backend (API REST):** Construido con FastAPI (Python). Encargado de orquestar la logica de negocio, generacion de documentos y validacion de esquemas.
3. **Capa de Persistencia (Base de Datos):** PostgreSQL alojado en Supabase, interactuando directamente con el backend mediante la libreria oficial de Supabase para Python.

---

## 2. Tecnologias y Dependencias Principales

### Frontend (`frontend-web/`)
- **Core:** React 18, Vite.
- **Enrutamiento:** react-router-dom (Configurado para Single Page Application).
- **UI/UX:** Ant Design (antd). Se utiliza su sistema de grillas, modales, tablas y componentes de entrada de datos.
- **Manejo de Estado Global:** Zustand. Se definieron stores granulares (`useAuthStore` para sesiones, `useEmpresaStore` para el contexto de negocio).
- **Peticiones HTTP:** Fetch API nativo envoltorio en servicios modulares (`src/services/api.js`).

### Backend (`backend-api/`)
- **Core:** FastAPI (Servidor asincrono mediante Uvicorn).
- **Validacion de Datos:** Pydantic (Validacion estricta de tipos de entrada y salida).
- **Autenticacion y Seguridad:** PyJWT (Generacion y validacion de JSON Web Tokens) y Passlib con bcrypt (Hasheo de contraseñas de usuarios).
- **Generador de Documentos:** python-docx (Lectura de plantillas `.docx`, reemplazo de marcadores de posicion e inyeccion de informacion fiscal).
- **Manejo de Entorno:** python-dotenv.

---

## 3. Reglas de Negocio y Flujos Principales

### 3.1. Autenticacion y RBAC (Control de Acceso basado en Roles)
El sistema no utiliza un esquema de roles tradicional (ej. admin, usuario). En su lugar, utiliza un sistema de permisos modulares a nivel de usuario.
- **Tabla `usuarios` (Supabase):** Almacena `username`, `password_hash` y un arreglo de strings llamado `permisos`.
- **JWT:** Al iniciar sesion (`POST /auth/login`), el backend valida las credenciales y devuelve un token firmado asimetricamente que contiene los permisos del usuario en el payload (Claim: `permisos`). Expira a las 48 horas.
- **RBAC en Frontend:** El componente `Sidebar.jsx` lee los permisos almacenados en Zustand e intersecta los permisos requeridos por cada vista. Si el usuario no tiene el permiso, el enlace simplemente se oculta del DOM.
- **Usuario Maestro (Bypass):** Existe un usuario "admin" cuya logica esta quemada (hardcoded) en el endpoint de login de `main.py`. Este administrador no reside en la base de datos y toma su clave directamente de la variable de entorno `SUPER_USER_KEY`. Esto evita que un error de base de datos o un borrado accidental deje al sistema sin administrador. 

### 3.2. Modelo de Datos Central: Empresas y Socios
El contexto de la aplicacion es inyectado por la Empresa seleccionada.
- **Empresas:** Contiene la informacion fiscal central (Razón Social, RFC, Domicilio, Representantes, Objeto Social).
- **Socios:** Es una relacion de "uno a muchos". Cada socio tiene un Nombre, RFC, y numero de Acciones (`acciones: int`).
- **Endpoints de Backend:** Los datos se reciben via Pydantic (`EmpresaBase`, `SocioBase`) y se mapean automaticamente a los diccionarios para insercion en Supabase utilizando `model_dump(exclude_unset=True)`.

### 3.3. Boveda Digital
Modulo de consulta y carga de documentacion estructurada.
- Los requisitos estan catalogados en cuatro categorias principales: Legal, Experiencia, Financiero y Personal.
- La logica de subida restringe el acceso solo a usuarios con el permiso `Boveda_Subir`.
- El manejo de almacenamiento binario puede variar; es imperativo revisar el servicio de Supabase Storage para el alojamiento persistente.

### 3.4. Motor de Generacion de Documentos
Ubicado en `backend-api/document_engine.py`.
- Espera plantillas en formato Word (`.docx`).
- Intercepta "placeholders" definidos en los parrafos (ej. texto entre llaves o tags especificos) y los reemplaza iterativamente con las variables contenidas en el objeto Empresa activo.
- Retorna el documento binario editado como un `FileResponse` directamente al frontend.

---

## 4. Estructura de Directorios

```text
/
├── backend-api/
│   ├── .env                    # (Ignorado) Variables de entorno
│   ├── database.py             # Conexion singleton del cliente Supabase
│   ├── document_engine.py      # Logica de python-docx para manipulacion de words
│   ├── main.py                 # Entrutador principal (Endpoints FastAPI)
│   ├── models.py               # Definicion de esquemas Pydantic
│   └── requirements.txt        # Dependencias de Python
│
├── frontend-web/
│   ├── .env                    # (Ignorado) Variables de VITE
│   ├── src/
│   │   ├── components/         # Componentes reutilizables (Sidebar, Layouts, etc.)
│   │   ├── pages/              # Vistas mapeadas al Router (Informacion, FormularioEmpresa, etc.)
│   │   ├── services/           # Abstraccion de Fetch API (api.js)
│   │   └── store/              # Manejadores de estado Zustand (useAuthStore.js, etc.)
│   ├── vite.config.js          # Configuracion de compilacion
│   └── package.json            # Dependencias NPM
```

---

## 5. Instrucciones de Configuracion y Despliegue

### 5.1 Entorno de Base de Datos (Supabase)
Es indispensable que la base de datos cuente con las tablas correspondientes (`empresas`, `socios`, `usuarios`) y sus esquemas actualizados (ej. campos de texto como `objeto_social` e integer como `acciones`). Las politicas de acceso de renglon (Row Level Security - RLS) deben estar configuradas correctamente. Para sortear las politicas en el backend, es obligatorio el uso de la `Service Role Key` en lugar de la `Anon Key`.

### 5.2 Configurar el Backend (FastAPI)
1. Instalar entorno virtual y activarlo (Opcional pero recomendado).
2. Ejecutar instalacion:
   ```bash
   cd backend-api
   pip install -r requirements.txt
   ```
3. Configurar archivo `.env` en el directorio `backend-api`:
   ```env
   SUPABASE_URL=http://...
   SUPABASE_KEY=tu_service_role_key_para_bypass_de_rls
   JWT_SECRET=secreto_criptografico_para_firmar_tokens
   SUPER_USER_KEY=contraseña_maestra_admin
   ```
4. Inicializar servidor en modo desarrollo:
   ```bash
   uvicorn main:app --reload
   ```

### 5.3 Configurar el Frontend (React + Vite)
1. Instalar modulos NPM:
   ```bash
   cd frontend-web
   npm install
   ```
2. Configurar archivo `.env` local en el directorio `frontend-web` (Importante mantener el prefijo `VITE_`):
   ```env
   VITE_API_URL=http://localhost:8000
   ```
3. Inicializar entorno de desarrollo:
   ```bash
   npm run dev
   ```

### 5.4 Despliegue a Produccion
- **Backend:** Se recomienda contenerizar la aplicacion con Docker usando una imagen base ligera de Python (ej. python:3.10-slim) e instanciar Uvicorn tras un balanceador de carga o un reverse proxy como Nginx (Gunicorn con workers Uvicorn).
- **Frontend:** Ejecutar el comando `npm run build`. Esto generara archivos estaticos en la carpeta `dist/`. Dichos archivos deben ser servidos mediante un CDN o servidor web tradicional, asegurandose de redirigir todas las peticiones al `index.html` para no romper el enrutamiento interno de React Router.
