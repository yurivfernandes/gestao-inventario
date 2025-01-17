import React, { useState } from 'react';
import { FaFilter, FaChevronDown } from 'react-icons/fa';
import '../../styles/InventoryTables.css';

const getFilterConfig = () => [
  { key: 'protocolo', label: 'Protocolo', type: 'text' },
  { key: 'data_abertura', label: 'Data de Abertura', type: 'date' },
  { key: 'status', label: 'Status', type: 'select',
    options: [
      { value: 'aberto', label: 'Aberto' },
      { value: 'em_andamento', label: 'Em Andamento' },
      { value: 'fechado', label: 'Fechado' }
    ]
  },
  { key: 'prioridade', label: 'Prioridade', type: 'select',
    options: [
      { value: 'baixa', label: 'Baixa' },
      { value: 'media', label: 'Média' },
      { value: 'alta', label: 'Alta' },
      { value: 'critica', label: 'Crítica' }
    ]
  }
];

const FiltersSection = ({ filters, setFilters }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const fields = getFilterConfig();
  
  return (
    <div className="filters-container">
      <div 
        className="filters-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>
          <FaFilter />
          Filtros
          <span className="active-filters-count">
            {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
          </span>
        </h3>
        <FaChevronDown 
          className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}
        />
      </div>
      
      <div className={`table-filters ${isExpanded ? 'expanded' : ''}`}>
        <div className="filter-section">
          {fields.map(field => (
            <div key={field.key} className="filter-field">
              <label>{field.label}</label>
              {field.type === 'select' ? (
                <select
                  value={filters[field.key] || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    [field.key]: e.target.value
                  }))}
                >
                  <option value="">Todos</option>
                  {field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={filters[field.key] || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    [field.key]: e.target.value
                  }))}
                  placeholder={`Filtrar por ${field.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
        </div>
        {Object.keys(filters).length > 0 && (
          <div className="filter-actions">
            <button 
              className="clear-filters"
              onClick={() => setFilters({})}
            >
              Limpar Filtros ({Object.keys(filters).length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function IncidentTable() {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1; // Temporário até integrar com API

  return (
    <div className="inventory-table-container">
      <FiltersSection 
        filters={filters}
        setFilters={setFilters}
      />

      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Protocolo</th>
              <th>Data de Abertura</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Cliente</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* Dados serão inseridos aqui quando integrado com a API */}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}

export default IncidentTable;
