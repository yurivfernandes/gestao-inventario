import React, { useState, useEffect } from 'react';
import { FaEdit, FaSearch, FaChevronDown, FaFilter } from 'react-icons/fa';
import '../../styles/InventoryTables.css';

const TableHeader = ({ columns }) => (
  <thead>
    <tr>
      {columns.map((col, index) => (
        <th key={index}>{col.label}</th>
      ))}
    </tr>
  </thead>
);

const TableRow = ({ item, columns }) => (
  <tr>
    {columns.map((col, index) => (
      <td key={index}>{col.render ? col.render(item[col.key]) : item[col.key]}</td>
    ))}
  </tr>
);

const tableConfigs = {
  clients: {
    columns: [
      { key: 'razao_social', label: 'Razão Social' },
      { key: 'cnpj', label: 'CNPJ' },
      { key: 'vantive_id', label: 'Vantive ID' },
      { key: 'codigo', label: 'Código' },
      { key: 'status', label: 'Status', render: (val) => val ? 'Ativo' : 'Inativo' }
    ]
  },
  sites: {
    columns: [
      { key: 'codigo_vivo', label: 'Código Vivo' },
      { key: 'codigo_sys_cliente', label: 'Código Sistema' },
      { key: 'tipo_site', label: 'Tipo Site' },
      { key: 'tipo_negocio', label: 'Tipo Negócio' },
      { key: 'cep', label: 'CEP' },
      { key: 'status', label: 'Status', render: (val) => val ? 'Ativo' : 'Inativo' }
    ]
  },
  equipments: {
    columns: [
      { key: 'site_codigo_vivo', label: 'Código Site Vivo' }, 
      { key: 'codigo', label: 'Código Equipamento' },
      { key: 'tipo', label: 'Tipo' },
      { key: 'designador', label: 'Designador' },
      { key: 'status', label: 'Status', render: (val) => val ? 'Ativo' : 'Inativo' }
    ]
  },
  services: {
    columns: [
      { key: 'site_codigo_vivo', label: 'Código Site Vivo' },
      { key: 'equipamento_codigo', label: 'Código Equipamento' },
      { key: 'codigo', label: 'Código Serviço' },
      { key: 'tipo', label: 'Tipo' },
      { key: 'designador', label: 'Designador' },
      { key: 'status', label: 'Status', render: (val) => val ? 'Ativo' : 'Inativo' }
    ]
  }
};

const getFilterConfig = (type, data) => {
  const configs = {
    clients: [
      { key: 'razao_social', label: 'Razão Social', type: 'text' },
      { key: 'cnpj', label: 'CNPJ', type: 'text' },
      { key: 'vantive_id', label: 'Vantive ID', type: 'text' },
      { key: 'codigo', label: 'Código', type: 'text' },
      { key: 'status', label: 'Status', type: 'select',
        options: [
          { value: 'true', label: 'Ativo' },
          { value: 'false', label: 'Inativo' }
        ]
      }
    ],
    sites: [
      { 
        key: 'cliente', 
        label: 'Cliente (Obrigatório)', 
        type: 'combobox',
        required: true,
        options: data.clients.map(c => ({
          value: c.id,
          label: `${c.razao_social} (${c.codigo})`
        }))
      },
      { key: 'codigo_vivo', label: 'Código Vivo', type: 'text' },
      { key: 'codigo_sys_cliente', label: 'Código Sistema', type: 'text' },
      { key: 'tipo_site', label: 'Tipo Site', type: 'text' },
      { key: 'tipo_negocio', label: 'Tipo Negócio', type: 'text' },
      { key: 'status', label: 'Status', type: 'select',
        options: [
          { value: 'true', label: 'Ativo' },
          { value: 'false', label: 'Inativo' }
        ]
      }
    ],
    equipments: [
      { 
        key: 'cliente', 
        label: 'Cliente (Obrigatório)', 
        type: 'combobox',
        required: true,
        options: data.clients.map(c => ({
          value: c.id,
          label: `${c.razao_social} (${c.codigo})`
        }))
      },
      { 
        key: 'site', 
        label: 'Site', 
        type: 'combobox',
        options: filters => {
          if (!filters.cliente) return [];
          return (data.sites[filters.cliente] || []).map(s => ({
            value: s.id,
            label: `${s.codigo_vivo} (${s.tipo_site})`
          }));
        }
      },
      { key: 'designador', label: 'Designador', type: 'text' },
      { key: 'codigo', label: 'Código', type: 'text' },
      { key: 'tipo', label: 'Tipo', type: 'text' },
      { 
        key: 'status', 
        label: 'Status', 
        type: 'select',
        options: [
          { value: 'true', label: 'Ativo' },
          { value: 'false', label: 'Inativo' }
        ]
      }
    ],
    services: [
      { 
        key: 'cliente', 
        label: 'Cliente (Obrigatório)', 
        type: 'combobox',
        required: true,
        options: data.clients.map(c => ({
          value: c.id,
          label: `${c.razao_social} (${c.codigo})`
        }))
      },
      { 
        key: 'site_codigo_vivo', 
        label: 'Código do Site', 
        type: 'text'
      },
      { 
        key: 'equipamento_codigo_vivo', 
        label: 'Código do Equipamento', 
        type: 'text'
      },
      { key: 'designador', label: 'Designador', type: 'text' },
      { key: 'codigo', label: 'Código', type: 'text' },
      { key: 'tipo', label: 'Tipo', type: 'text' },
      { 
        key: 'status', 
        label: 'Status', 
        type: 'select',
        options: [
          { value: 'true', label: 'Ativo' },
          { value: 'false', label: 'Inativo' }
        ]
      }
    ]
  };
  return configs[type] || [];
};

