import React, { useState, useRef, useEffect } from 'react';
import { FaSave, FaTimes, FaSearch, FaTimesCircle } from 'react-icons/fa';
import api from '../../services/api';
import '../../styles/FilterDropdown.css';

function AddSiteDropdown({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    cliente: '',
    cep: '',
    numero: '',
    complemento: '',
    codigo_sys_cliente: '',
    codigo_vivo: '',
    status: true,
    tipo_site: '',
    tipo_negocio: ''
  });
  
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchClients();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    
    if (name === 'cep') {
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

  const handleSubmit = async () => {
    try {
      const response = await api.post('/inventario/sites/', formData);
      // Passa o objeto completo do site criado para o callback de sucesso
      onSuccess(response.data);
      setFormData({
        cliente: '',
        cep: '',
        numero: '',
        complemento: '',
        codigo_sys_cliente: '',
        codigo_vivo: '',
        status: true,
        tipo_site: '',
        tipo_negocio: ''
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
          <label className="inv-filter-label">Tipo Negócio</label>
          <input
            className="inv-filter-input"
            type="text"
            name="tipo_negocio"
            value={formData.tipo_negocio}
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

export default AddSiteDropdown;
