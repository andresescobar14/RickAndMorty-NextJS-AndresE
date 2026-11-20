import { crearMetadatosPagina } from "@/lib/metadata";
import { Suspense } from "react";
import FiltrosPersonajes from "@/components/organisms/CharacterFilters";
import ResultadosPersonajes from "@/components/organisms/CharacterResults";
import TarjetasCargando from "@/components/molecules/CharacterSkeletons";
import CharacterHero from "@/components/motion/CharacterHero";
import Marquee from "@/components/motion/Marquee";

export const metadata = crearMetadatosPagina("Personajes", "Explora los personajes de Rick y Morty y crea tu archivo personal de favoritos.");

/**
 * Define la ruta y coloca los componentes cliente que leen la URL y piden los datos.
 *
 * @returns {React.JSX.Element} Introducción al listado de personajes.
 */
export default function PaginaPersonajes() {
  return (
    <>
    <CharacterHero />
    <Marquee className="marquee-bleed" items={["Humanos", "Alienígenas", "Robots", "Cronenbergs", "Mythologs", "Desconocidos", "Animales", "Poopybutthole"]} />
    <Suspense fallback={<div className="filter-placeholder" aria-label="Cargando filtros" />}>
      <FiltrosPersonajes />
    </Suspense>
    <Suspense fallback={<TarjetasCargando />}>
      <ResultadosPersonajes />
    </Suspense>
    </>
  );
}

