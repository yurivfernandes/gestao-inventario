import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Header from '../components/Header/Header';
import InventoryFlow from '../components/Inventory/InventoryFlow';
import '../styles/InventoryPage.css';

function InventoryFlowPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    clients: { results: [], count: 0, currentPage: 1 },
    sites: {},
    equipments: {},
    services: {}
  });

  useEffect(() => {
    fetchClients(1);
  }, []);

  const fetchClients = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/inventario/clientes/?page=${page}`, {
        headers: { Authorization: `Token ${token}` }
      });
      
      setData(prev => ({ 
        ...prev, 
        clients: {
          results: response.data.results,
          count: response.data.count,
          currentPage: response.data.current_page,
          numPages: response.data.num_pages
        }
      }));
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const fetchChildData = async (type, parentId, page = 1, params = {}) => {
    if (!parentId && type !== 'clients') return;

    try {
      // Converter 'equipment' para 'equipamento' nos parâmetros
      const adjustedParams = {...params};
      if (adjustedParams.equipment) {
        adjustedParams.equipamento = adjustedParams.equipment;
        delete adjustedParams.equipment;
      }

      const queryParams = new URLSearchParams({
        page: String(page),
        ...adjustedParams
      });

      if (type === 'clients') {
        const queryParams = new URLSearchParams({
          page: page,
          ...params
        });

        const response = await api.get(`/inventario/clientes/?${queryParams}`, {
          headers: { Authorization: `Token ${token}` }
        });
        
        setData(prev => ({
          ...prev,
          clients: {
            results: response.data.results,
            count: response.data.count,
            currentPage: response.data.current_page,
            numPages: response.data.num_pages
          }
        }));
        return;
      }

      const baseEndpoints = {
        sites: `/inventario/sites/?cliente=${parentId}`,
        equipments: `/inventario/equipamentos/?cliente=${parentId}`,
        services: `/inventario/servicos/?cliente=${parentId}`
      };

      // Correção na construção da URL
      const url = `${baseEndpoints[type]}&${queryParams.toString()}`;
      console.log('Fetching URL:', url); // Para debug

      const response = await api.get(url, {
        headers: { Authorization: `Token ${token}` }
      });
      
      setData(prev => ({
        ...prev,
        [type]: { 
          ...prev[type], 
          [parentId]: {
            results: response.data.results,
            count: response.data.count,
            currentPage: response.data.current_page,
            numPages: response.data.num_pages
          }
        }
      }));
    } catch (err) {
      console.error(`Erro ao carregar ${type}:`, err);
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