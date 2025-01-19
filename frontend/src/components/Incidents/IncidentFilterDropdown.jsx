import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdFilterAltOff } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../../styles/IncidentFilterDropdown.css';

function IncidentFilterDropdown({ isOpen, onClose, filters, setFilters, onApply }) {
  const dropdownRef = useRef(null);

  const [localFilters, setLocalFilters] = useState({ ...filters });
  const [startDateAbertura, setStartDateAbertura] = useState(filters.data_abertura_inicio || null);
  const [endDateAbertura, setEndDateAbertura] = useState(filters.data_abertura_fim || null);
  const [startDateFechamento, setStartDateFechamento] = useState(filters.data_fechamento_inicio || null);
  const [endDateFechamento, setEndDateFechamento] = useState(filters.data_fechamento_fim || null);
  const [startDateResolucao, setStartDateResolucao] = useState(filters.data_resolucao_inicio || null);
  const [endDateResolucao, setEndDateResolucao] = useState(filters.data_resolucao_fim || null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleDateChangeAbertura = (dates) => {
    const [start, end] = dates;
    setStartDateAbertura(start);
    setEndDateAbertura(end);
  };

  const handleDateChangeFechamento = (dates) => {
    const [start, end] = dates;
    setStartDateFechamento(start);
    setEndDateFechamento(end);
  };

  const handleDateChangeResolucao = (dates) => {
    const [start, end] = dates;
    setStartDateResolucao(start);
    setEndDateResolucao(end);
  };

  const handleApply = () => {
    setFilters(prev => ({
      ...prev,
      ...localFilters,
      data_abertura_inicio: startDateAbertura,
      data_abertura_fim: endDateAbertura,
      data_fechamento_inicio: startDateFechamento,
      data_fechamento_fim: endDateFechamento,
      data_resolucao_inicio: startDateResolucao,
      data_resolucao_fim: endDateResolucao
    }));
    onApply();
    onClose();
  };

  const clearFilters = () => {
    setLocalFilters({});
    setStartDateAbertura(null);
    setEndDateAbertura(null);
    setStartDateFechamento(null);
    setEndDateFechamento(null);
    setStartDateResolucao(null);
    setEndDateResolucao(null);
  };

  if (!isOpen) return null;

  return (
    <div className="incident-filter-dropdown" ref={dropdownRef}>
      <div className="incident-filter-content">
        <div className="filter-grid">
          <div className="incident-filter-field">
            <label className="incident-filter-label">Incidente</label>
            <input
              type="text"
              value={localFilters.incidente || ''}
              onChange={(e) => setLocalFilters(prev => ({...prev, incidente: e.target.value}))}
              placeholder="Digite o incidente"
              className="incident-filter-input"
            />
          </div>

          <div className="incident-filter-field">
            <label className="incident-filter-label">Status</label>
            <select
              value={localFilters.status || ''}
              onChange={(e) => setLocalFilters(prev => ({...prev, status: e.target.value}))}
              className="incident-filter-input"
            >
              <option value="">Todos</option>
              <option value="PENDING">Pendente</option>
              <option value="IN_PROGRESS">Em Andamento</option>
              <option value="RESOLVED">Resolvido</option>
              <option value="CLOSED">Fechado</option>
            </select>
          </div>

          <div className="incident-filter-field">
            <label className="incident-filter-label">Origem</label>
            <input
              type="text"
              value={localFilters.origem || ''}
              onChange={(e) => setLocalFilters(prev => ({...prev, origem: e.target.value}))}
              placeholder="Digite a origem"
              className="incident-filter-input"
            />
          </div>

          <div className="incident-filter-field">
            <label className="incident-filter-label">Categoria</label>
            <input
              type="text"
              value={localFilters.categoria || ''}
              onChange={(e) => setLocalFilters(prev => ({...prev, categoria: e.target.value}))}
              placeholder="Digite a categoria"
              className="incident-filter-input"
            />
          </div>

          <div className="incident-filter-field">
            <label className="incident-filter-label">Subcategoria</label>
            <input
              type="text"
              value={localFilters.subcategoria || ''}
              onChange={(e) => setLocalFilters(prev => ({...prev, subcategoria: e.target.value}))}
              placeholder="Digite a subcategoria"
              className="incident-filter-input"
            />
          </div>

          <div className="incident-filter-field">
            <label className="incident-filter-label">Detalhe Subcategoria</label>
            <input
              type="text"
              value={localFilters.detalhe_subcategoria || ''}
              onChange={(e) => setLocalFilters(prev => ({...prev, detalhe_subcategoria: e.target.value}))}
              placeholder="Digite o detalhe"
              className="incident-filter-input"
            />
          </div>

          <div className="incident-filter-field">
            <label className="incident-filter-label">Descrição</label>
            <input
              type="text"
              value={localFilters.descricao || ''}
              onChange={(e) => setLocalFilters(prev => ({...prev, descricao: e.target.value}))}
              placeholder="Digite a descrição"
              className="incident-filter-input"
            />
          </div>

          <div className="incident-filter-field">
            <label className="incident-filter-label">Período de Abertura</label>
            <DatePicker
              selected={startDateAbertura}
              onChange={handleDateChangeAbertura}
              startDate={startDateAbertura}
              endDate={endDateAbertura}
              selectsRange
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione o período"
              className="incident-filter-input"
            />
          </div>

          <div className="incident-filter-field">
            <label className="incident-filter-label">Período de Fechamento</label>
            <DatePicker
              selected={startDateFechamento}
              onChange={handleDateChangeFechamento}
              startDate={startDateFechamento}
              endDate={endDateFechamento}
              selectsRange
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione o período"
              className="incident-filter-input"
            />
          </div>

          <div className="incident-filter-field">
            <label className="incident-filter-label">Período de Resolução</label>
            <DatePicker
              selected={startDateResolucao}
              onChange={handleDateChangeResolucao}
              startDate={startDateResolucao}
              endDate={endDateResolucao}
              selectsRange
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione o período"
              className="incident-filter-input"
            />
          </div>
        </div>
      </div>

      <div className="incident-filter-actions">
        <button className="clear-button" onClick={clearFilters}>
          <MdFilterAltOff /> Limpar
        </button>
        <button className="apply-button" onClick={handleApply}>
          <FaSearch /> Aplicar Filtros
        </button>
      </div>
    </div>
  );
}

export default IncidentFilterDropdown;