import SplitHeading from "@/components/motion/SplitHeading";
import { crearMetadatosPagina } from "@/lib/metadata";
import ColeccionFavoritos from "@/components/organisms/FavoritesList";

/** Metadatos de la pantalla de favoritos. */
export const metadata = crearMetadatosPagina("Mis favoritos", "Consulta tus personajes favoritos de Rick y Morty.", "/favoritos");

/**
 * Compone la página de personajes favoritos de la cuenta activa.
 *
 * @returns {React.JSX.Element} Encabezado y listado personal de favoritos.
 */
export default function PaginaFavoritos() {
  return (
    <><header className="page-heading"><p className="auth-eyebrow">ARCHIVO / COLECCIÓN PERSONAL</p><SplitHeading lineas={[{ texto: "Mis favoritos" }]} /><p data-aos="fade-up" data-aos-delay="200">Los personajes que elegiste conservar, más allá de cualquier dimensión.</p></header><ColeccionFavoritos /></>
  );
}
