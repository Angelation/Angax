import React from 'react'

/**
 * Componente Avatar para mostrar fotos de perfil
 * @param {string} src - URL de la imagen
 * @param {string} alt - Texto alternativo
 * @param {string} name - Nombre del usuario (para inicial si no hay imagen)
 * @param {string} size - Tamaño: 'sm', 'md', 'lg', 'xl'
 * @param {function} onClick - Función a ejecutar al hacer clic
 */
const Avatar = ({ 
  src, 
  alt, 
  name = '', 
  size = 'md',
  onClick,
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg',
    xl: 'avatar-xl'
  }

  const getInitials = (name) => {
    if (!name) return 'A'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div
      className={`avatar ${sizeClasses[size]} ${onClick ? 'avatar-clickable' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || name} />
      ) : (
        <div className="avatar-placeholder">
          {getInitials(name)}
        </div>
      )}
    </div>
  )
}

export default Avatar

