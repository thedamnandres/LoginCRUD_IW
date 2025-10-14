# LoginCRUD_IW

Proyecto de autenticación y CRUD de usuarios con separación frontend / backend y orquestación con Docker Compose.

## Índice
- Descripción
- Arquitectura del proyecto
- Requisitos previos
- Configuración
- Ejecución con Docker
- Variables de entorno
- Endpoints y URLs locales
- Estructura de carpetas
- Comandos útiles
- Tecnologías
- Autores
- Licencia
- Referencias

## Descripción
LoginCRUD_IW implementa registro, inicio de sesión y operaciones CRUD de usuarios.
El repositorio incluye un archivo docker-compose.yml en la raíz para levantar los servicios de manera consistente en desarrollo.

## Arquitectura del proyecto
- Backend API (por ejemplo, .NET/Node) expuesto en el puerto <PUERTO_BACKEND_HOST> -> contenedor <PUERTO_BACKEND_CONTAINER>
- Frontend (React/Vite u otra) expuesto en el puerto <PUERTO_FRONTEND_HOST> -> contenedor <PUERTO_FRONTEND_CONTAINER>
- Base de datos (por ejemplo, SQL Server o PostgreSQL) expuesta en el puerto <PUERTO_DB_HOST> -> contenedor <PUERTO_DB_CONTAINER>
- Red interna de Docker para comunicación entre servicios

Revisar docker-compose.yml para confirmar nombres de servicios, puertos y dependencias.

## Requisitos previos
- Docker Desktop o Docker Engine 24+
- Docker Compose v2
- Git

## Configuración
1) Clonar el repositorio:
   git clone https://github.com/thedamnandres/LoginCRUD_IW.git
   cd LoginCRUD_IW

2) Variables de entorno:
   - Crear los archivos de entorno necesarios:
     - backend: crear .env (o usar appsettings si es .NET)
     - frontend: crear .env.local (por ejemplo con VITE_API_URL)
     - base de datos: variables en docker-compose.yml (ej. SA_PASSWORD/POSTGRES_PASSWORD)
   - Ver la sección "Variables de entorno" más abajo.

3) Confirmar puertos en docker-compose.yml y que no haya colisiones en tu máquina:
   - FRONTEND: <PUERTO_FRONTEND_HOST>:<PUERTO_FRONTEND_CONTAINER>
   - BACKEND:  <PUERTO_BACKEND_HOST>:<PUERTO_BACKEND_CONTAINER>
   - DB:       <PUERTO_DB_HOST>:<PUERTO_DB_CONTAINER>

## Ejecución con Docker
Construir e iniciar en segundo plano:
   docker compose up -d --build

Ver logs de todos los servicios:
   docker compose logs -f

Apagar servicios:
   docker compose down

Recrear solo un servicio (ejemplo backend):
   docker compose up -d --build backend

## Variables de entorno
Ejemplos genéricos (ajustar según tu stack y docker-compose.yml):

Backend (.env o appsettings):
- ConnectionStrings__DefaultConnection=Server=db;Database=<DB_NAME>;User Id=<DB_USER>;Password=<DB_PASSWORD>;TrustServerCertificate=True
- JWT__Secret=<CLAVE_SECRETA_JWT>
- ASPNETCORE_URLS=http://+:<PUERTO_BACKEND_CONTAINER>   (si es .NET)

Frontend (.env.local):
- VITE_API_URL=http://localhost:<PUERTO_BACKEND_HOST>

Base de datos (en docker-compose.yml o .env):
- SA_PASSWORD=<DB_PASSWORD>                  (SQL Server)
- ACCEPT_EULA=Y                              (SQL Server)
- POSTGRES_PASSWORD=<DB_PASSWORD>            (PostgreSQL)
- POSTGRES_DB=<DB_NAME>
- MONGO_INITDB_ROOT_USERNAME=<DB_USER>       (MongoDB)
- MONGO_INITDB_ROOT_PASSWORD=<DB_PASSWORD>

## Endpoints y URLs locales
- Frontend:  http://localhost:<PUERTO_FRONTEND_HOST>
- Backend:   http://localhost:<PUERTO_BACKEND_HOST>  (ejemplos)
  - /api/health
  - /api/auth/login
  - /api/auth/register
  - /api/users (CRUD)

Ajustar con las rutas reales que expone tu backend.

## Estructura de carpetas
- /Frontend        Código del cliente (React/TypeScript)
- /backend         API (controladores, servicios, modelos)
- /docker-compose.yml  Orquestación de servicios

La distribución exacta puede variar; confirmar en el repositorio.

## Comandos útiles
Reconstruir todo:
   docker compose build --no-cache

Reiniciar un servicio:
   docker compose restart <servicio>

Entrar a un contenedor:
   docker compose exec <servicio> sh
   docker compose exec <servicio> bash

Ver redes/puertos:
   docker network ls
   docker ps

## Tecnologías
- Contenedores y orquestación: Docker, Docker Compose
- Frontend: React + TypeScript (confirmar versión en package.json)
- Backend: .NET/Node (confirmar en backend)
- Base de datos: confirmar imagen utilizada en docker-compose.yml (SQL Server/PostgreSQL/MongoDB)

## Autores
- Andrés Jiménez
- Esteban Narváez

## Licencia
Este proyecto se distribuye bajo la licencia indicada en el repositorio (si aplica).

## Referencias
- Repositorio: https://github.com/thedamnandres/LoginCRUD_IW
- Archivo docker-compose.yml en la raíz del proyecto
