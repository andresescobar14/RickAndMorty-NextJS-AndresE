# Bloque 3: personajes, filtros y rutas dinámicas

## Archivos que conviene leer en este orden

1. `types/character.ts`: forma de los personajes, episodios y respuestas.
2. `services/characters.ts`: funciones pequeñas para pedir datos a la API.
3. `app/(explorer)/page.tsx`: composición del listado.
4. `ResultadosPersonajes` y `TarjetaPersonaje`: petición desde useEffect y conversión de datos en tarjetas.
5. `lib/filters.ts` y `FiltrosPersonajes`: filtros y sincronización con la URL.
6. `app/(explorer)/personaje/[id]/page.tsx`: ficha dinámica.

## Pedir datos

```ts
const respuestaPersonajes = await fetch(direccionApi);
const personajesRecibidos = await respuestaPersonajes.json();
```

`fetch` pide un recurso por HTTP. `await` espera la respuesta.
`respuestaPersonajes.json()` interpreta el texto JSON recibido como datos de JavaScript.
`respuestaPersonajes.ok` indica un estado HTTP exitoso.

Los tipos de TypeScript documentan qué datos esperamos y ayudan al editor,
pero no sustituyen las comprobaciones de respuesta.
Un 404 del listado significa que no hay resultados: devolvemos una lista vacía.
Otros errores interrumpen la carga y llegan a la pantalla de reintento.

## Pedir los datos con useEffect

`ResultadosPersonajes` tiene tres estados principales: los datos, si está cargando
y el posible error. `useEffect` ejecuta la petición al abrir el listado o cambiar
la consulta de la URL.

```tsx
useEffect(() => {
  const cancelacionPeticion = new AbortController();

  async function cargarPersonajes() {
    // Mostrar carga, pedir datos y guardarlos con guardarDatosPersonajes.
  }

  void cargarPersonajes();
  return () => cancelacionPeticion.abort();
}, [consultaPersonajes, intentosPersonajes]);
```

La función del efecto no se declara `async`: dentro creamos una función async
y la llamamos. `void` indica que no devolvemos su promesa a React.
El efecto debe devolver una función de limpieza, no una promesa.

`consultaPersonajes` cambia cuando aplicas búsqueda, filtros o paginación.
`intentosPersonajes` cambia al pulsar «Reintentar». Esas son las dependencias que vuelven a
ejecutar el efecto. No usamos el objeto entero de filtros como dependencia,
porque se crea de nuevo al renderizar y podría provocar peticiones innecesarias.

`AbortController` cancela la consulta anterior si cambia la URL o sales de la
pantalla. También comprobamos `signal.aborted` antes de guardar una respuesta,
para que datos viejos no sustituyan los nuevos.

`FichaPersonaje` sigue el mismo patrón: pide el personaje y después sus episodios
en una sola consulta múltiple. `ColeccionFavoritos` también utiliza useEffect.

## Los metadatos y su caché en el servidor

```ts
const respuestaFicha = await fetch(direccionFicha, { next: { revalidate: 300 } });
```

Solo `consultarPersonajeParaSeo`, utilizado para el SEO, usa esta caché directa de `fetch`.
Los datos visibles se piden con useEffect desde el navegador, como se solicitó.
`revalidate: 300` permite reutilizar la respuesta y renovarla después de cinco minutos.
No se guardan sesiones ni datos de cuenta en esa caché compartida.

## Suspense y las páginas

La página del listado conserva su ruta y metadatos como componente de servidor.
Dentro coloca componentes cliente para leer la URL y pedir la API con useEffect.
`Suspense` permite usar `useSearchParams` durante la navegación; los estados de
carga de la petición se muestran con los estados de React y `TarjetasCargando`.

La página recibe datos y entrega props:

```tsx
<TarjetaPersonaje personaje={personajeDelArchivo} rutaRegreso={rutaRegreso} />
```

`ResultadosPersonajes` utiliza `map` para crear una tarjeta por personaje.
`key={personajeDelArchivo.id}` permite a React reconocer cada elemento cuando cambia la lista.
La tarjeta recibe un personaje; no necesita pedirlo otra vez.

