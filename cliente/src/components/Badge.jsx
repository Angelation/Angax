import React from 'react'

/**
 * Componente Badge para mostrar etiquetas
 * @param {string} variant - Variante: 'primary', 'success', 'warning', 'danger', 'info'
 * @param {string} size - Tamaño: 'sm', 'md', 'lg'
 * @param {React.ReactNode} children - Contenido del badge
 */
const Badge = ({ 
  variant = 'primary', 
  size = 'md',
  children,
  className = '',
  ...props 
}) => {
  const variantClasses = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info'
  }

  const sizeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg'
  }

  return (
    <span
      className={`badge ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge

