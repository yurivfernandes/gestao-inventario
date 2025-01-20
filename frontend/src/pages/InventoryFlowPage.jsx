import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Header from '../components/Header/Header';
import InventoryFlow from '../components/Inventory/InventoryFlow';
import '../styles/InventoryFlow.css';

function InventoryFlowPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    economic_groups: { results: [], count: 0, currentPage: 1 },
    clients: { results: [], count: 0, currentPage: 1 },
    sites: {},
    equipments: {},
    services: {}
  });

  useEffect(() => {
    fetchGruposEconomicos(1);
  }, []);

  const fetchGruposEconomicos = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/inventario/grupos-economicos/?page=${page}`);
      setData(prev => ({
        ...prev,
        economic_groups: {
          results: response.data.results,
          count: response.data.count,
          currentPage: response.data.current_page,
          numPages: response.data.num_pages
        }
      }));
    } catch (err) {
      setError('Erro ao carregar grupos econômicos');
    } finally {
      setLoading(false);
    }
  };

  const fetchChildData = async (type, parentId, params = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: String(params.page || 1),
        ...params
      });

      let endpoint = `/inventario/${getEndpoint(type)}/?${queryParams}`;
      console.log('Fetching:', endpoint); // Para debug

      const response = await api.get(endpoint);
      
      // Atualizar o estado com os novos dados
      setData(prev => ({
        ...prev,
        [type]: {
          results: response.data.results,
          count: response.data.count,
          currentPage: response.data.current_page,
          numPages: response.data.num_pages
        }
      }));

      return response.data;
    } catch (err) {
      console.error(`Erro ao carregar ${type}:`, err);
      return null;
    }
  };

  const getEndpoint = (type) => {
    switch(type) {
      case 'clients':
        return 'clientes';
      case 'sites':
        return 'sites';
      case 'equipments':
        return 'equipamentos';
      case 'services':
        return 'servicos';
      default:
        return type;
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Header />
      <div className="inventory-container">
        <InventoryFlow 
          data={data}
          onFetchData={fetchChildData}
        />
      </div>
    </>
  );
}

export default InventoryFlowPage;