import React, { useState, useRef, useEffect } from 'react'

/**
 * Componente Dropdown para menús desplegables
 * @param {React.ReactNode} trigger - Elemento que activa el dropdown
 * @param {Array} items - Array de items del menú
 * @param {string} placement - Posición: 'bottom', 'top', 'left', 'right'
 * @param {boolean} isOpen - Estado controlado de apertura
 * @param {function} onToggle - Función para cambiar el estado
 */
const Dropdown = ({
  trigger,
  items = [],
  placement = 'bottom',
  isOpen: controlledIsOpen,
  onToggle,
  className = ''
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (controlledIsOpen === undefined) {
          setInternalIsOpen(false)
        } else if (onToggle) {
          onToggle(false)
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, controlledIsOpen, onToggle])

  const handleToggle = () => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(!internalIsOpen)
    } else if (onToggle) {
      onToggle(!controlledIsOpen)
    }
  }

  return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={handleToggle}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`dropdown-menu dropdown-${placement}`}>
          {items.map((item, index) => (
            <div
              key={index}
              className={`dropdown-item ${item.divider ? 'dropdown-divider' : ''} ${item.danger ? 'dropdown-item-danger' : ''}`}
              onClick={() => {
                if (item.onClick) item.onClick()
                if (controlledIsOpen === undefined) {
                  setInternalIsOpen(false)
                } else if (onToggle) {
                  onToggle(false)
                }
              }}
            >
              {item.icon && <span className="dropdown-item-icon">{item.icon}</span>}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown

