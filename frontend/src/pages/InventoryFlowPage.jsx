
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
    clients: [],
    sites: {},
    equipments: {},
    services: {}
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/inventario/clientes/', {
        headers: { Authorization: `Token ${token}` }
      });
      setData(prev => ({ ...prev, clients: response.data }));
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const fetchChildData = async (type, parentId) => {
    if (!parentId) return;

    try {
      const endpoints = {
        sites: `/inventario/sites/?cliente=${parentId}`,
        equipments: `/inventario/equipamentos/?cliente=${parentId}`,
        services: `/inventario/servicos/?cliente=${parentId}`
      };

      const response = await api.get(endpoints[type], {
        headers: { Authorization: `Token ${token}` }
      });
      
      if (response.data) {
        setData(prev => ({
          ...prev,
          [type]: { 
            ...prev[type], 
            [parentId]: Array.isArray(response.data) ? response.data : []
          }
        }));
      }
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