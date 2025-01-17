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
    { key: 'status', label: 'Status' }
  ],
  sites: [
    { key: 'codigo_vivo', label: 'Código Vivo' },
    { key: 'codigo_sys_cliente', label: 'Código Sistema' },
    { key: 'tipo_site', label: 'Tipo Site' },
    { key: 'tipo_negocio', label: 'Tipo Negócio' },
    { key: 'status', label: 'Status' }
  ],
  equipments: [
    { key: 'codigo', label: 'Código' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'designador', label: 'Designador' },
    { key: 'status', label: 'Status' }
  ],
  services: [
    { key: 'codigo', label: 'Código' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'designador', label: 'Designador' },
    { key: 'status', label: 'Status' }
  ]
};

function InventoryTable({ type, data, loading, onPageChange, totalPages, currentPage, fetchData }) {
  const [editItemId, setEditItemId] = useState(null);
  const [editItemData, setEditItemData] = useState({});

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
                  <td key={col.key} data-status={col.key === 'status' ? item[col.key] : undefined}>
                    {editItemId === item.id ? (
                      col.key === 'status' ? (
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={editItemData[col.key]}
                            onChange={handleToggleChange}
                          />
                          <span className="slider round"></span>
                        </label>
                      ) : (
                        <input
                          type="text"
                          name={col.key}
                          value={editItemData[col.key]}
                          onChange={handleInputChange}
                          className="edit-input"
                        />
                      )
                    ) : (
                      col.key === 'status' ? (item[col.key] ? 'Ativo' : 'Inativo') : item[col.key]
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
