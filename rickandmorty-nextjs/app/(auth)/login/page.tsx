import { crearMetadatosPagina } from "@/lib/metadata";
import Link from "next/link";
import FormularioAcceso from "@/components/organisms/LoginForm";
import PlantillaAcceso from "@/components/templates/AuthTemplate";

/** Título y descripción específicos de la ruta de acceso. */
export const metadata = crearMetadatosPagina("Iniciar sesión", "Accede a Rick & Morty Explorer y continúa tu exploración.", "/login");

/**
 * Compone /login dentro del grupo público y delega la interacción a LoginForm.
 *
 * @returns {React.JSX.Element} Página de acceso con enlace al registro.
 */
export default function PaginaAcceso() {
  return (
    <PlantillaAcceso
      title="Iniciar sesión"
      description="Vuelve a tus personajes y aventuras favoritas."
      footer={
        <p>
          ¿Todavía no tienes una cuenta?{" "}
          <Link href="/register" className="text-link">
            Regístrate
          </Link>
        </p>
      }
    >
      <FormularioAcceso />
    </PlantillaAcceso>
  );
}
