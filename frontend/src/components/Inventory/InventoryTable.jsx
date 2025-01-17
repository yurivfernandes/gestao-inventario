import React, { useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
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

function InventoryTable({ type, data, loading, onPageChange, totalPages, currentPage }) {
  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    onPageChange(newPage);
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
                    {col.key === 'status' ? (item[col.key] ? 'Ativo' : 'Inativo') : item[col.key]}
                  </td>
                ))}
                <td className="actions-column">
                  <button className="edit-button" title="Editar">
                    <FaEdit />
                  </button>
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
