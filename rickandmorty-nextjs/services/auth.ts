import { z } from "zod";
import { reglasInicioSesion, reglasRegistroExplorador, type DatosRegistroExplorador } from "@/schemas/auth";

/** Datos de la cuenta que pueden mostrarse en la interfaz. */
export type PerfilExplorador = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

/** Cuenta almacenada: añade la huella de contraseña y su valor aleatorio. */
const reglasCuentaGuardada = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  createdAt: z.iso.datetime(),
  passwordHash: z.string(),
  salt: z.string(),
});

type CuentaGuardada = z.infer<typeof reglasCuentaGuardada>;
export const CLAVE_CUENTAS_NAVEGADOR = "rick-morty:users";
export const CLAVE_SESION_ACTIVA = "rick-morty:session";

/**
 * Lee las cuentas del navegador y comprueba que tengan la forma esperada.
 * @returns {CuentaGuardada[]} Usuarios guardados, o una lista vacía al empezar.
 * @throws {Error} Si el almacenamiento no está disponible o sus datos son inválidos.
 */
function leerCuentasGuardadas(): CuentaGuardada[] {
  try {
    const textoGuardadoRegistro = localStorage.getItem(CLAVE_CUENTAS_NAVEGADOR);
    return textoGuardadoRegistro ? z.array(reglasCuentaGuardada).parse(JSON.parse(textoGuardadoRegistro)) : [];
  } catch {
    throw new Error("No pudimos leer las cuentas de este navegador. Revisa su almacenamiento.");
  }
}

/**
 * Guarda la lista de cuentas como texto JSON.
 * @param {CuentaGuardada[]} cuentasGuardadas - Lista completa de cuentas.
 * @returns {void} Persiste los usuarios en el navegador.
 * @throws {Error} Si el navegador no permite guardar los datos.
 */
function guardarCuentasExploradores(cuentasGuardadas: CuentaGuardada[]) {
  try {
    localStorage.setItem(CLAVE_CUENTAS_NAVEGADOR, JSON.stringify(cuentasGuardadas));
  } catch {
    throw new Error("No pudimos guardar los datos. Revisa el espacio y los permisos del navegador.");
  }
}

/**
 * Selecciona los datos públicos de una cuenta, sin su huella de contraseña.
 * @param {CuentaGuardada} exploradorActual - Cuenta leída del almacenamiento.
 * @returns {PerfilExplorador} Datos que la interfaz puede utilizar.
 */
function obtenerPerfilPublico(exploradorActual: CuentaGuardada): PerfilExplorador {
  return { id: exploradorActual.id, name: exploradorActual.name, email: exploradorActual.email, createdAt: exploradorActual.createdAt };
}

/**
 * Deriva una huella de contraseña con PBKDF2, disponible en HTTPS y localhost.
 * @param {string} claveExplorador - Contraseña escrita por el usuario.
 * @param {string} salDeCuenta - Valor aleatorio propio de la cuenta.
 * @returns {Promise<string>} Huella en formato hexadecimal.
 * @throws {Error} Si el navegador no dispone de Web Crypto.
 */
