# Comprobar y entregar

## Validaciones locales

`npm run lint` revisa el código con ESLint. `npm run build` compila y valida
TypeScript y las convenciones del App Router. El build no sustituye el lint:
en esta versión se ejecutan por separado.

La API y `next/font` necesitan conexión de red. Si Node en Windows no reconoce
el certificado que sí reconoce el sistema, ejecuta Next con `--use-system-ca`.
No se desactiva la comprobación de certificados.

## Pruebas que puedes repetir

1. Registrar un usuario y rechazar el mismo correo con otras mayúsculas.
2. Probar una contraseña incorrecta y luego iniciar sesión con la correcta.
3. Recargar una ruta privada: la sesión debe seguir activa.
4. Abrir `/login` con sesión: debe volver al listado.
5. Buscar, combinar filtros, cambiar de página y recargar la URL.
6. Abrir una tarjeta y regresar conservando los filtros.
7. Buscar un nombre inexistente: debe aparecer el estado vacío.
8. Abrir `/personaje/99999`: debe aparecer el 404 personalizado.
9. Guardar favoritos, recargar y quitarlos desde su página.
10. Entrar con otra cuenta: no debe ver los favoritos de la primera.
11. Cambiar nombre y comprobar que cambia la navegación.
12. Rechazar un cambio de contraseña con contraseña actual incorrecta.
13. Cambiar la contraseña, salir y comprobar la nueva en `/login`.
14. Alternar el tema y recargar: debe mantenerse sin un destello de otro color.
15. Cerrar sesión y abrir una ruta privada: debe volver a `/login`.

## SEO

`crearMetadatosPagina` construye título, descripción, canonical, Open Graph y Twitter.
El layout añade la plantilla de título y `metadataBase`.
La ficha utiliza `generateMetadata` con nombre, descripción e imagen del personaje.

`robots.ts` y `sitemap.ts` generan sus rutas automáticamente. El mapa contiene
las rutas generales; no publica colecciones personales. El icono y la tarjeta
social se encuentran en `app/icon.svg` y `public/social-preview.png`.

## Publicar en Vercel

1. Revisa y crea commits descriptivos de los avances.
2. Sube los cambios al repositorio de GitHub y comprueba su visibilidad pública.
3. Importa el repositorio en Vercel.
4. Usa `rickandmorty-nextjs` como Root Directory.
5. Configura `NEXT_PUBLIC_SITE_URL` con la URL pública real del proyecto.
6. Publica y vuelve a comprobar registro, rutas privadas, imágenes y recarga.
7. Conserva el enlace de GitHub y el de Vercel como entregables.

Las cuentas se guardan por origen. Una cuenta creada en localhost no aparecerá
en Vercel ni en otro navegador; hay que registrarla en cada origen.

## Lighthouse

Mide la URL de producción en modo móvil, no el servidor de desarrollo.
El objetivo del enunciado es al menos 90 en rendimiento, accesibilidad,
buenas prácticas y SEO. Registra los valores reales y añade la captura al README.
No se ha declarado una puntuación sin ejecutar esa medición.
