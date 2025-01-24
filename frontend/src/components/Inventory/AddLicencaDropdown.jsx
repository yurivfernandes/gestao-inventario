import React, { useState, useRef, useEffect } from 'react';
import { FaSave, FaTimes, FaTimesCircle } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/FilterDropdown.css';

function AddLicencaDropdown({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    grupo_economico: '',
    cliente: '',
    site: '',
    equipamento: '',
    contrato: '',
    licenca_numero: '',
    status: true
  });

  const [gruposEconomicos, setGruposEconomicos] = useState([]);
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [selectedEquipamento, setSelectedEquipamento] = useState(null);
  const [grupoSearchTerm, setGrupoSearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [siteSearchTerm, setSiteSearchTerm] = useState('');
  const [equipamentoSearchTerm, setEquipamentoSearchTerm] = useState('');
  const [contratoSearchTerm, setContratoSearchTerm] = useState('');
  const [isGrupoDropdownOpen, setIsGrupoDropdownOpen] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [isEquipamentoDropdownOpen, setIsEquipamentoDropdownOpen] = useState(false);
  const [isContratoDropdownOpen, setIsContratoDropdownOpen] = useState(false);
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

  useEffect(() => {
    if (formData.site) {
      fetchEquipamentosBySite(formData.site);
    } else {
      setEquipamentos([]);
    }
  }, [formData.site]);

  useEffect(() => {
    if (formData.equipamento) {
      fetchContratos(formData.equipamento, formData.grupo_economico);
    }
  }, [formData.equipamento]);

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
          cliente: clienteId,
          grupo_economico: formData.grupo_economico,
          status: true
        }
      });
      setSites(response.data.results || []);
    } catch (error) {
      console.error('Erro ao carregar sites:', error);
    }
  };

  const fetchEquipamentosBySite = async (siteId) => {
    try {
      const response = await api.get('/inventario/equipamentos/', {
        params: {
          site: siteId,
          grupo_economico: formData.grupo_economico,
          status: true
        }
      });
      setEquipamentos(response.data.results || []);
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
      setEquipamentos([]);
    }
  };

  const fetchContratos = async (equipamentoId, grupoEconomicoId) => {
    try {
      if (!equipamentoId || !grupoEconomicoId) {
        setContratos([]);
        return;
      }
      
      const response = await api.get('/inventario/contratos/', {
        params: {
          equipamento: equipamentoId,
          grupo_economico: grupoEconomicoId,
          status: true
        }
      });
      setContratos(response.data.results || []);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
      setContratos([]);
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
    setSiteSearchTerm(site.razao_social);
    setIsSiteDropdownOpen(false);
  };

  const handleEquipamentoSelect = (equipamento) => {
    setSelectedEquipamento(equipamento.id);
    setEquipamentoSearchTerm(equipamento.modelo);
    setIsEquipamentoDropdownOpen(false);
    setFormData(prev => ({ ...prev, equipamento: equipamento.id }));
  };

  const handleContratoSelect = (contrato) => {
    setFormData(prev => ({ ...prev, contrato: contrato.id }));
    setContratoSearchTerm(contrato.sku); // Alterado de numero para sku
    setIsContratoDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? value === 'true' : value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post('/inventario/licencas/', formData);
      onSuccess(response.data);
    } catch (error) {
      console.error('Erro ao adicionar licença:', error);
    }
  };

  const handleClearClient = () => {
    setClientSearchTerm('');
    setFormData(prev => ({ 
      ...prev, 
      cliente: '',
      site: '',
      equipamento: '',
      contrato: ''
    }));
    setSiteSearchTerm('');
    setEquipamentoSearchTerm('');
    setContratoSearchTerm('');
  };

  const handleClearSite = () => {
    setSiteSearchTerm('');
    setFormData(prev => ({ 
      ...prev, 
      site: '',
      equipamento: '',
      contrato: ''
    }));
    setEquipamentoSearchTerm('');
    setContratoSearchTerm('');
  };

  const handleClearEquipamento = () => {
    setEquipamentoSearchTerm('');
    setSelectedEquipamento(null);
    setFormData(prev => ({ 
      ...prev, 
      equipamento: '',
      contrato: ''
    }));
    setContratoSearchTerm('');
  };

  const handleClearGrupo = () => {
    setGrupoSearchTerm('');
    setFormData(prev => ({
      ...prev,
      grupo_economico: '',
      cliente: '',
      site: '',
      equipamento: '',
      contrato: ''
    }));
    setClientSearchTerm('');
    setSiteSearchTerm('');
    setEquipamentoSearchTerm('');
    setContratoSearchTerm('');
  };

  const handleClearContrato = () => {
    setContratoSearchTerm('');
    setFormData(prev => ({ ...prev, contrato: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="inv-filter-dropdown" ref={dropdownRef}>
      <div className="inv-dropdown-header">
        <h3>Adicionar Licença</h3>
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
                        site: '',
                        equipamento: '',
                        contrato: ''
                      }));
                      setGrupoSearchTerm(grupo.razao_social);
                      setIsGrupoDropdownOpen(false);
                      setClientSearchTerm('');
                      setSiteSearchTerm('');
                      setEquipamentoSearchTerm('');
                      setContratoSearchTerm('');
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

        {/* Equipamento Dropdown */}
        <div className="inv-filter-field">
          <label className="inv-filter-label">Equipamento</label>
          <div className="search-input-container">
            <input
              className="inv-filter-input"
              type="text"
              value={equipamentoSearchTerm}
              onChange={(e) => {
                setEquipamentoSearchTerm(e.target.value);
                setIsEquipamentoDropdownOpen(true);
              }}
              onFocus={() => setIsEquipamentoDropdownOpen(true)}
              placeholder="Pesquisar equipamento..."
              disabled={!formData.site}
            />
            {equipamentoSearchTerm && (
              <button className="clear-input-button" onClick={handleClearEquipamento}>
                <FaTimesCircle />
              </button>
            )}
          </div>
          {isEquipamentoDropdownOpen && formData.site && (
            <div className="inv-client-dropdown">
              {equipamentos
                .filter(equipamento => 
                  equipamento.modelo.toLowerCase().includes(equipamentoSearchTerm.toLowerCase())
                )
                .map(equipamento => (
                  <div
                    key={equipamento.id}
                    className="inv-client-option"
                    onClick={() => handleEquipamentoSelect(equipamento)}
                  >
                    {equipamento.modelo} ({equipamento.codigo})
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* Contrato Dropdown */}
        <div className="inv-filter-field">
          <label className="inv-filter-label">Contrato</label>
          <div className="search-input-container">
            <input
              className="inv-filter-input"
              type="text"
              value={contratoSearchTerm}
              onChange={(e) => {
                setContratoSearchTerm(e.target.value);
                setIsContratoDropdownOpen(true);
              }}
              onFocus={() => setIsContratoDropdownOpen(true)}
              placeholder="Pesquisar contrato..."
              disabled={!formData.equipamento}
            />
            {contratoSearchTerm && (
              <button className="clear-input-button" onClick={handleClearContrato}>
                <FaTimesCircle />
              </button>
            )}
          </div>
          {isContratoDropdownOpen && formData.equipamento && (
            <div className="inv-client-dropdown">
              {contratos.filter(contrato => 
                contrato?.sku?.toLowerCase().includes(contratoSearchTerm.toLowerCase()) || false
              ).map(contrato => (
                <div
                  key={contrato.id}
                  className="inv-client-option"
                  onClick={() => handleContratoSelect(contrato)}
                >
                  {contrato.sku} {/* Alterado de numero para sku */}
                </div>
              ))}
              {contratos.length === 0 && (
                <div className="inv-client-option">
                  Nenhum contrato encontrado
                </div>
              )}
            </div>
          )}
        </div>

        {/* Campos específicos da licença */}
        <div className="inv-filter-field">
          <label className="inv-filter-label">Número da Licença</label>
          <input
            className="inv-filter-input"
            type="text"
            name="licenca_numero"
            value={formData.licenca_numero}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="inv-filter-field">
          <label className="inv-filter-label">Status</label>
          <select
            className="inv-filter-input"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value={true}>Ativo</option>
            <option value={false}>Inativo</option>
          </select>
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

export default AddLicencaDropdown;
