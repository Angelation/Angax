import React from 'react'

/**
 * Componente Card para mostrar contenido en tarjetas
 * @param {string} title - Título de la tarjeta
 * @param {React.ReactNode} children - Contenido de la tarjeta
 * @param {string} className - Clases CSS adicionales
 */
const Card = ({ title, children, className = '', ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {title && (
        <div className="card-header">
          <h3>{title}</h3>
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  )
}

export default Card

