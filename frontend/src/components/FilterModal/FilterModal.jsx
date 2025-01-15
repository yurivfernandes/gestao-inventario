import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './FilterModal.css';

function FilterModal({ isOpen, onClose, onApplyFilters, initialFilters }) {
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Filtrar CNAEs</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="filter-grid">
            <div className="filter-field">
              <label>Código</label>
              <input
                type="text"
                value={filters.codigo}
                onChange={(e) => setFilters(prev => ({ ...prev, codigo: e.target.value }))}
                placeholder="Buscar por código..."
              />
            </div>
            <div className="filter-field">
              <label>Descrição</label>
              <input
                type="text"
                value={filters.descricao}
                onChange={(e) => setFilters(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Buscar por descrição..."
              />
            </div>
            <div className="filter-field">
              <label>Setor Econômico</label>
              <input
                type="text"
                value={filters.setor_economico}
                onChange={(e) => setFilters(prev => ({ ...prev, setor_economico: e.target.value }))}
                placeholder="Buscar por setor..."
              />
            </div>
            <div className="filter-field">
              <label>Classe</label>
              <input
                type="text"
                value={filters.descricao_classe}
                onChange={(e) => setFilters(prev => ({ ...prev, descricao_classe: e.target.value }))}
                placeholder="Buscar por classe..."
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="button cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="button apply">
              Aplicar Filtros
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FilterModal;
