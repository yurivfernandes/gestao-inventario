import React, { useState, useRef, useEffect } from 'react';
import { FaSave, FaTimes, FaTimesCircle } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/FilterDropdown.css';

function AddEquipamentoDropdown({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    grupo_economico: '',  // Novo campo
    cliente: '',
    site: '',
    tipo: '',
    status: true,
    fornecedor: '',
    modelo: '',
    serial_number: '',
    redundancia: false,
    hw_end_life_cycle: '',
    hw_end_support: '',
    sw_end_life_cycle: '',
    sw_end_support: ''
  });
  
  const [gruposEconomicos, setGruposEconomicos] = useState([]);
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [grupoSearchTerm, setGrupoSearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [siteSearchTerm, setSiteSearchTerm] = useState('');
  const [isGrupoDropdownOpen, setIsGrupoDropdownOpen] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [isRedundanciaDropdownOpen, setIsRedundanciaDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchGruposEconomicos();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (formData.grupo_economico) {
      fetchClients(formData.grupo_economico);
    }
  }, [formData.grupo_economico]);

  useEffect(() => {
    if (formData.cliente) {
      fetchSites(formData.cliente);
    }
  }, [formData.cliente]);

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
      const response = await api.get(`/inventario/clientes/`, {
        params: {
          grupo_economico: grupoEconomicoId,
          status: true
        }
      });
      setClients(response.data.results);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const fetchSites = async (clienteId) => {
    try {
      const response = await api.get('/inventario/sites/', {
        params: {
          cliente: clienteId,  // Modificado de cliente__id para cliente
          grupo_economico: formData.grupo_economico, // Adicionando grupo_economico
          status: true
        }
      });
      setSites(response.data.results || []);
    } catch (error) {
      console.error('Erro ao carregar sites:', error);
    }
  };

  const handleClientSelect = (client) => {
    setFormData(prev => ({
      ...prev,
      cliente: client.id,
      site: ''
    }));
    setClientSearchTerm(client.razao_social);
    setIsClientDropdownOpen(false);
    setSiteSearchTerm('');
  };

  const handleSiteSelect = (site) => {
    setFormData(prev => ({ ...prev, site: site.id }));
    setSiteSearchTerm(site.razao_social); // Alterado para usar razão social
    setIsSiteDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Remove grupo_economico e cliente do objeto antes de enviar
      const { grupo_economico, cliente, ...dataToSend } = formData;
      
      const response = await api.post('/inventario/equipamentos/', dataToSend);
      onSuccess(response.data);
      setFormData({
        grupo_economico: '',
        cliente: '',
        site: '',
        tipo: '',
        status: true,
        fornecedor: '',
        modelo: '',
        serial_number: '',
        redundancia: false,
        hw_end_life_cycle: '',
        hw_end_support: '',
        sw_end_life_cycle: '',
        sw_end_support: ''
      });
    } catch (error) {
      console.error('Erro ao adicionar equipamento:', error);
    }
  };

  const handleClearGrupo = () => {
    setGrupoSearchTerm('');
    setFormData(prev => ({ 
      ...prev, 
      grupo_economico: '',
      cliente: '',
      site: ''
    }));
    setClientSearchTerm('');
    setSiteSearchTerm('');
  };

  const handleClearClient = () => {
    setClientSearchTerm('');
    setFormData(prev => ({ 
      ...prev, 
      cliente: '',
      site: ''
    }));
    setSiteSearchTerm('');
  };

  const handleClearSite = () => {
    setSiteSearchTerm('');
    setFormData(prev => ({ ...prev, site: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="inv-filter-dropdown" ref={dropdownRef}>
      <div className="inv-dropdown-header">
        <h3>Adicionar Equipamento</h3>
      </div>
      <div className="inv-filter-content">
        {/* Grupo Econômico Dropdown */}
        <div className="inv-filter-field">
          <label className="inv-filter-label">Grupo Econômico</label>
          <div className="search-input-container">
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
            {grupoSearchTerm && (
              <button className="clear-input-button" onClick={handleClearGrupo}>
                <FaTimesCircle />
              </button>
            )}
          </div>
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
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        grupo_economico: grupo.id,
                        cliente: '',
                        site: ''
                      }));
                      setGrupoSearchTerm(grupo.razao_social);
                      setIsGrupoDropdownOpen(false);
                      setClientSearchTerm('');
                      setSiteSearchTerm('');
                    }}
                  >
                    {grupo.razao_social}
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* Cliente Dropdown */}
        <div className="inv-filter-field">
          <label className="inv-filter-label">Cliente</label>
          <div className="search-input-container">
            <input
              className="inv-filter-input"
              type="text"
              value={clientSearchTerm}
              onChange={(e) => {
                setClientSearchTerm(e.target.value);
                setIsClientDropdownOpen(true);
              }}
              onFocus={() => setIsClientDropdownOpen(true)}
              placeholder="Pesquisar cliente..."
              disabled={!formData.grupo_economico}
            />
            {clientSearchTerm && (
              <button className="clear-input-button" onClick={handleClearClient}>
                <FaTimesCircle />
              </button>
            )}
          </div>
          {isClientDropdownOpen && formData.grupo_economico && (
            <div className="inv-client-dropdown">
              {clients
                .filter(client => 
                  client.razao_social.toLowerCase().includes(clientSearchTerm.toLowerCase())
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

        {/* Site Dropdown */}
        <div className="inv-filter-field">
          <label className="inv-filter-label">Site</label>
          <div className="search-input-container">
            <input
              className="inv-filter-input"
              type="text"
              value={siteSearchTerm}
              onChange={(e) => {
                setSiteSearchTerm(e.target.value);
                setIsSiteDropdownOpen(true);
              }}
              onFocus={() => setIsSiteDropdownOpen(true)}
              placeholder="Pesquisar site..."
              disabled={!formData.cliente}
            />
            {siteSearchTerm && (
              <button className="clear-input-button" onClick={handleClearSite}>
                <FaTimesCircle />
              </button>
            )}
          </div>
          {isSiteDropdownOpen && formData.cliente && (
            <div className="inv-client-dropdown">
              {sites
                .filter(site => 
                  site.razao_social.toLowerCase().includes(siteSearchTerm.toLowerCase())
                )
                .map(site => (
                  <div
                    key={site.id}
                    className="inv-client-option"
                    onClick={() => handleSiteSelect(site)}
                  >
                    {site.razao_social} ({site.codigo_vivo})
                  </div>
                ))
              }
            </div>
          )}
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Tipo</label>
          <input
            className="inv-filter-input"
            type="text"
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Fornecedor</label>
          <input
            className="inv-filter-input"
            type="text"
            name="fornecedor"
            value={formData.fornecedor}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Modelo</label>
          <input
            className="inv-filter-input"
            type="text"
            name="modelo"
            value={formData.modelo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Número de Série</label>
          <input
            className="inv-filter-input"
            type="text"
            name="serial_number"
            value={formData.serial_number}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Redundância</label>
          <div className="search-input-container">
            <input
              className="inv-filter-input"
              type="text"
              value={formData.redundancia ? "Sim" : "Não"}
              onClick={() => setIsRedundanciaDropdownOpen(!isRedundanciaDropdownOpen)}
              readOnly
            />
          </div>
          {isRedundanciaDropdownOpen && (
            <div className="inv-client-dropdown">
              <div 
                className="inv-client-option"
                onClick={() => {
                  setFormData(prev => ({ ...prev, redundancia: true }));
                  setIsRedundanciaDropdownOpen(false);
                }}
              >
                Sim
              </div>
              <div 
                className="inv-client-option"
                onClick={() => {
                  setFormData(prev => ({ ...prev, redundancia: false }));
                  setIsRedundanciaDropdownOpen(false);
                }}
              >
                Não
              </div>
            </div>
          )}
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Status</label>
          <div className="search-input-container">
            <input
              className="inv-filter-input"
              type="text"
              value={formData.status ? "Ativo" : "Inativo"}
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              readOnly
            />
          </div>
          {isStatusDropdownOpen && (
            <div className="inv-client-dropdown">
              <div 
                className="inv-client-option"
                onClick={() => {
                  setFormData(prev => ({ ...prev, status: true }));
                  setIsStatusDropdownOpen(false);
                }}
              >
                Ativo
              </div>
              <div 
                className="inv-client-option"
                onClick={() => {
                  setFormData(prev => ({ ...prev, status: false }));
                  setIsStatusDropdownOpen(false);
                }}
              >
                Inativo
              </div>
            </div>
          )}
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Fim de Vida HW</label>
          <input
            className="inv-filter-input"
            type="date"
            name="hw_end_life_cycle"
            value={formData.hw_end_life_cycle}
            onChange={handleInputChange}
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Fim de Suporte HW</label>
          <input
            className="inv-filter-input"
            type="date"
            name="hw_end_support"
            value={formData.hw_end_support}
            onChange={handleInputChange}
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Fim de Vida SW</label>
          <input
            className="inv-filter-input"
            type="date"
            name="sw_end_life_cycle"
            value={formData.sw_end_life_cycle}
            onChange={handleInputChange}
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Fim de Suporte SW</label>
          <input
            className="inv-filter-input"
            type="date"
            name="sw_end_support"
            value={formData.sw_end_support}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="inv-filter-actions">
        <button className="inv-cancel-button" onClick={onClose}>
          <FaTimes /> Cancelar
        </button>
        <button className="inv-save-button" onClick={handleSubmit}>
          <FaSave /> Salvar
        </button>
      </div>
    </div>
  );
}

export default AddEquipamentoDropdown;
