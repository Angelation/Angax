import React, { useState } from 'react'

/**
 * Componente Tabs para navegación por pestañas
 * @param {Array} tabs - Array de objetos con { id, label, content }
 * @param {string} defaultTab - ID de la pestaña por defecto
 * @param {function} onChange - Función a ejecutar al cambiar de pestaña
 */
const Tabs = ({
  tabs = [],
  defaultTab,
  onChange,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (onChange) {
      onChange(tabId)
    }
  }

  return (
    <div className={`tabs-container ${className}`}>
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}

export default Tabs

