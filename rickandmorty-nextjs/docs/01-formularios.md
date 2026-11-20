# Bloque 1: rutas, componentes y formularios

Lee primero la [guía total](00-guia-total.md). Este documento se concentra en
las pantallas de registro e inicio de sesión.

## La ruta que forma cada archivo

Las carpetas entre paréntesis agrupan archivos, pero no aparecen en la URL:

```text
app/(auth)/login/page.tsx       → /login
app/(auth)/register/page.tsx    → /register
app/(explorer)/page.tsx         → /
```

Una página decide **qué** se muestra en una ruta. La parte interactiva vive en
un componente separado:

```text
page.tsx
  PlantillaAutenticacion
    FormularioAcceso o FormularioRegistro
      CampoFormulario
        EntradaTexto
      BotonAccion
```

Este reparto evita que una página tenga a la vez el diseño, todos los campos,
la validación y el guardado. Cada archivo tiene una tarea pequeña.

## JSX y props

JSX es la forma de describir HTML desde TypeScript. Las etiquetas en minúscula,
como `form`, `label` e `input`, son HTML. Las que empiezan con mayúscula, como
`CampoFormulario`, son componentes de React.

```tsx
<CampoFormulario
  id="register-name"
  label="Nombre"
  value={nombreExplorador}
  onChange={(eventoRegistro) => cambiarNombreExplorador(eventoRegistro.target.value)}
  error={erroresRegistro.name}
/>
```

Las palabras a la derecha son **props**: datos que un componente padre entrega
a otro. `CampoFormulario` los usa para mostrar una etiqueta, un `input` y, si
existe, un mensaje de error. El componente no sabe si pertenece a registro,
login o cuenta; por eso puede reutilizarse.

Los nombres `id`, `value`, `onChange`, `error` y `name` se conservan porque son
atributos estándar de HTML o nombres que entrega Zod. En el código propio se
usan nombres que describen su intención: `nombreExplorador`,
`erroresRegistro` y `cambiarNombreExplorador`.

## useState: recordar lo que escribe la persona

```tsx
const [nombreExplorador, cambiarNombreExplorador] = useState("");
```

- `nombreExplorador` es el dato actual.
- `cambiarNombreExplorador` es la única función que lo modifica.
- `useState("")` indica que al abrir el formulario el dato comienza vacío.

Cuando el usuario escribe, el evento contiene el nuevo texto y llamamos a la
función de cambio. React vuelve a dibujar el componente usando el valor nuevo.
Eso convierte al campo en un **input controlado**: la pantalla siempre muestra
el mismo dato que guarda React.

```tsx
onChange={(eventoRegistro) => cambiarNombreExplorador(eventoRegistro.target.value)}
```

`eventoRegistro.target.value` es lo que contiene el input. La función flecha es
pequeña para que se vea claramente el recorrido: evento → texto → estado.

## Enviar sin recargar

El evento `submit` de un formulario normalmente recarga la página. React usa
`preventDefault` para trabajar sin esa recarga:

```tsx
async function enviarRegistro(eventoRegistro: FormEvent<HTMLFormElement>) {
  eventoRegistro.preventDefault();
  const resultadoRegistro = reglasRegistroExplorador.safeParse({
    name: nombreExplorador,
    email: correoExplorador,
    password: claveExplorador,
    confirmPassword: confirmacionClave,
  });
}
```

`FormEvent<HTMLFormElement>` solo ayuda a TypeScript: documenta que el evento
vino de un formulario. `safeParse` de Zod devuelve un resultado en lugar de
lanzar un error. Si falla, guardamos el primer mensaje de cada campo en
`erroresRegistro`; si pasa, llamamos al servicio de autenticación.

## Qué valida Zod

`schemas/auth.ts` concentra las reglas para no repetirlas:

- Nombre obligatorio y con una longitud razonable.
- Correo con formato válido, convertido a minúsculas y sin espacios.
- Contraseña de ocho caracteres o más.
- Confirmación igual a la contraseña.

El navegador también conoce algunos atributos como `required` y
`autoComplete`, pero Zod es la comprobación principal porque funciona igual
antes de registrar, iniciar sesión o actualizar una cuenta.

## useRef en los filtros

El buscador no utiliza `useState` para guardar su temporizador porque cambiar
ese temporizador no debe volver a dibujar la pantalla. En su lugar usa:

```tsx
const esperaBusqueda = useRef<number | null>(null);
```

`.current` conserva un valor entre renderizados sin causar otro render. Guarda
el identificador que devuelve `setTimeout`; antes de crear una espera nueva se
cancela la anterior. Así escribir «Rick» rápidamente termina en una sola
búsqueda, 400 ms después de la última letra.

Sigue con [registro y sesión](02-registro-y-sesion.md) para ver qué ocurre una
vez que el formulario ya tiene datos válidos.
