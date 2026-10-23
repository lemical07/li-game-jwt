# API de autenticación JWT para el Gremio

API REST de ejemplo construida con Node.js y Express. El proyecto explora la autenticación con Passport Local, la emisión y validación de tokens JWT y la autorización de operaciones para usuarios administradores.

## Estado del proyecto

El proyecto se encuentra en desarrollo y no está listo para usarse como servicio de producción. Aunque las rutas principales están definidas, la implementación actual contiene errores en la validación y los middlewares de autenticación, además de una discrepancia entre el controlador y el servicio al registrar recompensas. Por ello, las rutas protegidas no deben considerarse operativas hasta corregir y probar esos flujos.

La ruta de salud sí está implementada de forma independiente:

```http
GET /health
```

Respuesta:

```json
{
  "estado": "ok",
  "version": "1.0.0",
  "servicio": "api-jwt-passport-gremio"
}
```

## Funcionalidad prevista

- Autenticar cazadores con usuario y contraseña mediante Passport Local.
- Emitir tokens JWT firmados con HS256 y una duración de dos horas.
- Proteger recursos mediante un token enviado como `Bearer`.
- Restringir el registro de recompensas a usuarios con el atributo `admin`.
- Validar los datos de entrada de autenticación y recompensas.

## Tecnologías

- Node.js 20.19.0 o posterior.
- Express 5.
- Passport, Passport Local y Passport JWT.
- `jsonwebtoken` para la firma de tokens.
- `express-validator` para validar solicitudes.
- Mongoose está incluido y define un esquema de cazador, pero la aplicación no establece una conexión con MongoDB ni usa el modelo para persistir datos.

## Requisitos

- Node.js 20.19.0 o posterior y npm.
- No se necesita MongoDB para ejecutar la versión actual: los cazadores de ejemplo se cargan desde el código y las recompensas se mantienen en memoria.

## Instalación y ejecución

Instala las dependencias:

```bash
npm install
```

Configura las variables de entorno antes de iniciar el servidor. En PowerShell:

```powershell
$env:JWT_SECRET = "reemplaza-por-un-secreto-aleatorio-largo"
$env:PORT = "3000"
npm run dev
```

En macOS o Linux:

```bash
export JWT_SECRET="reemplaza-por-un-secreto-aleatorio-largo"
export PORT=3000
npm run dev
```

El servidor inicia por defecto en `http://localhost:3000`. `PORT` es opcional. La aplicación no carga archivos `.env`; las variables deben estar definidas en el entorno del proceso.

`JWT_SECRET` debe configurarse explícitamente con un valor aleatorio y privado. El código incluye un valor predeterminado conocido, que no es seguro y no debe utilizarse fuera del desarrollo local.

El modo de desarrollo usa Nodemon:

```bash
npm run dev
```

## Rutas de la API

Las rutas de negocio se montan bajo `/api/v1`. Los siguientes endpoints describen el contrato previsto por el código; debido al estado señalado arriba, no se garantiza que los flujos protegidos respondan correctamente.

| Método | Ruta | Acceso | Propósito |
| --- | --- | --- | --- |
| `POST` | `/api/v1/users/authenticate` | Público | Validar credenciales y emitir un JWT. |
| `GET` | `/api/v1/user/list` | JWT requerido | Consultar la identidad autenticada y los perfiles de cazadores. |
| `POST` | `/api/v1/boveda/recompensa` | JWT de administrador requerido | Registrar una recompensa para una misión. |

### Autenticación

Solicitud:

```http
POST /api/v1/users/authenticate
Content-Type: application/json
```

```json
{
  "username": "nombre-de-usuario",
  "password": "contraseña"
}
```

El contrato de respuesta implementado por el controlador contiene un token de tipo `Bearer`, el tiempo de expiración y el perfil del cazador:

```json
{
  "token": "<jwt>",
  "tipo": "Bearer",
  "expiraEn": "2h",
  "cazador": {
    "id": "<id>",
    "username": "nombre-de-usuario",
    "name": "Nombre del cazador",
    "rango": "B",
    "admin": false
  }
}
```

### Listado de perfiles

```http
GET /api/v1/user/list
```

Envía el token en el encabezado de autorización con el esquema `Bearer`. La respuesta prevista incluye las reclamaciones de identidad en `identidadToken` y los perfiles en `data`.

### Registro de recompensa

```http
POST /api/v1/boveda/recompensa
Content-Type: application/json
```

Envía un token de administrador en el encabezado de autorización con el esquema `Bearer`.

```json
{
  "mision": "Nombre de la misión",
  "cristales": 150
}
```

La solicitud valida una misión de 3 a 80 caracteres y una cantidad entera de cristales entre 1 y 100000. La respuesta prevista es `201 Created` con la recompensa creada en `data`.

## Datos y persistencia

Los usuarios de ejemplo están definidos en `src/models/cazador.model.js` y se consultan desde memoria. Sus contraseñas son datos de demostración almacenados en texto plano: no se deben reutilizar ni tratar como credenciales seguras.

Las recompensas se guardan en un arreglo en memoria. Se pierden al reiniciar el proceso. Aunque el proyecto declara un esquema Mongoose, actualmente no hay conexión a MongoDB ni persistencia de cazadores o recompensas.

## Estructura del proyecto

```text
src/
├── app.js                       Configuración de Express y montaje de rutas
├── server.js                    Inicio del servidor HTTP
├── config/
│   └── passport.js              Estrategias Local y JWT
├── controllers/
│   └── auth.controller.js       Controladores de autenticación y recompensas
├── dtos/
│   └── cazador.dto.js           DTOs de credenciales, perfil y recompensa
├── middlewares/
│   ├── auth.middleware.js       Autenticación y autorización
│   └── error.middleware.js      Respuestas de error y rutas inexistentes
├── models/
│   └── cazador.model.js         Esquema Mongoose y datos de ejemplo
├── routes/
│   └── auth.routes.js           Definición de endpoints
├── services/
│   └── cazador.service.js       Búsqueda, JWT y recompensas en memoria
└── validators/
    └── auth.validator.js        Validaciones de entrada
```

## Pruebas

El proyecto no tiene pruebas automatizadas configuradas. El script `npm test` termina con un mensaje indicando que no hay pruebas especificadas; `test/api.test.js` está vacío.
