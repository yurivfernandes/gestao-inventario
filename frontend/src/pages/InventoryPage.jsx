import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Header from '../components/Header/Header';
import InventoryTables from '../components/Inventory/InventoryTables';
import '../styles/InventoryPage.css';
import { FaUsers, FaBuilding, FaServer, FaCogs } from 'react-icons/fa';

function InventoryPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    clients: [],
    sites: {},
    equipments: {},
    services: {}
  });
  const [activeTab, setActiveTab] = useState('clients');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/inventario/clientes/?page=${page}`, {
        headers: { Authorization: `Token ${token}` }
      });
      setData(prev => ({ ...prev, clients: response.data.results, clientsTotalPages: response.data.num_pages }));
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const fetchChildData = async (type, parentId, page = 1) => {
    if (type !== 'clients' && !parentId) {
      setError('Selecione um cliente primeiro');
      return;
    }

    try {
      const endpoints = {
        clients: '/inventario/clientes/',
        sites: `/inventario/sites/?cliente=${parentId}`,
        equipments: `/inventario/equipamentos/?cliente=${parentId}`,
        services: `/inventario/servicos/?cliente=${parentId}`
      };

      const response = await api.get(`${endpoints[type]}&page=${page}`, {
        headers: { Authorization: `Token ${token}` }
      });
      
      if (response.data) {
        if (type === 'clients') {
          setData(prev => ({
            ...prev,
            clients: response.data.results,
            clientsTotalPages: response.data.num_pages
          }));
        } else {
          setData(prev => ({
            ...prev,
            [type]: {
              ...prev[type],
              [parentId]: response.data.results
            },
            [`${type}TotalPages`]: response.data.num_pages
          }));
        }
      }
    } catch (err) {
      console.error(`Erro ao carregar ${type}:`, err);
    }
  };

  const tabs = [
    { id: 'clients', label: 'Clientes', icon: FaUsers },
    { id: 'sites', label: 'Sites', icon: FaBuilding },
    { id: 'equipments', label: 'Equipamentos', icon: FaServer },
    { id: 'services', label: 'Serviços', icon: FaCogs }
  ];

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Header />
      <div className="inventory-container">
        <div className="inventory-tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon />
                {tab.label}
              </button>
            );
          })}
        </div>
        
        <div className="tab-content">
          <InventoryTables
            type={activeTab}
            data={data}
            onFetchData={fetchChildData}          />
        </div>
      </div>
    </>
  );
}

export default InventoryPage;

