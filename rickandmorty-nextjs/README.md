# Rick & Morty Explorer

Proyecto de aprendizaje con Next.js App Router, React, TypeScript, Tailwind CSS y Zod.
La interfaz representa un archivo multiversal: retícula de coordenadas, fichas
numeradas, portal C-137 y acentos azules. Incluye versiones clara y oscura.

## Estado actual

- Registro, correo único, login, sesión persistente y cierre de sesión.
- Rutas privadas y redirección de usuarios conectados fuera de login y registro.
- Listado de personajes, búsqueda con debounce de 400 ms, filtros y paginación en la URL.
- Detalle completo, episodios en una petición y regreso conservando los filtros.
- Favoritos por usuario, contador compartido y consulta de favoritos en una petición.
- Perfil, edición de nombre y cambio de contraseña con comprobación de la actual.
- Tema persistente, preferencia inicial del sistema y aplicación antes del primer pintado.
- Skeletons, estados vacíos, 404, errores con reintento y metadatos propios de cada página.

La publicación en Vercel y el reporte de Lighthouse móvil sobre esa URL se
completan al conectar el despliegue. No se incluyen puntuaciones sin medir.

## Guía para aprender el código

1. [Mapa total del proyecto: archivos, hooks y recorridos](docs/00-guia-total.md).
2. [Formularios, estado, props y componentes](docs/01-formularios.md).
3. [Usuarios, localStorage, Context y sesión](docs/02-registro-y-sesion.md).
4. [API, caché, filtros, URL y detalle](docs/03-personajes-y-url.md).
5. [Favoritos, cuenta y tema](docs/04-favoritos-cuenta-y-tema.md).
6. [Comprobaciones y entrega](docs/05-entrega.md).

## Ejecutar en local

Desde la carpeta de esta aplicación (`rickandmorty-nextjs`):

```bash
npm ci
npm run dev
```

Abre [el formulario de registro](http://localhost:3000/register), crea una cuenta
y después inicia sesión. Las cuentas pertenecen a ese navegador y a esa dirección:
`localhost` y `127.0.0.1` tienen almacenamientos diferentes.

`.env.example` documenta `NEXT_PUBLIC_SITE_URL`. En producción debe ser la URL
real de Vercel para generar enlaces canónicos, Open Graph, robots y sitemap.
Sin esa variable se usa la URL de producción que ofrece Vercel o localhost en local.

Se ha utilizado Node.js 24. Si tu instalación de Windows muestra
`UNABLE_TO_VERIFY_LEAF_SIGNATURE`, utiliza los certificados de confianza del sistema:

```bash
node --use-system-ca node_modules/next/dist/bin/next dev
node --use-system-ca node_modules/next/dist/bin/next build
```

Esto mantiene la verificación de certificados activada.

## Comprobaciones

```bash
npm run lint
npm run build
```

Para ejecutar la versión de producción después del build:

```bash
npm run start
```

## Atomic Design

| Nivel | Ubicación | Responsabilidad |
| --- | --- | --- |
| Átomos | `components/atoms` | Input y botón reutilizables. |
| Moléculas | `components/molecules` | Campo con etiqueta, input y error. |
| Organismos | `components/organisms` | Formularios completos y sus estados. |
| Templates | `components/templates` | Distribución visual compartida. |
| Páginas | `app/**/page.tsx` | Rutas, metadatos y composición. |

Los componentes solo importan componentes de niveles inferiores.
Los esquemas están en `schemas`, las peticiones y el almacenamiento en `services`,
y los contextos en `context`. `AppProviders` compone estos proveedores sin
convertir las páginas de datos en componentes de cliente.
Los estilos compartidos están en `app/globals.css` y las fuentes usan `next/font`.

## Rutas

| Ruta | Acceso | Contenido |
| --- | --- | --- |
| `/login` | Sin sesión | Inicio de sesión. |
| `/register` | Sin sesión | Registro. |
| `/` | Privado | Personajes, filtros y paginación. |
| `/personaje/[id]` | Privado | Ficha y episodios. |
| `/favoritos` | Privado | Colección del usuario. |
| `/mi-cuenta` | Privado | Perfil y edición. |

Las carpetas `(auth)` y `(explorer)` comparten layouts sin alterar las URLs.

## Persistencia y API

El ejercicio utiliza `useContext` y `localStorage`, sin backend ni base de datos.
Las contraseñas se guardan como huellas PBKDF2 con salt propio. La sesión almacena
solo un id. Esta simulación local no sustituye una autorización real en servidor.

Los datos vienen de [la API de Rick y Morty](https://rickandmortyapi.com/documentation).
Listado, detalle, episodios y favoritos se piden desde `useEffect` en componentes
cliente. Cada efecto maneja carga, error y cancelación con `AbortController`.
Los metadatos dinámicos del personaje se generan en servidor con una consulta
que utiliza `next: { revalidate: 300 }`. Esa caché sirve al SEO; no es un temporizador
de las peticiones que hace el navegador.
Todas las imágenes de personajes utilizan `next/image`. La imagen principal
del detalle utiliza `preload`, sustituto actual de `priority` en Next.js 16.

## Despliegue y entregables pendientes

Repositorio: [RickAndMorty-NextJS-AndresE](https://github.com/andresescobar14/RickAndMorty-NextJS-AndresE).

En Vercel, importa ese repositorio y selecciona `rickandmorty-nextjs` como
Root Directory. Configura `NEXT_PUBLIC_SITE_URL` con el dominio público real.
Vercel debe ejecutar el build de Next.js y desplegar los pushes a `main`.

- URL de Vercel: pendiente de publicar.
- Reporte Lighthouse móvil en Vercel y captura: pendiente de medir.
- El historial de commits debe reflejar los avances de desarrollo antes de entregar.
