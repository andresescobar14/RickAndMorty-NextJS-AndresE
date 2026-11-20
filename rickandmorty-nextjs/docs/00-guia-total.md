# Mapa total: entender Rick & Morty Explorer

Esta es la puerta de entrada al proyecto. No hace falta memorizarlo de una vez:
léelo en el orden indicado y abre los archivos mientras avanzas.

## 1. Qué construye esta aplicación

Rick & Morty Explorer es un archivo de personajes con cuentas locales. Una
persona puede registrarse, iniciar sesión, buscar y filtrar personajes, abrir
su ficha, guardar favoritos, cambiar sus datos y elegir tema claro u oscuro.

No existe un servidor de cuentas: este ejercicio guarda las cuentas y los
favoritos en el `localStorage` del navegador. La información de los personajes
viene de la API pública de Rick and Morty.

```text
Persona usando el navegador
        │
        ├── Formularios → Zod comprueba los datos
        ├── Context → comparte sesión, favoritos y tema
        ├── localStorage → conserva cuenta, sesión, favoritos y tema
        └── useEffect → pide personajes a la API cuando hace falta
```

## 2. Orden recomendado para estudiar

1. Abre `app/layout.tsx`: es el documento HTML común y el punto donde entran
   fuentes, estilos y proveedores.
2. Sigue con `components/AppProviders.tsx`: junta los tres contextos.
3. Lee `app/(auth)/register/page.tsx` y `components/organisms/RegisterForm.tsx`.
4. Continúa en `schemas/auth.ts` y `services/auth.ts` para ver validación y
   almacenamiento.
5. Revisa `context/AuthContext.tsx` y `components/organisms/AuthGate.tsx` para
   comprender sesión y rutas protegidas.
6. Abre `app/(explorer)/page.tsx`, `CharacterFilters.tsx` y
   `CharacterResults.tsx` para el listado.
7. Lee `services/characters.ts` y `types/character.ts` para comprender la API.
8. Termina con favoritos, cuenta y tema.

## 3. Mapa de carpetas

```text
app/                       Rutas de Next.js, layouts, SEO y pantallas globales
components/atoms/          Piezas visuales mínimas y reutilizables
components/molecules/      Unión de átomos: tarjeta, campo, paginación
components/organisms/      Bloques completos: formularios, filtros, ficha
components/templates/      Distribuciones que comparten varias pantallas
context/                   Estado compartido entre componentes
schemas/                   Reglas de validación Zod
services/                  API externa y acceso a localStorage
lib/                       Ayudantes puros: filtros, textos y SEO
types/                     Formas de datos de TypeScript
docs/                      Explicaciones de aprendizaje y entrega
```

Esto se llama **Atomic Design**. No es obligatorio usarlo en toda aplicación,
pero aquí ayuda a decidir dónde poner cada cosa: un botón no conoce una cuenta,
un formulario sí; una plantilla decide distribución, no valida contraseñas.

## 4. Rutas y layouts

| Archivo | URL | Qué hace |
| --- | --- | --- |
| `app/layout.tsx` | todas | Define `<html lang="es">`, fuentes, metadatos base y proveedores. |
| `app/(auth)/layout.tsx` | `/login`, `/register` | Muestra solo visitantes sin sesión. |
| `app/(auth)/login/page.tsx` | `/login` | Compone el formulario de acceso. |
| `app/(auth)/register/page.tsx` | `/register` | Compone el formulario de registro. |
| `app/(explorer)/layout.tsx` | rutas privadas | Protege el área y añade la navegación. |
| `app/(explorer)/page.tsx` | `/` | Junta título, filtros y resultados. |
| `app/(explorer)/personaje/[id]/page.tsx` | `/personaje/1` | Lee un id de la URL y abre una ficha. |
| `app/(explorer)/favoritos/page.tsx` | `/favoritos` | Muestra la colección de la cuenta. |
| `app/(explorer)/mi-cuenta/page.tsx` | `/mi-cuenta` | Muestra edición de perfil y contraseña. |

`(auth)` y `(explorer)` son **grupos de rutas**. Ordenan archivos, pero sus
nombres no se añaden a la dirección. `[id]` es un segmento dinámico: Next lo
convierte en el id del personaje solicitado.

