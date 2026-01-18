import React from 'react'

/**
 * Componente Spinner para mostrar carga
 * @param {string} size - Tamaño: 'sm', 'md', 'lg'
 * @param {string} variant - Variante: 'primary', 'secondary'
 * @param {string} className - Clases CSS adicionales
 */
const Spinner = ({ 
  size = 'md', 
  variant = 'primary',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg'
  }

  const variantClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary'
  }

  return (
    <div 
      className={`spinner ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      role="status"
      aria-label="Cargando"
    >
      <div className="spinner-circle" />
      <span className="sr-only">Cargando...</span>
    </div>
  )
}

export default Spinner

