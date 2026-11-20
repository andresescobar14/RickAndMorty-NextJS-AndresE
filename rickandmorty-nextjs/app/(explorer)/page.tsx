import { crearMetadatosPagina } from "@/lib/metadata";
import { Suspense } from "react";
import FiltrosPersonajes from "@/components/organisms/CharacterFilters";
import ResultadosPersonajes from "@/components/organisms/CharacterResults";
import TarjetasCargando from "@/components/molecules/CharacterSkeletons";

export const metadata = crearMetadatosPagina("Personajes", "Explora los personajes de Rick y Morty y crea tu archivo personal de favoritos.");

/**
 * Define la ruta y coloca los componentes cliente que leen la URL y piden los datos.
 *
 * @returns {React.JSX.Element} Introducción al listado de personajes.
 */
export default function PaginaPersonajes() {
  return (
    <>
    <header className="page-heading">
      <p className="auth-eyebrow">ARCHIVO / PERSONAJES</p>
      <h1>El multiverso, personaje a personaje.</h1>
      <p>Encuentra tu próxima historia al otro lado del portal.</p>
    </header>
    <Suspense fallback={<div className="filter-placeholder" aria-label="Cargando filtros" />}>
      <FiltrosPersonajes />
    </Suspense>
    <Suspense fallback={<TarjetasCargando />}>
      <ResultadosPersonajes />
    </Suspense>
    </>
  );
}

