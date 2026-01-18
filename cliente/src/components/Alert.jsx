import React from 'react'

/**
 * Componente Alert para mostrar mensajes
 * @param {string} variant - Variante: 'success', 'error', 'warning', 'info'
 * @param {string} title - Título del alert
 * @param {React.ReactNode} children - Contenido del alert
 * @param {boolean} dismissible - Si se puede cerrar
 * @param {function} onClose - Función a ejecutar al cerrar
 */
const Alert = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onClose,
  className = ''
}) => {
  const variantClasses = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info'
  }

  return (
    <div className={`alert ${variantClasses[variant]} ${className}`} role="alert">
      <div className="alert-content">
        {title && <h4 className="alert-title">{title}</h4>}
        <div className="alert-message">{children}</div>
      </div>
      {dismissible && onClose && (
        <button
          className="alert-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default Alert