`EtiquetaEstado` traduce el estado y añade un indicador de color. La etiqueta de
texto mantiene la información comprensible aunque no distingas el color.
`etiquetasGeneroPersonaje` contiene las etiquetas españolas del género.

## Imágenes

`next/image` adapta y optimiza los archivos. `width` y `height` reservan espacio
antes de que llegue una imagen. `sizes` indica el ancho aproximado que ocupará
según el tamaño de la pantalla. `remotePatterns` permite el dominio de la API.

Solo la imagen principal del detalle utiliza `preload`. Es la propiedad actual
de Next.js 16 que sustituye a `priority`, ahora obsoleta. Las tarjetas se cargan
de forma diferida para no descargar de golpe todas las imágenes.

## Construir y leer la URL

Ejemplo: `/?name=rick&status=alive&page=2`.

`URLSearchParams` permite leer y escribir cada parámetro sin concatenar texto
manualmente. `leerFiltrosDeUrl` normaliza valores y rechaza páginas o filtros inválidos.
`crearConsultaPersonajes` construye la consulta conservando solo los valores aplicados.

`Pagination` cambia `page` y conserva el resto de filtros. Los extremos no tienen
un enlace activo. Aplicar otro filtro siempre reinicia la página a 1.

## Escribir sin pedir datos por cada tecla

`FiltrosPersonajes` conserva los cuatro controles en un objeto de estado.
`{ ...valoresBusqueda, [filtroModificado]: valorRecibido }` copia los valores
previos y cambia un solo campo. `keyof ControlesBusqueda` limita
`filtroModificado` a los nombres de esos controles.

`useRef` conserva el identificador de un temporizador entre renderizados sin
crear un nuevo estado visual. Antes de iniciar una espera, `clearTimeout`
cancela la anterior. `setTimeout(..., 400)` espera 400 ms antes de aplicar el texto.
Estado y género se aplican inmediatamente. La especie también espera al escribir.

Otra referencia distingue una actualización que hicimos nosotros de una URL
recuperada al volver o avanzar. Así un resultado anterior no sobrescribe texto
que acabas de seguir escribiendo. La limpieza al desmontar cancela esperas pendientes.

## La ficha: /personaje/[id]

`[id]` representa la parte variable de la ruta. `/personaje/1` entrega `id: "1"`.
La página convierte ese texto a número y lo entrega como prop a `FichaPersonaje`.
El efecto de este componente pide el personaje y sus episodios. Si no existe,
se muestra el estado correspondiente; los metadatos también usan `notFound()`
para activar el 404 personalizado desde el servidor.

El personaje incluye URLs de episodios. Extraemos sus ids con `map` y los unimos
con `join(",")`: `/episode/1,2,3` los obtiene en una sola petición.
Cuando la API devuelve un solo objeto, lo convertimos en un array de un elemento
para que la interfaz siempre pueda usar `map` de la misma manera.

El enlace de cada tarjeta guarda su URL de origen en `from`. El botón de volver
recupera esa dirección y mantiene los filtros. `elegirRegresoSeguro` acepta solo
el listado o favoritos y evita convertirlo en un enlace de redirección externo.

`generateMetadata` pide la ficha y produce título, descripción e imagen social
con el personaje. La misma función con caché permite reutilizar esos datos.

## Carga, errores y ausencia de resultados

- `loading.tsx` y `TarjetasCargando` mantienen espacios durante la carga.
- `error.tsx` muestra un mensaje y usa `retry()` para pedir otra vez la ruta.
- Un resultado vacío muestra `ArchivoVacio`, sin tratarlo como un fallo de aplicación.
- Un id inexistente usa `not-found.tsx`.
- `global-error.tsx` incluye su propio documento por si falla el layout raíz.

Referencias: [API oficial](https://rickandmortyapi.com/documentation),
[fetch y revalidación](https://nextjs.org/docs/app/api-reference/functions/fetch),
[imágenes](https://nextjs.org/docs/app/api-reference/components/image).
