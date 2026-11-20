import type { ComponentProps } from "react";

/**
 * Entrada de texto reutilizable; su valor lo controla el formulario padre.
 *
 * @param {Object} props - Atributos nativos de un input HTML.
 * @param {string} [props.className=''] - Clases CSS adicionales.
 * @param {string} [props.value] - Valor actual del campo.
 * @param {React.ChangeEventHandler<HTMLInputElement>} [props.onChange] - Maneja la escritura.
 * @returns {React.JSX.Element} Input con estilos de foco y error.
 * @example
 * <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
 */
export default function EntradaTexto({
  className = "",
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={`form-input ${className}`}
    />
  );
}