Los archivos `loading.tsx`, `error.tsx`, `not-found.tsx` y `global-error.tsx`
son convenciones de Next. No los llamamos manualmente: Next muestra cada uno
cuando está cargando, ocurre un error o no existe una ruta o personaje.

## 5. Server Components y Client Components

En App Router una página es de servidor por defecto. Es útil para metadatos y
para enviar menos JavaScript. Un archivo empieza con `"use client"` solo si
necesita interacción del navegador.

| Necesidad | Ejemplos en el proyecto | Motivo |
| --- | --- | --- |
| Servidor | páginas, layouts, metadata, sitemap, robots | No usan clics, estado ni `localStorage`. |
| Cliente | formularios, filtros, resultados, ficha, contextos | Usan eventos, hooks, `window` o `localStorage`. |

No se puede usar `localStorage` en el servidor porque allí no existe el
navegador. Por eso los proveedores y formularios llevan `"use client"`.

## 6. Los hooks de React, sin misterio

### useState

`useState` recuerda un valor entre dibujados de React. Siempre devuelve dos
cosas: el valor y una función que lo cambia.

```tsx
const [cargandoFicha, marcarCargaFicha] = useState(true);
```

Aquí `cargandoFicha` se lee para mostrar una pantalla de carga. Cuando termina
la petición, `marcarCargaFicha(false)` cambia el valor y React dibuja la ficha.

Se usa en formularios, pantallas de carga, mensajes de error y resultados de
la API. Nombres como `guardarFichaPersonaje`, `marcarCargaFicha` y
`mostrarProblemaFicha` dicen exactamente qué modifica cada función.

### useEffect

`useEffect` ejecuta trabajo **después** de dibujar el componente. Se utiliza
cuando React tiene que conversar con algo externo: una API, `localStorage`,
eventos del navegador o un temporizador.

```tsx
useEffect(() => {
  const cancelacionPeticion = new AbortController();

  async function cargarPersonajes() {
    const resultadoPersonajes = await consultarPersonajes(filtrosAplicados);
    guardarDatosPersonajes(resultadoPersonajes);
  }

  void cargarPersonajes();
  return () => cancelacionPeticion.abort();
}, [consultaPersonajes, intentosPersonajes]);
```

- La lista entre corchetes son las **dependencias**. Si cambia una, React repite
  el efecto.
- `cargarPersonajes` es `async` porque `fetch` tarda. El efecto exterior no lo
  es: React espera que devuelva una limpieza, no una promesa.
- `AbortController` cancela una petición antigua al cambiar filtros o abandonar
  la pantalla. Evita que una respuesta vieja reemplace datos nuevos.
- `void` significa que iniciamos la promesa sin devolverla a React.

Se usa en `CharacterResults`, `CharacterDetail`, `FavoritesList`, los tres
proveedores de contexto y `AuthGate`.

### useContext

`useContext` lee un valor compartido sin pasarlo por props a cada nivel.

```tsx
const { exploradorActual, cerrarSesionActual } = useSesionExplorador();
```

`ProveedorSesion` coloca esos datos arriba del árbol. Cualquier componente que
esté dentro puede llamar `useSesionExplorador()`. Lo mismo ocurre con
`useFavoritosExplorador()` y `useTemaVisual()`.

Context es apropiado para información realmente compartida: sesión, tema y
favoritos. Un texto que solo usa un formulario sigue en su `useState` local.

### useRef

`useRef` guarda un valor que no debe cambiar lo que se ve en pantalla. En
`CharacterFilters` conserva el id de `setTimeout` para el debounce de 400 ms.
Al escribir otra letra, se cancela el temporizador anterior; la URL solo cambia
cuando la persona deja de escribir un momento.

### Hooks de Next.js

- `useRouter()` permite cambiar la ruta sin recargar. Se usa para redirigir y
  para actualizar filtros con `replace`.
- `useSearchParams()` lee `?page=2&name=Rick`. Los filtros se guardan ahí para
  que se puedan compartir, recargar y usar con Atrás/Adelante.

## 7. Contextos: qué comparte cada uno

