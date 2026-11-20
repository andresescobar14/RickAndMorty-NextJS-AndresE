import Link from "next/link";
import { crearConsultaPersonajes } from "@/lib/filters";
import type { FiltrosPersonajes } from "@/types/character";

/**
 * Cambia de página conservando la búsqueda y todos los filtros.
 * @param {Object} props - Filtros y total de páginas devueltos por la API.
 * @param {FiltrosPersonajes} props.filtrosPersonajes - Filtros de la página actual.
 * @param {number} props.totalPaginas - Total de páginas del resultado.
 * @returns {React.JSX.Element} Navegación anterior y siguiente con límites desactivados.
 */
export default function Pagination({ filtrosPersonajes, totalPaginas }: { filtrosPersonajes: FiltrosPersonajes; totalPaginas: number }) {
  const paginaAnterior = `/?${crearConsultaPersonajes({ ...filtrosPersonajes, page: filtrosPersonajes.page - 1 })}`;
  const paginaSiguiente = `/?${crearConsultaPersonajes({ ...filtrosPersonajes, page: filtrosPersonajes.page + 1 })}`;
  return (
    <nav className="pagination" aria-label="Paginación de personajes">
      {filtrosPersonajes.page > 1 ? <Link href={paginaAnterior} scroll={false} className="pagination-button">← Anterior</Link> : <span className="pagination-button" aria-disabled="true">← Anterior</span>}
      <p>Página <strong>{filtrosPersonajes.page}</strong> de {totalPaginas}</p>
      {filtrosPersonajes.page < totalPaginas ? <Link href={paginaSiguiente} scroll={false} className="pagination-button">Siguiente →</Link> : <span className="pagination-button" aria-disabled="true">Siguiente →</span>}
    </nav>
  );
}
