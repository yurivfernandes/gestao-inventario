import React, { useState, useRef, useEffect } from 'react';
import { FaSave, FaTimes, FaTimesCircle } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/FilterDropdown.css';

function AddServicoDropdown({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    equipamento: '',
    codigo: '',
    designador: '',
    tipo: '',
    status: true
  });
  
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [siteSearchTerm, setSiteSearchTerm] = useState('');
  const [equipmentSearchTerm, setEquipmentSearchTerm] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [isEquipmentDropdownOpen, setIsEquipmentDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchClients();
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
    if (selectedSite && selectedClient) {
      fetchEquipmentsBySite(selectedSite, selectedClient);
    } else {
      setEquipments([]);
    }
  }, [selectedSite, selectedClient]);

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
      const response = await api.get(`/inventario/sites/?cliente=${clientId}`);
      setSites(response.data.results);
    } catch (error) {
      console.error('Erro ao carregar sites:', error);
      setSites([]);
    }
  };

  const fetchEquipmentsBySite = async (siteId, clientId) => {
    try {
      const response = await api.get(`/inventario/equipamentos/?site=${siteId}&cliente=${clientId}`);
      console.log('Equipamentos carregados:', response.data.results); // Debug
      setEquipments(response.data.results);
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
      setEquipments([]);
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client.id);
    setClientSearchTerm(client.razao_social);
    setIsClientDropdownOpen(false);
    setSiteSearchTerm('');
    setEquipmentSearchTerm('');
    setSelectedSite(null);
    setFormData(prev => ({ ...prev, equipamento: '' }));
    fetchSitesByClient(client.id);
  };

  const handleSiteSelect = (site) => {
    setSelectedSite(site.id);
    setSiteSearchTerm(`${site.codigo_vivo} - ${site.codigo_sys_cliente}`);
    setIsSiteDropdownOpen(false);
    setEquipmentSearchTerm('');
    setFormData(prev => ({ ...prev, equipamento: '' }));
    fetchEquipmentsBySite(site.id, selectedClient);
  };

  const handleEquipmentSelect = (equipment) => {
    setFormData(prev => ({ ...prev, equipamento: equipment.id }));
    setEquipmentSearchTerm(`${equipment.codigo} - ${equipment.designador}`);
    setIsEquipmentDropdownOpen(false);
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
      const response = await api.post('/inventario/servicos/', {
        ...formData,
        cliente: selectedClient,
        site: selectedSite
      });
      onSuccess({
        ...response.data,
        cliente: selectedClient,
        site: selectedSite,
        equipamento: formData.equipamento
      });
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
    }
  };

  const handleClearClient = () => {
    setClientSearchTerm('');
    setSelectedClient(null);
    setSiteSearchTerm('');
    setEquipmentSearchTerm('');
    setSelectedSite(null);
    setFormData(prev => ({ ...prev, equipamento: '' }));
  };

  const handleClearSite = () => {
    setSiteSearchTerm('');
    setSelectedSite(null);
    setEquipmentSearchTerm('');
    setFormData(prev => ({ ...prev, equipamento: '' }));
  };

  const handleClearEquipment = () => {
    setEquipmentSearchTerm('');
    setFormData(prev => ({ ...prev, equipamento: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="inv-filter-dropdown" ref={dropdownRef}>
      <div className="inv-dropdown-header">
        <h3>Adicionar Serviço</h3>
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
                  site.codigo_vivo.toLowerCase().includes(siteSearchTerm.toLowerCase())
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
          <label className="inv-filter-label">Equipamento</label>
          <div className="search-input-container">
            <input
              className="inv-filter-input"
              type="text"
              value={equipmentSearchTerm}
              onChange={(e) => {
                setEquipmentSearchTerm(e.target.value);
                setIsEquipmentDropdownOpen(true);
              }}
              onFocus={() => {
                setIsEquipmentDropdownOpen(true);
                if (selectedSite && equipments.length === 0) {
                  fetchEquipmentsBySite(selectedSite, selectedClient);
                }
              }}
              placeholder="Pesquisar equipamento..."
              disabled={!selectedSite}
            />
            {equipmentSearchTerm && (
              <button 
                className="clear-input-button" 
                onClick={handleClearEquipment}
                type="button"
              >
                <FaTimesCircle />
              </button>
            )}
          </div>
          {isEquipmentDropdownOpen && selectedSite && (
            <div className="inv-client-dropdown">
              {equipments.length > 0 ? (
                equipments
                  .filter(equipment => 
                    equipment.codigo.toLowerCase().includes(equipmentSearchTerm.toLowerCase()) ||
                    equipment.designador.toLowerCase().includes(equipmentSearchTerm.toLowerCase())
                  )
                  .map(equipment => (
                    <div
                      key={equipment.id}
                      className="inv-client-option"
                      onClick={() => handleEquipmentSelect(equipment)}
                    >
                      {equipment.codigo} - {equipment.designador} ({equipment.tipo})
                    </div>
                  ))
              ) : (
                <div className="inv-client-option">
                  Nenhum equipamento encontrado
                </div>
              )}
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

export default AddServicoDropdown;
