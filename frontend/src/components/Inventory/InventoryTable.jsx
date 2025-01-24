import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/InventoryTables.css';

const columns = {
  clients: [
    { key: 'razao_social', label: 'Razão Social' },
    { key: 'cnpj', label: 'CNPJ' },
    { key: 'vantive_id', label: 'Vantive ID' },
    { key: 'codigo', label: 'Código' },
    { key: 'status_vantive', label: 'Status Vantive' },
    { key: 'status', label: 'Status' }
  ],
  sites: [
    { key: 'razao_social', label: 'Razão Social' },
    { key: 'codigo_vivo', label: 'Código Vivo' },
    { key: 'codigo_sys_cliente', label: 'Código Sistema' },
    { key: 'tipo_site', label: 'Tipo Site' },
    { key: 'cnpj', label: 'CNPJ' },
    { key: 'status', label: 'Status' }
  ],
  equipments: [
    { key: 'tipo', label: 'Tipo' },
    { key: 'fornecedor', label: 'Fornecedor' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'serial_number', label: 'Número de Série' },
    { key: 'redundancia', label: 'Redundância' },
    { key: 'hw_end_life_cycle', label: 'Fim de Vida HW' },
    { key: 'hw_end_support', label: 'Fim de Suporte HW' },
    { key: 'sw_end_life_cycle', label: 'Fim de Vida SW' },
    { key: 'sw_end_support', label: 'Fim de Suporte SW' },
    { key: 'status', label: 'Status' }
  ],
  services: [
    { key: 'designador', label: 'Designador' },
    { key: 'servico_num', label: 'Número do Serviço' },
    { key: 'oferta', label: 'Oferta' },
    { key: 'pacote', label: 'Pacote' },
    { key: 'redundancia', label: 'Redundância', type: 'boolean' },
    { key: 'operadora', label: 'Operadora' },
    { key: 'ip', label: 'IP' },
    { key: 'ra', label: 'RA' },
    { key: 'status', label: 'Status' }
  ],
  economic_groups: [
    { key: 'razao_social', label: 'Razão Social' },
    { key: 'cnpj', label: 'CNPJ' },
    { key: 'codigo', label: 'Código' },
    { key: 'status', label: 'Status' }
  ],
  links: [
    { key: 'operadora', label: 'Operadora' },
    { key: 'designador', label: 'Designador' },
    { key: 'status', label: 'Status' }
  ],
  contratos: [
    { key: 'sku', label: 'SKU' },
    { key: 'data_registro', label: 'Data Registro' },
    { key: 'data_inicio', label: 'Data Início' },
    { key: 'data_fim', label: 'Data Fim' },
    { key: 'status', label: 'Status' }
  ],
  licencas: [
    { key: 'licenca_numero', label: 'Número da Licença' },
    { key: 'status', label: 'Status' }
  ]
};

