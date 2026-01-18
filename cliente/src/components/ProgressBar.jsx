import React from 'react'

/**
 * Componente ProgressBar para mostrar progreso
 * @param {number} value - Valor actual (0-100)
 * @param {number} max - Valor máximo (por defecto 100)
 * @param {string} variant - Variante: 'primary', 'success', 'warning', 'danger'
 * @param {boolean} showLabel - Mostrar etiqueta con el porcentaje
 * @param {string} label - Etiqueta personalizada
 */
const ProgressBar = ({
  value = 0,
  max = 100,
  variant = 'primary',
  showLabel = false,
  label,
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const variantClasses = {
    primary: 'progress-primary',
    success: 'progress-success',
    warning: 'progress-warning',
    danger: 'progress-danger'
  }

  return (
    <div className={`progress-container ${className}`} {...props}>
      {showLabel && (
        <div className="progress-label">
          {label || `${Math.round(percentage)}%`}
        </div>
      )}
      <div className="progress-bar-wrapper">
        <div
          className={`progress-bar ${variantClasses[variant]}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}

export default ProgressBar

