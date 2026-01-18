import React from 'react'

/**
 * Componente Button reutilizable
 * @param {string} variant - Variante del botón: 'primary', 'secondary', 'outline', 'danger'
 * @param {string} size - Tamaño del botón: 'sm', 'md', 'lg'
 * @param {boolean} disabled - Estado deshabilitado
 * @param {function} onClick - Función a ejecutar al hacer clic
 * @param {React.ReactNode} children - Contenido del botón
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  children,
  className = '',
  ...props 
}) => {
  const baseClasses = 'btn'
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'btn-danger'
  }
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

