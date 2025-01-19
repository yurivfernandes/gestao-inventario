import React from 'react';
import '../../styles/InventoryTables.css';

const columns = [
  { key: 'incidente', label: 'Incidente' },
  { key: 'aberto_por', label: 'Aberto por' },
  { key: 'origem', label: 'Origem' },
  { key: 'categoria', label: 'Categoria' },
  { key: 'subcategoria', label: 'Subcategoria' },
  { key: 'subcategoria_detalhe', label: 'Detalhe Subcategoria' },
  { key: 'tipo_contato', label: 'Tipo Contato' },
  { key: 'fila', label: 'Fila' },
  { key: 'data_abertura', label: 'Data Abertura' },
  { key: 'data_fechamento', label: 'Data Fechamento' },
  { key: 'data_resolucao', label: 'Data Resolução' },
  { key: 'duracao', label: 'Duração' },
  { key: 'status', label: 'Status' }
];

function IncidentTable({ data, loading, onPageChange, totalPages, currentPage }) {
  if (loading) return <div className="inventory-table-loading">Carregando...</div>;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="inventory-table-container">
      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id || index}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.key.includes('data') 
                      ? formatDate(item[col.key])
                      : item[col.key]}
                  </td>
                ))}
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
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button 
              onClick={() => onPageChange(currentPage + 1)}
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

export default IncidentTable;
