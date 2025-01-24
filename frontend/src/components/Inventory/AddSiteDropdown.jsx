import React, { useState, useRef, useEffect } from 'react';
import { FaSave, FaTimes, FaSearch, FaTimesCircle } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/FilterDropdown.css';

function AddSiteDropdown({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    grupo_economico: '',
    cliente: '',
    razao_social: '',
    cep: '',
    numero: '',
    complemento: '',
    codigo_sys_cliente: '',
    codigo_vivo: '',
    status: true,
    tipo_site: '',
    cnpj: ''
  });
  
  const [clients, setClients] = useState([]);
  const [gruposEconomicos, setGruposEconomicos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [grupoSearchTerm, setGrupoSearchTerm] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isGrupoDropdownOpen, setIsGrupoDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});
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

  const handleClientSearch = async (term) => {
    try {
      const response = await api.get('/inventario/clientes/', {
        params: {
          search: term,
          status: true,
          page_size: 100
        }
      });
      setClients(response.data.results.filter(client => client.status));
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const formatCEP = (value) => {
    const numbers = value.replace(/\D/g, '').substring(0, 8);
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
  };

  const validateCEP = async (cep) => {
    const unformattedCEP = cep.replace(/\D/g, '');
    if (unformattedCEP.length !== 8) return false;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${unformattedCEP}/json/`);
      const data = await response.json();
      return !data.erro;
    } catch (error) {
      return false;
    }
  };

  const formatCNPJ = (value) => {
    const numbers = value.replace(/\D/g, '').substring(0, 14);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12)}`;
  };

  const validateCNPJ = (cnpj) => {
    const numbers = cnpj.replace(/\D/g, '');
    
    if (numbers.length !== 14) return false;
    
    if (/^(\d)\1{13}$/.test(numbers)) return false;
    
    let length = numbers.length - 2;
    let numbers_array = numbers.substring(0, length);
    const digits = numbers.substring(length);
    let sum = 0;
    let pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += numbers_array.charAt(length - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return false;
    
    length = length + 1;
    numbers_array = numbers.substring(0, length);
    sum = 0;
    pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += numbers_array.charAt(length - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    return result === parseInt(digits.charAt(1));
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    
    if (name === 'cnpj') {
      const formattedCNPJ = formatCNPJ(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedCNPJ
      }));

      const unformattedCNPJ = formattedCNPJ.replace(/\D/g, '');
      if (unformattedCNPJ.length === 14) {
        const isValid = validateCNPJ(unformattedCNPJ);
        setErrors(prev => ({
          ...prev,
          cnpj: isValid ? null : 'invalid'
        }));
      } else {
        setErrors(prev => ({ ...prev, cnpj: null }));
      }
    } else if (name === 'cep') {
      const formattedCEP = formatCEP(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedCEP
      }));

      const unformattedCEP = formattedCEP.replace(/\D/g, '');
      if (unformattedCEP.length === 8) {
        const isValid = await validateCEP(unformattedCEP);
        setErrors(prev => ({
          ...prev,
          cep: isValid ? null : 'invalid'
        }));
      } else {
        setErrors(prev => ({ ...prev, cep: null }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleClearGrupo = () => {
    setGrupoSearchTerm('');
    setFormData(prev => ({ 
      ...prev, 
      grupo_economico: '',
      cliente: '' // Limpa também o cliente quando limpar o grupo
    }));
    setSearchTerm(''); // Limpa o campo de busca do cliente
  };

  const handleSubmit = async () => {
    try {
      // Remove grupo_economico do objeto antes de enviar
      const { grupo_economico, ...dataToSend } = formData;
      
      // Formata o CNPJ para enviar apenas números
      const unformattedCNPJ = dataToSend.cnpj.replace(/\D/g, '');
      
      const response = await api.post('/inventario/sites/', {
        ...dataToSend,
        cnpj: unformattedCNPJ
      });
      
      onSuccess(response.data);
      setFormData({
        grupo_economico: '',
        cliente: '',
        razao_social: '',
        cep: '',
        numero: '',
        complemento: '',
        codigo_sys_cliente: '',
        codigo_vivo: '',
        status: true,
        tipo_site: '',
        cnpj: ''
      });
    } catch (error) {
      console.error('Erro ao adicionar site:', error);
    }
  };

  const handleClearClient = () => {
    setSearchTerm('');
    setFormData(prev => ({ ...prev, cliente: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="inv-filter-dropdown" ref={dropdownRef}>
      <div className="inv-dropdown-header">
        <h3>Adicionar Site</h3>
      </div>
      <div className="inv-filter-content">
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
              <button
                className="clear-input-button"
                onClick={handleClearGrupo}
                type="button"
              >
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
                        cliente: '' 
                      }));
                      setGrupoSearchTerm(grupo.razao_social);
                      setIsGrupoDropdownOpen(false);
                      setSearchTerm(''); 
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
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsClientDropdownOpen(true);
              }}
              onFocus={() => setIsClientDropdownOpen(true)}
              placeholder="Pesquisar cliente..."
              disabled={!formData.grupo_economico}
            />
            {searchTerm && (
              <button
                className="clear-input-button"
                onClick={handleClearClient}
                type="button"
              >
                <FaTimesCircle />
              </button>
            )}
          </div>
          {isClientDropdownOpen && formData.grupo_economico && (
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
                      setFormData(prev => ({ ...prev, cliente: client.id }));
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

        <div className="inv-filter-field">
          <label className="inv-filter-label">CEP</label>
          <input
            className={`inv-filter-input ${
              formData.cep && (
                errors.cep === null ? 'valid' : 
                errors.cep === 'invalid' ? 'invalid' : ''
              )
            }`}
            type="text"
            name="cep"
            value={formData.cep}
            onChange={handleInputChange}
            placeholder="00000-000"
            maxLength={9}
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Número</label>
          <input
            className="inv-filter-input"
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Complemento</label>
          <input
            className="inv-filter-input"
            type="text"
            name="complemento"
            value={formData.complemento}
            onChange={handleInputChange}
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Código Sistema</label>
          <input
            className="inv-filter-input"
            type="text"
            name="codigo_sys_cliente"
            value={formData.codigo_sys_cliente}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Código Vivo</label>
          <input
            className="inv-filter-input"
            type="text"
            name="codigo_vivo"
            value={formData.codigo_vivo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Tipo Site</label>
          <input
            className="inv-filter-input"
            type="text"
            name="tipo_site"
            value={formData.tipo_site}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Razão Social</label>
          <input
            className="inv-filter-input"
            type="text"
            name="razao_social"
            value={formData.razao_social}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">CNPJ</label>
          <input
            className={`inv-filter-input ${
              formData.cnpj && (
                errors.cnpj === null ? 'valid' : 
                errors.cnpj === 'invalid' ? 'invalid' : ''
              )
            }`}
            type="text"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleInputChange}
            placeholder="00.000.000/0000-00"
            maxLength={18}
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

export default AddSiteDropdown;
