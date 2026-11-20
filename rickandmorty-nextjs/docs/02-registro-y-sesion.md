# Bloque 2: registro y sesión

## El recorrido completo

```text
FormularioRegistro → registrarExplorador → localStorage (cuentas)
FormularioAcceso → abrirSesionExplorador → iniciarSesionExplorador → localStorage (sesión) + estado de React
ControlSesion → espera la sesión → muestra la página o redirige
```

`services/auth.ts` contiene funciones que trabajan con las cuentas.
`context/AuthContext.tsx` comparte el usuario activo con toda la interfaz.
Los formularios siguen encargándose de sus campos y mensajes.

## 1. Guardar y leer

```ts
localStorage.setItem(CLAVE_CUENTAS_NAVEGADOR, JSON.stringify(cuentasGuardadas));
```

`CLAVE_CUENTAS_NAVEGADOR` es el nombre de la lista dentro del navegador.
`JSON.stringify` convierte el array de usuarios en texto.
`setItem` conserva ese texto incluso al recargar o cerrar y volver a abrir el navegador.

Para leerlo usamos `getItem` y `JSON.parse`. Si todavía no existe una lista,
devolvemos `[]`. Zod comprueba la forma de los datos recuperados.
Si están dañados, mostramos un error en lugar de borrarlos silenciosamente.

`PerfilExplorador` describe los datos públicos: id, nombre, correo y fecha de registro.
`CuentaGuardada` añade los datos necesarios para comprobar la contraseña.
`obtenerPerfilPublico` selecciona únicamente los datos públicos antes de compartirlos con React.

## 2. Buscar cuentas

```ts
cuentasGuardadas.some((cuentaGuardada) => cuentaGuardada.email === valoresRegistro.email)
```

`some` responde `true` si algún usuario cumple la comparación.
Sirve para rechazar un correo que ya existe.
El esquema convierte el correo a minúsculas antes de comparar.

```ts
cuentasGuardadas.find((cuentaGuardada) => cuentaGuardada.email === valoresRegistro.email)
```

`find` devuelve la primera cuenta que coincide, o `undefined` si no existe.
Lo usamos al iniciar sesión. No hay una petición de abrirSesionExplorador a la API de personajes:
las cuentas del ejercicio viven en tu navegador.

## 3. La contraseña

No guardamos el texto original. `crearHuellaContrasena` utiliza Web Crypto y PBKDF2
para producir una huella. La misma contraseña y el mismo `salt` producen
la misma huella, lo que permite comprobarla después.

`salt` es un valor aleatorio propio de la cuenta, creado con `crypto.randomUUID()`.
Dos cuentas con la misma contraseña tendrán huellas diferentes.

Dentro de esta función:

- `TextEncoder` convierte el texto en bytes.
- `importKey` prepara la contraseña para Web Crypto.
- `deriveBits` calcula la huella con PBKDF2 y SHA-256.
- `Uint8Array` permite leer los bytes obtenidos.
- `map` convierte cada byte en texto hexadecimal.
- `join("")` une esos textos en una sola cadena.

La función es `async` porque Web Crypto devuelve promesas.
`await` espera su resultado antes de continuar. El botón muestra un estado
de trabajo y se desactiva mientras esperamos.

Esta autenticación es una simulación frontend exigida por el ejercicio:
el propietario del navegador puede modificar su almacenamiento. Una aplicación
con datos privados reales necesitaría autenticación y autorización en servidor.

## 4. Registro

`registrarExplorador` valida los datos, comprueba el correo, calcula la huella y crea una cuenta.
`new Date().toISOString()` guarda una fecha que no depende del formato local.
`[...cuentasMasRecientes, exploradorActual]` crea un nuevo array con las cuentas anteriores más la nueva.
Se vuelve a leer la lista después del cálculo de la huella para conservar cuentas
que pudieran haberse creado mientras esperábamos.

El registro no inicia sesión automáticamente: muestra una confirmación y el
enlace a `/login`. Tras guardar, vacía las contraseñas del formulario.

## 5. Inicio y cierre de sesión

`iniciarSesionExplorador` busca la cuenta y compara las huellas. Si coinciden, guarda solo
su identificador en `CLAVE_SESION_ACTIVA`. No duplica la contraseña ni todo el perfil
en la sesión. Si no coinciden, lanza un error comprensible.

`recuperarExploradorActivo` lee ese id y busca sus datos actuales. Si la cuenta ya no existe,
descarta la sesión. `cerrarSesionExplorador` borra la sesión con `removeItem`, conservando
las cuentas y los favoritos.

## 6. Context

```tsx
const {
  exploradorActual,
  abrirSesionExplorador,
  cerrarSesionActual,
} = useSesionExplorador();
```

`createContext` crea el canal que permite compartir información.
`ProveedorSesion` guarda el estado y entrega su valor mediante el proveedor.
`useSesionExplorador` utiliza `useContext` para acceder al proveedor más cercano.
Si cambia `exploradorActual`, React actualiza los componentes que leen este contexto.

`exploradorActual` puede ser una cuenta o `null`. `cargandoSesion` indica que
aún estamos recuperando la sesión. `problemaAlmacenamiento` informa si esa
lectura falló.

`useEffect` hace la primera lectura después de que React conecte la interfaz
con el navegador. Durante el primer render tanto servidor como navegador
muestran el mismo estado de carga: así evitamos una diferencia de hidratación.

El evento `storage` recoge cambios hechos desde otra pestaña del mismo sitio.
La función que devuelve el efecto elimina el listener al desmontar el proveedor.

## 7. Proteger las rutas

`ControlSesion` recibe `requireSession`:

- `true`: espera la lectura y redirige a `/login` si no hay sesión.
- `false`: permite login y registro, pero redirige a `/` si ya hay sesión.

Mientras se lee la sesión o se completa una redirección, muestra un mensaje
de carga y no el contenido de la página.
`router.replace` cambia de ruta sin añadir un paso extra al historial.

`app/(auth)/layout.tsx` aplica la segunda regla a login y registro.
`app/(explorer)/layout.tsx` aplica la primera al listado, detalle, favoritos y cuenta.
Las carpetas entre paréntesis no forman parte de la dirección del navegador.

## 8. Manejar fallos y esperar

Los formularios usan `try`, `catch` y `finally`:

- `try` intenta registrar o iniciar sesión.
- `catch` muestra un error si algo falla.
- `finally` vuelve a habilitar el botón tanto si hubo éxito como si hubo error.

`error instanceof Error` comprueba que podemos leer su propiedad `message`.
Nunca imprimimos las credenciales en la consola.

Referencias: [Context](https://react.dev/reference/react/useContext),
[useEffect](https://react.dev/reference/react/useEffect),
[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage),
[Web Crypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveBits).
