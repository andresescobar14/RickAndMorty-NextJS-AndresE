import type { ComponentProps } from "react";
import EntradaTexto from "@/components/atoms/Input";

/** Atributos del input más la etiqueta y su posible mensaje de error. */
type PropiedadesCampo = ComponentProps<"input"> & {
  id: string;
  label: string;
  error?: string;
};

/**
 * Agrupa una etiqueta, un input y su error para usarlos en formularios.
 *
 * @param {Object} props - Configuración del campo y atributos del input.
 * @param {string} props.id - Identificador que conecta etiqueta e input.
 * @param {string} props.label - Nombre visible del campo.
 * @param {string} [props.error] - Primer error de validación del campo.
 * @returns {React.JSX.Element} Campo accesible y reutilizable.
 */
export default function CampoFormulario({ id: identificadorCampo, label: etiquetaCampo, error: problemaCampo, ...atributosEntrada }: PropiedadesCampo) {
  const identificadorErrorCampo = `${identificadorCampo}-error`;

  return (
    <div className="form-field">
      <label htmlFor={identificadorCampo} className="form-label">
        {etiquetaCampo}
      </label>
      <EntradaTexto
        {...atributosEntrada}
        id={identificadorCampo}
        aria-invalid={Boolean(problemaCampo)}
        aria-describedby={problemaCampo ? identificadorErrorCampo : undefined}
      />
      {problemaCampo && (
        <p id={identificadorErrorCampo} role="alert" className="form-error">
          {problemaCampo}
        </p>
      )}
    </div>
  );
}
