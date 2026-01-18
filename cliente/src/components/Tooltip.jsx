import React, { useState, useRef, useEffect } from 'react'

/**
 * Componente Tooltip para mostrar información adicional
 * @param {React.ReactNode} children - Elemento que activa el tooltip
 * @param {string} content - Contenido del tooltip
 * @param {string} placement - Posición: 'top', 'bottom', 'left', 'right'
 * @param {number} delay - Delay en ms antes de mostrar
 */
const Tooltip = ({
  children,
  content,
  placement = 'top',
  delay = 200,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef(null)
  const triggerRef = useRef(null)
  let timeoutId = null

  const showTooltip = () => {
    timeoutId = setTimeout(() => {
      if (triggerRef.current && tooltipRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect()
        const tooltipRect = tooltipRef.current.getBoundingClientRect()

        let top = 0
        let left = 0

        switch (placement) {
          case 'top':
            top = triggerRect.top - tooltipRect.height - 8
            left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
            break
          case 'bottom':
            top = triggerRect.bottom + 8
            left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)
            break
          case 'left':
            top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
            left = triggerRect.left - tooltipRect.width - 8
            break
          case 'right':
            top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
            left = triggerRect.right + 8
            break
        }

        setPosition({ top, left })
        setIsVisible(true)
      }
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return (
    <div className={`tooltip-wrapper ${className}`}>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`tooltip tooltip-${placement}`}
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 9999
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export default Tooltip

