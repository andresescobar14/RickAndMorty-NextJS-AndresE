import { crearMetadatosPagina } from "@/lib/metadata";
import Link from "next/link";
import FormularioRegistro from "@/components/organisms/RegisterForm";
import PlantillaAcceso from "@/components/templates/AuthTemplate";

/** Título y descripción específicos de la ruta de registro. */
export const metadata = crearMetadatosPagina("Crear cuenta", "Crea tu cuenta para explorar los personajes de Rick y Morty.", "/register");

/**
 * Compone /register dentro del grupo público con su formulario de registro.
 *
 * @returns {React.JSX.Element} Página de registro renderizada por Next.js.
 */
export default function PaginaRegistro() {
  return (
    <PlantillaAcceso
      title="Crear cuenta"
      description="Completa tus datos para empezar a explorar el multiverso."
      footer={
        <p>
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-link">
            Inicia sesión
          </Link>
        </p>
      }
    >
      <FormularioRegistro />
    </PlantillaAcceso>
  );
}
