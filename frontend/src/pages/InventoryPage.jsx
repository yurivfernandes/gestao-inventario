import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Header from '../components/Header/Header';
import InventoryFlow from '../components/Inventory/InventoryFlow';
import InventoryTables from '../components/Inventory/InventoryTables';
import '../styles/InventoryPage.css';
import { 
  FaThLarge, FaUsers, FaBuilding, FaServer, FaCogs 
} from 'react-icons/fa';

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
  const [activeTab, setActiveTab] = useState('cards');

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

  const tabs = [
    { id: 'cards', label: 'Navegue pela Estrutura', icon: FaThLarge },
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
          {activeTab === 'cards' ? (
            <InventoryFlow 
              data={data}
              onFetchData={fetchChildData}
            />
          ) : (
            <InventoryTables
              type={activeTab}
              data={data}
              onFetchData={fetchChildData}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default InventoryPage;

