import type { ComponentProps } from "react";

/**
 * Botón reutilizable para las acciones de los formularios.
 *
 * @param {Object} props - Atributos nativos de un botón HTML.
 * @param {React.ReactNode} props.children - Texto o contenido del botón.
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - Acción del botón.
 * @param {string} [props.className=''] - Clases CSS adicionales.
 * @returns {React.JSX.Element} Botón con estilos y foco visible.
 * @example
 * <Button type="submit">Validar datos</Button>
 */
export default function BotonAccion({
  type = "button",
  className = "",
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      {...props}
      type={type}
      className={`button-primary ${className}`}
    />
  );
}