| Archivo | Valores compartidos | Acciones |
| --- | --- | --- |
| `AuthContext.tsx` | `exploradorActual`, `cargandoSesion`, problema de almacenamiento | abrir/cerrar sesión, cambiar nombre y clave. |
| `FavoritesContext.tsx` | `identificadoresFavoritos`, carga y problema | `alternarPersonajeFavorito`. |
| `ThemeContext.tsx` | `temaElegido`, preparado y problema | `alternarTemaVisual`. |

`components/AppProviders.tsx` los anida en un único punto. El proveedor de
favoritos recibe el id de la cuenta. Su `key` cambia al entrar con otra cuenta,
por lo que React reinicia la colección y no mezcla favoritos de dos personas.

## 8. Servicios: dónde viven los datos

### `services/auth.ts`

| Función | Explicación sencilla |
| --- | --- |
| `registrarExplorador` | Valida, evita correos repetidos, crea la cuenta y la guarda. |
| `iniciarSesionExplorador` | Busca el correo, compara la contraseña y guarda el id de sesión. |
| `recuperarExploradorActivo` | Lee el id de sesión y devuelve el perfil público correspondiente. |
| `cerrarSesionExplorador` | Borra solo el id de sesión; no borra cuenta ni favoritos. |
| `guardarNombreExplorador` | Cambia el nombre de la cuenta conectada. |
| `cambiarClaveExplorador` | Comprueba la clave actual y guarda una huella nueva. |

La contraseña no se almacena como texto. `crearHuellaContrasena` usa Web Crypto,
PBKDF2, SHA-256 y una sal aleatoria. Es una buena simulación local, pero no
convierte `localStorage` en un sistema de autenticación de servidor: quien
controla el navegador aún puede alterar sus propios datos.

### `services/characters.ts`

| Función | Petición |
| --- | --- |
| `consultarPersonajes` | `/character` con nombre, estado, género, especie y página. |
| `consultarPersonaje` | `/character/:id` para una ficha. |
| `consultarEpisodios` | `/episode/1,2,3` en una sola petición. |
| `consultarPersonajeParaSeo` | La ficha mínima usada solo por `generateMetadata`. |

`consultarPersonajes` traduce un 404 a una lista vacía porque para la pantalla
eso significa «no encontramos coincidencias». En detalle un 404 se transforma
en personaje inexistente. Otro estado HTTP no correcto se convierte en error y
la interfaz enseña el botón Reintentar.

### `services/favorites.ts`

`crearClaveFavoritos` construye una clave única por cuenta. Leer y guardar
favoritos usa esa clave. `consultarPersonajesFavoritos` pide los ids juntos a
la API, en lugar de hacer una petición por tarjeta.

### `schemas` y `lib`

- `schemas/auth.ts` y `schemas/account.ts` contienen reglas de Zod.
- `lib/filters.ts` convierte una URL en filtros seguros, vuelve a construir la
  consulta y evita destinos externos al regresar desde una ficha.
- `lib/labels.ts` traduce valores que entrega la API.
- `lib/metadata.ts` crea los metadatos repetidos de las páginas.

## 9. De dónde salen los personajes

`types/character.ts` documenta la forma de los datos. Las propiedades
`name`, `status`, `species`, `image` y `episode` se mantienen en inglés porque
son exactamente las que entrega la API externa. No son nombres genéricos del
proyecto: son parte de ese contrato externo. Las variables propias sí usan
nombres en español, por ejemplo `personajeDelArchivo` y
`identificadoresEpisodios`.

El recorrido del listado es:

```text
URL → leerFiltrosDeUrl → crearConsultaPersonajes
    → useEffect de ResultadosPersonajes
    → consultarPersonajes → estado de React → TarjetaPersonaje
```

El recorrido del detalle es:

```text
/personaje/42 → id validado → FichaPersonaje
  → consultarPersonaje(42)
  → extraer ids de episode
  → consultarEpisodios(ids)
  → imagen, datos y lista de episodios
```

## 10. Componentes visuales

### Átomos

- `Button.tsx`: botón con estilos compartidos.
- `Input.tsx`: input con borde, foco y accesibilidad.
- `CharacterImage.tsx`: envuelve `next/image` y aporta un reemplazo si falla.
- `FavoriteButton.tsx`: botón de corazón conectado al contexto.
- `StatusBadge.tsx`: traduce estado y lo muestra con texto y color.
- `ThemeToggle.tsx`: interruptor de tema global.

