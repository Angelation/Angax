import React from 'react'

/**
 * Componente Input reutilizable
 * @param {string} type - Tipo de input: 'text', 'email', 'password', 'number', etc.
 * @param {string} label - Etiqueta del input
 * @param {string} placeholder - Texto de placeholder
 * @param {string} value - Valor del input
 * @param {function} onChange - Función a ejecutar al cambiar el valor
 * @param {string} error - Mensaje de error
 * @param {boolean} required - Si el campo es requerido
 */
const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`input-field ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
      {error && (
        <span className="input-error-message">{error}</span>
      )}
    </div>
  )
}

export default Input