function InventoryTable({ type, data, loading, onPageChange, totalPages, currentPage, fetchData }) {
  const [editItemId, setEditItemId] = useState(null);
  const [editItemData, setEditItemData] = useState({});
  const [isRedundanciaDropdownOpen, setIsRedundanciaDropdownOpen] = useState(false);

  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    onPageChange(newPage);
  };

  const handleEditClick = (item) => {
    setEditItemId(item.id);
    setEditItemData(item);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditItemData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = () => {
    setEditItemData(prev => ({ ...prev, status: !prev.status }));
  };

  const handleSave = async () => {
    try {
      let endpoint;
      switch (type) {
        case 'clients':
          endpoint = `/inventario/clientes/${editItemId}/`;
          break;
        case 'sites':
          endpoint = `/inventario/sites/${editItemId}/`;
          break;
        case 'equipments':
          endpoint = `/inventario/equipamentos/${editItemId}/`;
          break;
        case 'services':
          endpoint = `/inventario/servicos/${editItemId}/`;
          break;
        case 'economic_groups':
          endpoint = `/inventario/grupos-economicos/${editItemId}/`;
          break;
        case 'links':
          endpoint = `/inventario/links/${editItemId}/`;
          break;
        case 'contratos':
          endpoint = `/inventario/contratos/${editItemId}/`;
          break;
        case 'licencas':
          endpoint = `/inventario/licencas/${editItemId}/`;
          break;
        default:
          return;
      }
      await api.put(endpoint, editItemData);
      setEditItemId(null);
      fetchData(type, currentPage); // Refresh data after save
    } catch (error) {
      console.error('Erro ao salvar item:', error);
    }
  };

  const handleCancel = () => {
    setEditItemId(null);
  };

  const formatCNPJ = (cnpj) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  const renderCellContent = (item, col) => {
    if (col.key === 'grupo_economico') {
      return item.grupo_economico?.razao_social || '';
    }
    
    if (col.key === 'status') {
      return item[col.key] ? 'Ativo' : 'Inativo';
    }

    if (col.key === 'status_vantive') {
      return item[col.key] === 'Faturável' ? 'Faturável' : 'Técnico';
    }

    if (col.key === 'redundancia') {
      return item[col.key] ? 'Sim' : 'Não';
    }
    
    if (col.key.includes('end_')) {
      return item[col.key] ? new Date(item[col.key]).toLocaleDateString() : '-';
    }

    // Tratamento para campos de data
    if (['data_registro', 'data_inicio', 'data_fim'].includes(col.key)) {
      return item[col.key] ? new Date(item[col.key]).toLocaleDateString() : '-';
    }

    // Tratamento para campos de relacionamento
    if (['equipamento', 'contrato'].includes(col.key)) {
      return item[col.key]?.id || '-';
    }

    // Formatar CNPJ
    if (col.key === 'cnpj') {
      return formatCNPJ(item[col.key]);
    }
    
    return item[col.key];
  };

  const renderEditField = (col, item) => {
    // Verificação para campos de data em contratos
    if (['data_inicio', 'data_fim'].includes(col.key) && type === 'contratos') {
      return (
        <input
          type="date"
          name={col.key}
          value={editItemData[col.key] ? editItemData[col.key].split('T')[0] : ''}
          onChange={handleInputChange}
          className="edit-input"
        />
      );
    }

    // Novo tratamento para redundância em serviços
    if (col.key === 'redundancia' && type === 'services') {
      return (
        <div className="dropdown-container" style={{ position: 'relative' }}>
          <input
            className="inv-filter-input"
            type="text"
            value={editItemData[col.key] ? "Sim" : "Não"}
            onClick={() => setIsRedundanciaDropdownOpen(!isRedundanciaDropdownOpen)}
            readOnly
          />
          {isRedundanciaDropdownOpen && (
            <div className="inv-client-dropdown" style={{ 
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 1000,
              width: '100%',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #ddd'
            }}>
              <div 
                className="inv-client-option"
                onClick={() => {
                  setEditItemData(prev => ({ ...prev, redundancia: true }));
                  setIsRedundanciaDropdownOpen(false);
                }}
              >
                Sim
              </div>
              <div 
                className="inv-client-option"
                onClick={() => {
                  setEditItemData(prev => ({ ...prev, redundancia: false }));
                  setIsRedundanciaDropdownOpen(false);
                }}
              >
                Não
              </div>
            </div>
          )}
        </div>
      );
    }

    if (col.key === 'status' || col.key === 'status_vantive') {
      return (
        <label className="switch">
          <input
            type="checkbox"
            name={col.key}
            checked={editItemData[col.key]}
            onChange={handleToggleChange}
          />
          <span className="slider round"></span>
        </label>
      );
    }

    return (
      <input
        type="text"
        name={col.key}
        value={editItemData[col.key] || ''}
        onChange={handleInputChange}
        className="edit-input"
      />
    );
  };

  if (loading) return <div className="inventory-table-loading">Carregando...</div>;

  return (
    <div className="inventory-table-container">
      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              {columns[type].map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th style={{ width: 50, textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id || index}>
                {columns[type].map(col => (
                  <td key={col.key} 
                      data-status={col.key === 'status' || col.key === 'status_vantive' ? item[col.key] : undefined}>
                    {editItemId === item.id ? (
                      renderEditField(col, item)
                    ) : (
                      renderCellContent(item, col)
                    )}
                  </td>
                ))}
                <td className="actions-column">
                  {editItemId === item.id ? (
                    <>
                      <button className="save-button" title="Salvar" onClick={handleSave}>
                        <FaSave />
                      </button>
                      <button className="cancel-button" title="Cancelar" onClick={handleCancel}>
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <button className="edit-button" title="Editar" onClick={() => handleEditClick(item)}>
                      <FaEdit />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > 0 && (
        <div className="pagination">
          <div className="pagination-info">
            Mostrando {data.length} registros
          </div>
          <div className="pagination-controls">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryTable;
