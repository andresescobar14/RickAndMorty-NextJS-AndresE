/**
 * Mantiene el espacio de las tarjetas mientras un efecto pide personajes.
 * @returns {React.JSX.Element} Tarjetas de carga con un mensaje accesible.
 */
export default function TarjetasCargando() {
  return (
    <div role="status" aria-label="Cargando personajes">
      <span className="sr-only">Cargando personajes…</span>
      <div className="character-grid" aria-hidden="true">
        {Array.from({ length: 8 }, (_, posicionTarjeta) => <div className="skeleton-card" key={posicionTarjeta}><div /><p /><p /></div>)}
      </div>
    </div>
  );
}
