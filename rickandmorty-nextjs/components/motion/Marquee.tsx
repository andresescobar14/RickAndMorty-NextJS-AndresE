/**
 * Cinta de texto en movimiento infinito (CSS). Se duplica para no dejar huecos.
 * @param {Object} props - Contenido de la cinta.
 * @param {string[]} props.items - Frases a repetir.
 * @param {'acid' | 'outline'} [props.variant='acid'] - Estilo de la cinta.
 * @param {string} [props.className=''] - Clases adicionales.
 * @returns {React.JSX.Element} Marquesina decorativa.
 */
export default function Marquee({ items, variant = "acid", className = "" }: { items: string[]; variant?: "acid" | "outline"; className?: string }) {
  const pista = <div className="marquee-track">{items.map((item, i) => <span key={i}>{item}</span>)}</div>;
  return <div className={`marquee ${className}`} data-variant={variant} aria-hidden="true">{pista}{pista}</div>;
}
