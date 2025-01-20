import React, { useState, useRef, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import api from '../../services/api';

function AddGrupoEconomicoDropdown({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    razao_social: '',
    cnpj: '',
    vantive_id: '',
    codigo: '',
    status: true
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
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
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const unformattedCNPJ = formData.cnpj.replace(/\D/g, '');
    
    if (!validateCNPJ(unformattedCNPJ)) {
      setErrors(prev => ({ ...prev, cnpj: 'CNPJ inválido' }));
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        cnpj: unformattedCNPJ
      };
      
      await api.post('/inventario/grupos-economicos/', dataToSend);
      onSuccess();
      setFormData({
        razao_social: '',
        cnpj: '',
        vantive_id: '',
        codigo: '',
        status: true
      });
      setErrors({});
      setError('');
    } catch (error) {
      if (error.response?.data?.cnpj) {
        setErrors(prev => ({ ...prev, cnpj: 'CNPJ já cadastrado' }));
      }
      setError('Erro ao adicionar grupo econômico. Verifique os dados e tente novamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="inv-filter-dropdown" ref={dropdownRef} 
         onClick={(e) => e.stopPropagation()}> {/* Adicionar isso para prevenir propagação */}
      <div className="inv-dropdown-header">
        <h3>Adicionar Grupo Econômico</h3>
      </div>
      <div className="inv-filter-content">
        {error && <div className="error-message">{error}</div>}
        <div className="inv-filter-field">
          <label className="inv-filter-label">Razão Social</label>
          <input
            className="inv-filter-input"
            type="text"
            name="razao_social"
            value={formData.razao_social}
            onChange={handleChange}
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
            onChange={handleChange}
            placeholder="00.000.000/0000-00"
            maxLength={18}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Vantive ID</label>
          <input
            className="inv-filter-input"
            type="text"
            name="vantive_id"
            value={formData.vantive_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="inv-filter-field">
          <label className="inv-filter-label">Código</label>
          <input
            className="inv-filter-input"
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inv-filter-field">
          <label className="inv-filter-label">Status</label>
          <select
            className="inv-filter-input"
            name="status"
            value={formData.status}
            onChange={handleChange}
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

export default AddGrupoEconomicoDropdown;