const ComboboxField = ({ field, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOptions = (Array.isArray(options) ? options : []).filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="filter-field combobox">
      <label>{field.label}</label>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Fecha o dropdown após seleção
        placeholder="Digite para pesquisar..."
      />
      {isOpen && (
        <div className="combobox-dropdown">
          {filteredOptions.map(opt => (
            <div
              key={opt.value}
              className="combobox-option"
              onClick={() => {
                onChange(opt.value);
                setSearchTerm(opt.label);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FiltersSection = ({ type, filters, setFilters, data }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const fields = getFilterConfig(type, data);
  
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
              {field.type === 'combobox' ? (
                <ComboboxField
                  field={field}
                  value={filters[field.key]}
                  onChange={(value) => setFilters(prev => ({
                    ...prev,
                    [field.key]: value
                  }))}
                  options={field.options}
                />
              ) : field.type === 'select' ? (
                <>
                  <label>{field.label}</label>
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
                </>
              ) : (
                <>
                  <label>{field.label}</label>
                  <input
                    type="text"
                    value={filters[field.key] || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      [field.key]: e.target.value
                    }))}
                    placeholder={`Filtrar por ${field.label.toLowerCase()}`}
                  />
                </>
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

function InventoryTables({ type, data, onEdit, onFetchData }) {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setFilters({});
    setCurrentPage(1);
  }, [type]);

  useEffect(() => {
    // Chama a API quando mudar a página ou quando selecionar um cliente
    if (type === 'clients') {
      onFetchData('clients', null, currentPage);
    } else if (filters.cliente) {
      onFetchData(type, filters.cliente, currentPage);
    }
  }, [type, filters.cliente, currentPage]);

  const items = type === 'clients' ? 
    data.clients : 
    (filters.cliente && data[type][filters.cliente] ? data[type][filters.cliente] : []);

  // Pega o total de páginas do estado
  const totalPages = type === 'clients' ? 
    data.clientsTotalPages : 
    (filters.cliente && data[`${type}TotalPages`] ? data[`${type}TotalPages`] : 1);

  return (
    <div className="inventory-table-container">
      <FiltersSection 
        type={type}
        filters={filters}
        setFilters={setFilters}
        data={data}
      />

      <div className="table-wrapper">
        <table className="inventory-table">
          <TableHeader columns={[...tableConfigs[type].columns, { key: 'actions', label: '' }]} />
          <tbody>
            {items && items.map((item, index) => (
              <tr key={item.id || index}>
                {tableConfigs[type].columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render ? col.render(item[col.key]) : item[col.key]}
                  </td>
                ))}
                <td className="actions-column">
                  <button className="edit-button" onClick={() => onEdit?.(item)}>
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items && items.length > 0 && (
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
      )}
    </div>
  );
}

export default InventoryTables;
