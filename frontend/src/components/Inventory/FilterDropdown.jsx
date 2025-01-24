import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdFilterAltOff } from 'react-icons/md';
import api from '../../services/api';
import '../../styles/FilterDropdown.css';

function FilterDropdown({ isOpen, onClose, filters, setFilters, onApply }) {
  const [clients, setClients] = useState([]);
  const [gruposEconomicos, setGruposEconomicos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [grupoSearchTerm, setGrupoSearchTerm] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isGrupoDropdownOpen, setIsGrupoDropdownOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...filters });
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchGruposEconomicos();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (localFilters.grupo_economico) {
      fetchClients(localFilters.grupo_economico);
    }
  }, [localFilters.grupo_economico]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      onClose();
    }
  };

  const fetchGruposEconomicos = async () => {
    try {
      const response = await api.get('/inventario/grupos-economicos/');
      setGruposEconomicos(response.data.results);
    } catch (error) {
      console.error('Erro ao carregar grupos econômicos:', error);
    }
  };

  const fetchClients = async (grupoEconomicoId) => {
    try {
      const response = await api.get(`/inventario/clientes/?grupo_economico=${grupoEconomicoId}`);
      setClients(response.data.results);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleSearch = (term) => {
    if (activeTab === 'sites') {
      // Altera para buscar por razão social em vez de código
      return sites.filter(site => 
        site.razao_social.toLowerCase().includes(term.toLowerCase()) ||
        site.cnpj.includes(term)
      );
    }
    // ... restante do código de busca para outros tipos ...
  };

  const handleApply = () => {
    setFilters(localFilters);
    onApply();
    onClose();
  };

  const clearFilters = () => {
    setLocalFilters({});
  };

  const handleGrupoSelect = (grupo) => {
    setLocalFilters(prev => ({
      ...prev,
      grupo_economico: grupo.id,
      cliente: '' // Limpa o cliente quando trocar o grupo econômico
    }));
    setGrupoSearchTerm(grupo.razao_social);
    setIsGrupoDropdownOpen(false);
  };

  const handleClientSelect = (client) => {
    setLocalFilters(prev => ({
      ...prev,
      cliente: client.id
    }));
    setSearchTerm(client.razao_social);
    setIsClientDropdownOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="inv-filter-dropdown" ref={dropdownRef}>
      <div className="inv-dropdown-header">
        <h3>Filtros</h3>
      </div>
      
      <div className="inv-filter-content">
        <div className="inv-filter-field">
          <label className="inv-filter-label">Grupo Econômico</label>
          <input
            className="inv-filter-input"
            type="text"
            value={grupoSearchTerm}
            onChange={(e) => {
              setGrupoSearchTerm(e.target.value);
              setIsGrupoDropdownOpen(true);
            }}
            onFocus={() => setIsGrupoDropdownOpen(true)}
            placeholder="Pesquisar grupo econômico..."
          />
          {isGrupoDropdownOpen && (
            <div className="inv-client-dropdown">
              {gruposEconomicos
                .filter(grupo => 
                  grupo.razao_social.toLowerCase().includes(grupoSearchTerm.toLowerCase())
                )
                .map(grupo => (
                  <div
                    key={grupo.id}
                    className="inv-client-option"
                    onClick={() => handleGrupoSelect(grupo)}
                  >
                    {grupo.razao_social}
                  </div>
                ))
              }
            </div>
          )}
        </div>

        <div className="inv-filter-field">
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
            placeholder="Pesquisar cliente..."
            disabled={!localFilters.grupo_economico}
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
                    onClick={() => handleClientSelect(client)}
                  >
                    {client.razao_social}
                  </div>
                ))
              }
            </div>
          )}
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Status</label>
          <select
            className="inv-filter-input"
            value={localFilters.status || ''}
            onChange={(e) => setLocalFilters(prev => ({...prev, status: e.target.value}))}
          >
            <option value="">Todos</option>
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
      </div>

      <div className="inv-filter-actions">
        <button className="inv-clear-button" onClick={() => {
          setLocalFilters({});
          setSearchTerm('');
          setGrupoSearchTerm('');
        }}>
          <MdFilterAltOff /> Limpar
        </button>
        <button className="inv-apply-button" onClick={handleApply}>
          <FaSearch /> Consultar
        </button>
      </div>
    </div>
  );
}

export default FilterDropdown;
