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

## Estructura del Proyecto

### Frontend
- `components/`: Componentes de la aplicación
  - `author-form/`: Formulario para crear/editar autores
  - `author-list/`: Lista y gestión de autores
  - `book-form/`: Formulario para crear/editar libros
  - `book-list/`: Lista y gestión de libros
  - `dashboard/`: Página principal
- `models/`: Interfaces de datos
- `services/`: Servicios para comunicación con el backend

### Backend
- `data/`: Archivos JSON para almacenamiento de datos
  - `authors.json`: Datos de autores
  - `books.json`: Datos de libros

## Comandos Útiles

### Frontend

#### Servidor de Desarrollo
```bash
ng serve
```

#### Generar Nuevo Componente
```bash
ng generate component nombre-componente
```

#### Compilar para Producción
```bash
ng build
```

#### Ejecutar Pruebas Unitarias
```bash
ng test
```

## Soporte

Para más información sobre Angular CLI, visita la [documentación oficial de Angular](https://angular.dev/tools/cli).
