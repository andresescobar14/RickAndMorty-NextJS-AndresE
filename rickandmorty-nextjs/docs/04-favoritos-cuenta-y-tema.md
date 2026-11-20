# Bloque 4: favoritos, cuenta y tema

## Favoritos por usuario

La clave tiene esta forma: `rick-morty:favorites:ID_DEL_USUARIO`.
Cada cuenta guarda solo un array de identificadores, por ejemplo `[1, 5, 20]`.

```ts
const favoritosActualizados = identificadoresFavoritos.includes(identificadorFavoritos)
  ? identificadoresFavoritos.filter((identificadorGuardado) => identificadorGuardado !== identificadorFavoritos)
  : [...identificadoresFavoritos, identificadorFavoritos];
```

`includes` pregunta si el id ya está. Si está, `filter` crea una lista sin él.
Si no está, copiamos la lista y añadimos el id. El guardado ocurre antes de
actualizar React: si falla, no mostramos un cambio que no quedó persistido.

`ProveedorFavoritos` comparte los `identificadoresFavoritos` con tarjetas,
detalle, contador y cuenta.
No escribe una lista vacía al arrancar: primero lee lo que ya estaba guardado.
`FavoritosDeLaCuenta` utiliza el id del usuario como `key` del proveedor. Al cambiar
de cuenta, React crea un estado nuevo para esa cuenta y evita mostrar los datos
de la anterior.

`BotonFavorito` recibe `identificadorPersonaje` y `nombrePersonaje` por props.
El nombre permite construir
una etiqueta accesible como «Agregar a Rick Sanchez a favoritos».
`aria-pressed` informa de si el personaje ya está guardado.

`ColeccionFavoritos` pide todos los personajes con `/character/1,5,20`, en una sola
consulta. Las peticiones se cancelan con `AbortController` si sales de la pantalla
o cambia la lista. Así una respuesta vieja no reemplaza otra nueva.
Al quitar un favorito, la tarjeta desaparece inmediatamente por el filtro de
identificadores
y la lista se sincroniza sin recargar la página.

## Editar la cuenta

`PanelCuenta` muestra nombre, correo, fecha y número de favoritos del contexto.
`Intl.DateTimeFormat` presenta la fecha guardada en un formato legible en español.

El formulario de nombre valida, guarda y actualiza el usuario del contexto.
Eso también cambia el nombre de la navegación. El de contraseña tiene su propio
estado y mensajes para mantener ambas acciones independientes.

Antes de cambiar una contraseña se comprueba la actual. Si es correcta,
se crean un salt y una huella nuevos. Después se vacían los campos de contraseña.
El correo, la fecha de registro y los favoritos no se modifican.

## Cambiar todos los colores con una clase

`:root` define los colores claros y `.dark` sustituye esas mismas variables
con la paleta negra y azul. Los componentes usan `var(--background)`,
`var(--foreground)`, `var(--panel)` y otras variables compartidas.

```ts
document.documentElement.classList.toggle("dark", temaElegido === "dark");
```

`document.documentElement` es `<html>`. `classList.toggle` añade la clase cuando
el segundo argumento es `true` y la quita cuando es `false`.
El atributo `color-scheme` también adapta los controles nativos del navegador.

`ProveedorTema` guarda la elección y la comparte mediante Context.
`matchMedia` consulta el modo de la computadora o el teléfono cuando aún no has
elegido uno. Si el sistema cambia y no hay una preferencia guardada, la app lo sigue.
El evento `storage` sincroniza cambios hechos desde otra pestaña.

El interruptor global se encuentra dentro de los proveedores y fuera de los
layouts específicos: aparece también en abrirSesionExplorador, registro y el 404 público.
`role="switch"` y `aria-checked` describen su estado a tecnologías de asistencia.

## Evitar el destello al recargar

Un efecto de React se ejecuta después del primer render. Si esperáramos solo
a ese efecto para aplicar el tema, podríamos ver antes otro color.
Por eso el layout incluye un script pequeño que lee la preferencia y aplica
la clase antes de pintar la página.

`dangerouslySetInnerHTML` permite colocar ese texto JavaScript dentro del script.
Su contenido es una constante escrita en el proyecto, no texto recibido de un usuario.
`suppressHydrationWarning` se limita a `<html>`, porque el script cambia su clase
antes de que React hidrate el documento.

## El diseño del archivo

La identidad mantiene la retícula, rótulos monoespaciados, coordenadas y esquinas
azules de los formularios. Las tarjetas funcionan como fichas numeradas.
Las imágenes del personaje aportan contenido; los tonos azules organizan las acciones.

Las reglas `@media` cambian columnas y espacios en pantallas pequeñas.
Los esqueletos respetan `prefers-reduced-motion`: si el usuario pide menos
movimiento, no animamos su opacidad. Los indicadores de estado también usan texto,
para no depender exclusivamente de verde o rojo.