### Moléculas

- `FormField.tsx`: etiqueta + input + error accesible.
- `CharacterCard.tsx`: imagen, enlace, estado y favorito de una ficha breve.
- `Pagination.tsx`: anterior/siguiente conservando los filtros.
- `CharacterSkeletons.tsx`: tarjetas mientras llega la API.
- `EmptyState.tsx`: mensaje reutilizable cuando no hay datos.

### Organismos

- `LoginForm.tsx` y `RegisterForm.tsx`: estados de campos, Zod y envío.
- `AuthGate.tsx`: espera la sesión y redirige según la regla de acceso.
- `Navigation.tsx`: enlaces, contador de favoritos y salida.
- `CharacterFilters.tsx`: controles, URL, debounce y limpieza.
- `CharacterResults.tsx`: petición del listado y sus cuatro estados.
- `CharacterDetail.tsx`: ficha, episodios, carga, error y reintento.
- `FavoritesList.tsx`: una petición conjunta y actualización inmediata.
- `AccountPanel.tsx`: resumen, nombre, contraseña y salida.
- `ErrorState.tsx`: mensaje de reintento reutilizable.

### Templates

`AuthTemplate.tsx` mantiene coherentes registro y acceso. `ExplorerTemplate.tsx`
coloca navegación, cabecera y contenido privado. Las páginas no duplican esos
marcos visuales.

## 11. Tema y estilos

`app/globals.css` define primero variables de color claro en `:root` y después
las sustituye en `.dark`. Los componentes no repiten colores: usan variables
como `var(--background)`, `var(--panel)` y `var(--accent)`.

`ThemeContext.tsx` aplica la clase `dark` en `<html>` y guarda la elección. Si
todavía no hay una elección, consulta la preferencia del sistema con
`matchMedia`. El pequeño script de `app/layout.tsx` ejecuta esa decisión antes
del primer pintado, para evitar el destello claro/oscuro al recargar.

Los estilos incluyen diseño adaptable y respetan `prefers-reduced-motion` en
los esqueletos. Así se reduce animación si la persona lo configuró en su
sistema.

## 12. SEO y rendimiento

Cada página tiene título, descripción, canonical, Open Graph y Twitter con
`crearMetadatosPagina`. La ruta de personaje usa `generateMetadata` para poner
nombre e imagen reales en un enlace compartido. `robots.ts` y `sitemap.ts`
generan los archivos de buscadores.

Las imágenes usan `next/image`; sus tamaños reservan espacio y evitan saltos
visuales. Solo la imagen principal del detalle usa `preload`, porque es la más
importante. La consulta para los metadatos se revalida cada cinco minutos;
las consultas visibles se hacen en `useEffect`, como pide este proyecto.

## 13. Nombres y limpieza del código

Una variable debe responder «¿qué guarda?» y una función «¿qué hace?». Por eso
el proyecto prefiere `mostrarProblemaFicha` a `setError` y
`alternarPersonajeFavorito` a `toggle`.

Hay excepciones razonables: atributos HTML (`id`, `value`, `onChange`), nombres
de Zod (`error`) y campos que exige la API (`name`, `image`). Cambiarlos haría
más difícil usar las bibliotecas y no daría más información.

`JSDoc` encima de componentes, hooks y servicios explica sus parámetros,
resultado y, cuando conviene, un ejemplo. TypeScript protege tipos durante el
desarrollo; no valida datos recibidos de Internet, por eso Zod y las
comprobaciones HTTP siguen siendo necesarias.

## 14. Después de entenderlo

1. Cambia un texto visual pequeño y observa qué archivo se modifica.
2. Añade un filtro nuevo siguiendo el camino URL → `FiltrosPersonajes` →
   `lib/filters.ts` → API.
3. Agrega una propiedad al perfil pasando por esquema → servicio → contexto →
   panel de cuenta.
4. Finalmente, despliega en Vercel y mide Lighthouse en producción.

El resto de los documentos profundiza en cada tema: [formularios](01-formularios.md),
[sesión](02-registro-y-sesion.md), [API](03-personajes-y-url.md),
[favoritos y tema](04-favoritos-cuenta-y-tema.md) y
[comprobaciones](05-entrega.md).
