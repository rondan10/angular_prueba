# Sistema de Gestión de Libros y Autores

Esta prueba tecnica es una aplicación web completa para la gestión de libros y autores, desarrollada con Angular en el frontend y Node.js en el backend como servicio.
(Al insertar todo tipo de informacion, este se guardara en un archivo json en el backend).

## Descripción

El sistema permite:
- Gestionar autores (crear, editar, eliminar y listar)
- Gestionar libros (crear, editar, eliminar y listar)
- Asociar autores a libros
- Búsqueda y filtrado de libros y autores
- Dashboard para ver tener un mapeo de los libros y autores insertados

## Requisitos Previos

- Node.js (versión 14 o superior)
- Angular CLI (versión 19.2.10)
- npm (administrador de paquetes de Node.js)

## Pasos de Instalación y Ejecución

### 1. Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor:
```bash
node index.js
```

El servidor backend estará ejecutándose en `http://localhost:3000`

### 2. Frontend

1. Navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`
