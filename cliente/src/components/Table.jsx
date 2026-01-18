import React from 'react'

/**
 * Componente Table para mostrar datos en tabla
 * @param {Array} columns - Array de objetos con { key, label, render }
 * @param {Array} data - Array de datos a mostrar
 * @param {boolean} striped - Filas alternadas
 * @param {boolean} hover - Efecto hover en filas
 */
const Table = ({
  columns = [],
  data = [],
  striped = false,
  hover = true,
  className = ''
}) => {
  return (
    <div className={`table-wrapper ${className}`}>
      <table className={`table ${striped ? 'table-striped' : ''} ${hover ? 'table-hover' : ''}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table

