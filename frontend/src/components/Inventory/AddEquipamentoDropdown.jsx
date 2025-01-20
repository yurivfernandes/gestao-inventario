import React, { useState, useRef, useEffect } from 'react';
import { FaSave, FaTimes, FaTimesCircle } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/FilterDropdown.css';

function AddEquipamentoDropdown({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    site: '',
    codigo: '',
    designador: '',
    tipo: '',
    status: true
  });
  
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [siteSearchTerm, setSiteSearchTerm] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchClients();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedClient) {
      // Agora só busca sites quando o cliente é selecionado
      fetchSitesByClient(selectedClient);
    } else {
      setFilteredSites([]);
    }
  }, [selectedClient]);

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

  const fetchSitesByClient = async (clientId) => {
    try {
      // Simplificando a chamada para buscar apenas por cliente
      const response = await api.get(`/inventario/sites/?cliente=${clientId}`);
      setFilteredSites(response.data.results);
    } catch (error) {
      console.error('Erro ao carregar sites:', error);
      setFilteredSites([]);
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client.id);
    setClientSearchTerm(client.razao_social);
    setIsClientDropdownOpen(false);
    setSiteSearchTerm('');
    setFormData(prev => ({ ...prev, site: '' }));
    // Chama API para buscar sites do cliente selecionado
    fetchSitesByClient(client.id);
  };

  const handleSiteSelect = (site) => {
    setFormData(prev => ({ ...prev, site: site.id }));
    setSiteSearchTerm(`${site.codigo_vivo} - ${site.codigo_sys_cliente}`);
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
      const response = await api.post('/inventario/equipamentos/', {
        ...formData,
        cliente: selectedClient // Incluindo o cliente selecionado
      });
      // Passa o objeto completo do equipamento criado para o callback de sucesso
      onSuccess({
        ...response.data,
        cliente: selectedClient,
        site: formData.site
      });
      // Reset do form...
    } catch (error) {
      console.error('Erro ao adicionar equipamento:', error);
    }
  };

  const handleClearClient = () => {
    setClientSearchTerm('');
    setSelectedClient(null);
    setFormData(prev => ({ ...prev, site: '' }));
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
            />
            {clientSearchTerm && (
              <button
                className="clear-input-button"
                onClick={handleClearClient}
                type="button"
              >
                <FaTimesCircle />
              </button>
            )}
          </div>
          {isClientDropdownOpen && (
            <div className="inv-client-dropdown">
              {clients
                .filter(client => 
                  client.razao_social.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                  client.codigo.toLowerCase().includes(clientSearchTerm.toLowerCase())
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
              <button
                className="clear-input-button"
                onClick={handleClearSite}
                type="button"
              >
                <FaTimesCircle />
              </button>
            )}
          </div>
          {isSiteDropdownOpen && selectedClient && (
            <div className="inv-client-dropdown">
              {filteredSites
                .filter(site => 
                  site.codigo_vivo.toLowerCase().includes(siteSearchTerm.toLowerCase()) ||
                  site.codigo_sys_cliente.toLowerCase().includes(siteSearchTerm.toLowerCase())
                )
                .map(site => (
                  <div
                    key={site.id}
                    className="inv-client-option"
                    onClick={() => handleSiteSelect(site)}
                  >
                    {site.codigo_vivo} - {site.codigo_sys_cliente}
                  </div>
                ))
              }
            </div>
          )}
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Código</label>
          <input
            className="inv-filter-input"
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleInputChange}
            required
          />
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

export default AddEquipamentoDropdown;
