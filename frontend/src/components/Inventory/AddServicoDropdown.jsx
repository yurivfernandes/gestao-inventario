import React, { useState, useRef, useEffect } from 'react';
import { FaSave, FaTimes, FaTimesCircle } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/FilterDropdown.css';

function AddServicoDropdown({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    grupo_economico: '',
    cliente: '',
    site: '',
    designador: '',
    servico_num: '',
    oferta: '',
    pacote: '',
    redundancia: false,
    operadora: '',
    ip: '',
    ra: '',
    status: true
  });

  const [gruposEconomicos, setGruposEconomicos] = useState([]);
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedEquipamento, setSelectedEquipamento] = useState(null);
  const [grupoSearchTerm, setGrupoSearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [siteSearchTerm, setSiteSearchTerm] = useState('');
  const [equipamentoSearchTerm, setEquipamentoSearchTerm] = useState('');
  const [isGrupoDropdownOpen, setIsGrupoDropdownOpen] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [isEquipamentoDropdownOpen, setIsEquipamentoDropdownOpen] = useState(false);
  const [isRedundanciaDropdownOpen, setIsRedundanciaDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchGruposEconomicos();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchSitesByClient(selectedClient);
    } else {
      setSites([]);
    }
  }, [selectedClient]);

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
    if (selectedSite) {
      fetchEquipamentosBySite(selectedSite);
    } else {
      setEquipamentos([]);
    }
  }, [selectedSite]);

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

  const fetchClients = async (grupoId) => {
    try {
      const response = await api.get('/inventario/clientes/', {
        params: {
          grupo_economico: grupoId,
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

  const fetchSitesByClient = async (clientId) => {
    try {
      const response = await api.get('/inventario/sites/', {
        params: {
          cliente: clientId,
          grupo_economico: formData.grupo_economico,
          status: true
        }
      });
      setSites(response.data.results || []);
    } catch (error) {
      console.error('Erro ao carregar sites:', error);
      setSites([]);
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

  const handleClientSelect = (client) => {
    setSelectedClient(client.id);
    setClientSearchTerm(client.razao_social);
    setIsClientDropdownOpen(false);
    setSiteSearchTerm('');
    setSelectedSite(null);
    setFormData(prev => ({ ...prev, cliente: client.id, site: '' }));
    fetchSitesByClient(client.id);
  };

  const handleSiteSelect = (site) => {
    setSelectedSite(site.id);
    setSiteSearchTerm(site.razao_social);
    setIsSiteDropdownOpen(false);
    setFormData(prev => ({ ...prev, site: site.id }));
  };

  const handleEquipamentoSelect = (equipamento) => {
    setSelectedEquipamento(equipamento.id);
    setEquipamentoSearchTerm(equipamento.modelo);
    setIsEquipamentoDropdownOpen(false);
    setFormData(prev => ({ ...prev, equipamento: equipamento.id }));
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
      const { grupo_economico, cliente, ...dataToSend } = formData;
      const response = await api.post('/inventario/servicos/', dataToSend);
      onSuccess(response.data);
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
    }
  };

  const handleClearClient = () => {
    setClientSearchTerm('');
    setSelectedClient(null);
    setSiteSearchTerm('');
    setSelectedSite(null);
    setFormData(prev => ({ ...prev, cliente: '', site: '' }));
  };

  const handleClearSite = () => {
    setSiteSearchTerm('');
    setSelectedSite(null);
    setFormData(prev => ({ ...prev, site: '' }));
  };

  const handleClearEquipamento = () => {
    setEquipamentoSearchTerm('');
    setSelectedEquipamento(null);
    setFormData(prev => ({ ...prev, equipamento: '' }));
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

  if (!isOpen) return null;

  return (
    <div className="inv-filter-dropdown" ref={dropdownRef}>
      <div className="inv-dropdown-header">
        <h3>Adicionar Serviço</h3>
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
                      setFormData(prev => ({ ...prev, grupo_economico: grupo.id }));
                      setGrupoSearchTerm(grupo.razao_social);
                      setIsGrupoDropdownOpen(false);
                    }}
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
          {isClientDropdownOpen && (
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
                    {client.razao_social} ({client.codigo})
                  </div>
                ))
              }
            </div>
          )}
        </div>

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
              disabled={!selectedClient}
            />
            {siteSearchTerm && (
              <button className="clear-input-button" onClick={handleClearSite}>
                <FaTimesCircle />
              </button>
            )}
          </div>
          {isSiteDropdownOpen && selectedClient && (
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
              disabled={!selectedSite}
            />
            {equipamentoSearchTerm && (
              <button className="clear-input-button" onClick={handleClearEquipamento}>
                <FaTimesCircle />
              </button>
            )}
          </div>
          {isEquipamentoDropdownOpen && selectedSite && (
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

        <div className="inv-filter-field">
          <label className="inv-filter-label">Designador</label>
          <input
            className="inv-filter-input"
            type="text"
            name="designador"
            value={formData.designador}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Número do Serviço</label>
          <input
            className="inv-filter-input"
            type="text"
            name="servico_num"
            value={formData.servico_num}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Oferta</label>
          <input
            className="inv-filter-input"
            type="text"
            name="oferta"
            value={formData.oferta}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Pacote</label>
          <input
            className="inv-filter-input"
            type="text"
            name="pacote"
            value={formData.pacote}
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
          <label className="inv-filter-label">Operadora</label>
          <input
            className="inv-filter-input"
            type="text"
            name="operadora"
            value={formData.operadora}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">IP</label>
          <input
            className="inv-filter-input"
            type="text"
            name="ip"
            value={formData.ip}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">RA</label>
          <input
            className="inv-filter-input"
            type="text"
            name="ra"
            value={formData.ra}
            onChange={handleInputChange}
            required
          />
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

export default AddServicoDropdown;
