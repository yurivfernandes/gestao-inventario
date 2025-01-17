import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdFilterAltOff } from 'react-icons/md';
import api from '../../services/api';
import '../../styles/FilterDropdown.css';

function FilterDropdown({ isOpen, onClose, filters, setFilters, onApply }) {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(filters.cliente || '');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchClients();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (filters.cliente) {
      const client = clients.find(client => client.id === filters.cliente);
      if (client) {
        setSearchTerm(client.razao_social);
        setSelectedClient(client.id);
      }
    }
  }, [filters.cliente, clients]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      onClose();
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/inventario/clientes/');
      setClients(response.data.results);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleApply = () => {
    setFilters(prev => ({ ...prev, cliente: selectedClient }));
    onApply();
    onClose();
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm(''); // Limpar o termo de busca do cliente
    setSelectedClient(''); // Limpar o cliente selecionado
  };

  if (!isOpen) return null;

  return (
    <div className="inv-filter-dropdown" ref={dropdownRef}>
      <div className="inv-filter-content">
        <div className="inv-filter-field client-search">
          <label className="inv-filter-label">Cliente</label>
          <input
            className="inv-filter-input"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsClientDropdownOpen(true);
            }}
            onFocus={() => setIsClientDropdownOpen(true)}
            placeholder="Digite para pesquisar cliente..."
          />
          {isClientDropdownOpen && (
            <div className="inv-client-dropdown">
              {clients
                .filter(client => 
                  client.razao_social.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(client => (
                  <div
                    key={client.id}
                    className="inv-client-option"
                    onClick={() => {
                      setSelectedClient(client.id);
                      setSearchTerm(client.razao_social);
                      setIsClientDropdownOpen(false);
                    }}
                  >
                    {client.razao_social} ({client.codigo})
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* Filtros de Site */}
        <div className="inv-filter-field">
          <label className="inv-filter-label">Código Vivo Site</label>
          <input
            className="inv-filter-input"
            type="text"
            value={filters.codigo_vivo || ''}
            onChange={(e) => setFilters(prev => ({...prev, codigo_vivo: e.target.value}))}
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Código Sistema</label>
          <input
            className="inv-filter-input"
            type="text"
            value={filters.codigo_sys_cliente || ''}
            onChange={(e) => setFilters(prev => ({...prev, codigo_sys_cliente: e.target.value}))}
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Tipo Site</label>
          <input
            className="inv-filter-input"
            type="text"
            value={filters.tipo_site || ''}
            onChange={(e) => setFilters(prev => ({...prev, tipo_site: e.target.value}))}
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Tipo Negócio</label>
          <input
            className="inv-filter-input"
            type="text"
            value={filters.tipo_negocio || ''}
            onChange={(e) => setFilters(prev => ({...prev, tipo_negocio: e.target.value}))}
          />
        </div>

        {/* Filtros de Equipamento */}
        <div className="inv-filter-field">
          <label className="inv-filter-label">Código Equipamento</label>
          <input
            className="inv-filter-input"
            type="text"
            value={filters.codigo_equipamento || ''}
            onChange={(e) => setFilters(prev => ({...prev, codigo_equipamento: e.target.value}))}
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Tipo Equipamento</label>
          <input
            className="inv-filter-input"
            type="text"
            value={filters.tipo_equipamento || ''}
            onChange={(e) => setFilters(prev => ({...prev, tipo_equipamento: e.target.value}))}
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Designador Equipamento</label>
          <input
            className="inv-filter-input"
            type="text"
            value={filters.designador_equipamento || ''}
            onChange={(e) => setFilters(prev => ({...prev, designador_equipamento: e.target.value}))}
          />
        </div>

        {/* Filtros de Serviço */}
        <div className="inv-filter-field">
          <label className="inv-filter-label">Código Serviço</label>
          <input
            className="inv-filter-input"
            type="text"
            value={filters.codigo_servico || ''}
            onChange={(e) => setFilters(prev => ({...prev, codigo_servico: e.target.value}))}
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Tipo Serviço</label>
          <input
            className="inv-filter-input"
            type="text"
            value={filters.tipo_servico || ''}
            onChange={(e) => setFilters(prev => ({...prev, tipo_servico: e.target.value}))}
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Designador Serviço</label>
          <input
            className="inv-filter-input"
            type="text"
            value={filters.designador_servico || ''}
            onChange={(e) => setFilters(prev => ({...prev, designador_servico: e.target.value}))}
          />
        </div>

        {/* Status (geral para todas as APIs) */}
        <div className="inv-filter-field">
          <label className="inv-filter-label">Status</label>
          <select
            className="inv-filter-input"
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
          >
            <option value="">Todos</option>
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
      </div>

      <div className="inv-filter-actions">
        <button className="inv-clear-button" onClick={clearFilters}>
          <MdFilterAltOff /> 
        </button>
        <button className="inv-apply-button" onClick={handleApply}>
          <FaSearch /> Consultar
        </button>
      </div>
    </div>
  );
}

export default FilterDropdown;