async function crearHuellaContrasena(claveExplorador: string, salDeCuenta: string): Promise<string> {
  const codificadorTexto = new TextEncoder();
  const clavePreparada = await crypto.subtle.importKey(
    "raw", codificadorTexto.encode(claveExplorador), "PBKDF2", false, ["deriveBits"],
  );
  const bytesHuella = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: codificadorTexto.encode(salDeCuenta), iterations: 600000, hash: "SHA-256" },
    clavePreparada,
    256,
  );
  return Array.from(new Uint8Array(bytesHuella))
    .map((byteHuella) => byteHuella.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Registra una cuenta y evita correos duplicados después de normalizarlos.
 * @param {DatosRegistroExplorador} datosRegistro - Datos validados del formulario de registro.
 * @returns {Promise<PerfilExplorador>} Cuenta creada, sin iniciar sesión automáticamente.
 * @throws {Error} Si el correo existe, los datos no son válidos o falla el guardado.
 */
export async function registrarExplorador(datosRegistro: DatosRegistroExplorador): Promise<PerfilExplorador> {
  const valoresRegistro = reglasRegistroExplorador.parse(datosRegistro);
  const cuentasGuardadas = leerCuentasGuardadas();
  if (cuentasGuardadas.some((exploradorActual) => exploradorActual.email === valoresRegistro.email)) {
    throw new Error("Ya existe una cuenta con ese correo electrónico.");
  }

  const salDeCuenta = crypto.randomUUID();
  const huellaContrasena = await crearHuellaContrasena(valoresRegistro.password, salDeCuenta);
  const exploradorActual: CuentaGuardada = {
    id: crypto.randomUUID(),
    name: valoresRegistro.name,
    email: valoresRegistro.email,
    createdAt: new Date().toISOString(),
    passwordHash: huellaContrasena,
    salt: salDeCuenta,
  };

  // Volvemos a leer porque calcular la huella tarda un momento.
  const cuentasMasRecientes = leerCuentasGuardadas();
  if (cuentasMasRecientes.some((cuentaGuardada) => cuentaGuardada.email === exploradorActual.email)) {
    throw new Error("Ya existe una cuenta con ese correo electrónico.");
  }
  guardarCuentasExploradores([...cuentasMasRecientes, exploradorActual]);
  return obtenerPerfilPublico(exploradorActual);
}

/**
 * Comprueba las credenciales y guarda el identificador de la sesión activa.
 * @param {string} correoExplorador - Correo de la cuenta.
 * @param {string} claveExplorador - Contraseña que se desea comprobar.
 * @returns {Promise<PerfilExplorador>} Datos del usuario autenticado.
 * @throws {Error} Si las credenciales son incorrectas o no puede persistir la sesión.
 */
export async function iniciarSesionExplorador(correoExplorador: string, claveExplorador: string): Promise<PerfilExplorador> {
  const valoresRegistro = reglasInicioSesion.parse({ email: correoExplorador, password: claveExplorador });
  const exploradorActual = leerCuentasGuardadas().find((cuentaGuardada) => cuentaGuardada.email === valoresRegistro.email);
  if (!exploradorActual || await crearHuellaContrasena(valoresRegistro.password, exploradorActual.salt) !== exploradorActual.passwordHash) {
    throw new Error("El correo o la contraseña son incorrectos.");
  }
  try {
    localStorage.setItem(CLAVE_SESION_ACTIVA, exploradorActual.id);
  } catch {
    throw new Error("No pudimos guardar la sesión en este navegador.");
  }
  return obtenerPerfilPublico(exploradorActual);
}

/**
 * Recupera la cuenta de la sesión; descarta una sesión cuyo usuario ya no existe.
 * @returns {PerfilExplorador | null} Usuario activo o ausencia de sesión.
 * @throws {Error} Si no se pueden leer los datos del navegador.
 */
export function recuperarExploradorActivo(): PerfilExplorador | null {
  const identificadorRegistro = localStorage.getItem(CLAVE_SESION_ACTIVA);
  if (!identificadorRegistro) return null;
  const exploradorActual = leerCuentasGuardadas().find((cuentaGuardada) => cuentaGuardada.id === identificadorRegistro);
  if (!exploradorActual) {
    localStorage.removeItem(CLAVE_SESION_ACTIVA);
    return null;
  }
  return obtenerPerfilPublico(exploradorActual);
}

/**
 * Elimina la sesión sin borrar la cuenta ni sus favoritos.
 * @returns {void} Borra el identificador activo.
 * @throws {Error} Si el navegador impide modificar su almacenamiento.
 */
export function cerrarSesionExplorador() {
  localStorage.removeItem(CLAVE_SESION_ACTIVA);
}

/**
 * Actualiza el nombre de una cuenta existente.
 * @param {string} identificadorRegistro - Identificador de la cuenta activa.
 * @param {string} nombreExplorador - Nuevo nombre que ya pasó la validación del formulario.
 * @returns {PerfilExplorador} Datos actualizados del perfil.
 * @throws {Error} Si la cuenta no existe o no puede guardarse.
 */
export function guardarNombreExplorador(identificadorRegistro: string, nombreExplorador: string): PerfilExplorador {
  const cuentasGuardadas = leerCuentasGuardadas();
  const exploradorActual = cuentasGuardadas.find((cuentaGuardada) => cuentaGuardada.id === identificadorRegistro);
  if (!exploradorActual) throw new Error("No encontramos tu cuenta. Vuelve a iniciar sesión.");
  exploradorActual.name = nombreExplorador.trim();
  guardarCuentasExploradores(cuentasGuardadas);
  return obtenerPerfilPublico(exploradorActual);
}

/**
 * Comprueba la contraseña actual antes de guardar una nueva huella y salt.
 * @param {string} identificadorRegistro - Identificador de la cuenta activa.
 * @param {string} claveActual - Contraseña actual.
 * @param {string} claveNueva - Nueva contraseña validada por el formulario.
 * @returns {Promise<void>} Actualiza la contraseña sin cerrar la sesión.
 * @throws {Error} Si la contraseña actual no coincide o falla el guardado.
 */
export async function cambiarClaveExplorador(identificadorRegistro: string, claveActual: string, claveNueva: string) {
  const exploradorActual = leerCuentasGuardadas().find((cuentaGuardada) => cuentaGuardada.id === identificadorRegistro);
  if (!exploradorActual || await crearHuellaContrasena(claveActual, exploradorActual.salt) !== exploradorActual.passwordHash) {
    throw new Error("La contraseña actual es incorrecta.");
  }
  const salDeCuenta = crypto.randomUUID();
  const huellaContrasena = await crearHuellaContrasena(claveNueva, salDeCuenta);
  const cuentasGuardadas = leerCuentasGuardadas();
  const cuentaEncontrada = cuentasGuardadas.find((cuentaGuardada) => cuentaGuardada.id === identificadorRegistro);
  if (!cuentaEncontrada) throw new Error("No encontramos tu cuenta.");
  cuentaEncontrada.salt = salDeCuenta;
  cuentaEncontrada.passwordHash = huellaContrasena;
  guardarCuentasExploradores(cuentasGuardadas);
}
