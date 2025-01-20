import React, { useState, useEffect } from 'react';
import { FaFilter, FaPlus } from 'react-icons/fa';
import Header from '../components/Header/Header';
import FilterDropdown from '../components/Inventory/FilterDropdown';
import AddClientDropdown from '../components/Inventory/AddClientDropdown';
import InventoryTable from '../components/Inventory/InventoryTable';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/InventoryPage.css';

const tabs = [
  { id: 'clients', label: 'Clientes' },
  { id: 'sites', label: 'Sites' },
  { id: 'equipments', label: 'Equipamentos' },
  { id: 'services', label: 'Serviços' }
];

function InventoryPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('clients');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [tableData, setTableData] = useState({
    clients: [],
    sites: [],
    equipments: [],
    services: []
  });
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState({
    clients: 1,
    sites: 1,
    equipments: 1,
    services: 1
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchData = async (type, page = 1) => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({ page });
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      let response;

      switch (type) {
        case 'clients':
          response = await api.get(`/inventario/clientes/?${queryString}`);
          setTableData(prev => ({ ...prev, clients: response.data.results }));
          setTotalPages(prev => ({ ...prev, clients: response.data.num_pages }));
          break;
        case 'sites':
          response = await api.get(`/inventario/sites/?${queryString}`);
          setTableData(prev => ({ ...prev, sites: response.data.results }));
          setTotalPages(prev => ({ ...prev, sites: response.data.num_pages }));
          break;
        case 'equipments':
          response = await api.get(`/inventario/equipamentos/?${queryString}`);
          setTableData(prev => ({ ...prev, equipments: response.data.results }));
          setTotalPages(prev => ({ ...prev, equipments: response.data.num_pages }));
          break;
        case 'services':
          response = await api.get(`/inventario/servicos/?${queryString}`);
          setTableData(prev => ({ ...prev, services: response.data.results }));
          setTotalPages(prev => ({ ...prev, services: response.data.num_pages }));
          break;
        default:
          break;
      }

      setIsFilterOpen(false);
    } catch (error) {
      console.error('Erro ao aplicar filtros:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab, currentPage);
  }, [filters, activeTab, currentPage]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1); // Resetar a página ao mudar de aba
  };

  // Adicione esta função
  const handleAddSuccess = () => {
    setIsAddOpen(false);
    fetchData(activeTab, currentPage);
  };

  return (
    <div className="inventory-page">
      <Header />
      
      <main className="inventory-content">
        <div className="inventory-header">
          <div className="tabs-container">
            <div className="tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="actions-container">
            {activeTab === 'clients' && (
              <button 
                className="action-button"
                onClick={() => setIsAddOpen(!isAddOpen)}
              >
                <FaPlus /> Adicionar Cliente
              </button>
            )}

            <button 
              className="filter-button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FaFilter /> Filtros
              {Object.keys(filters).length > 0 && (
                <span className="filter-badge">
                  {Object.keys(filters).length}
                </span>
              )}
            </button>
            
            {isFilterOpen && (
              <FilterDropdown
                isOpen={isFilterOpen}
                filters={filters}
                setFilters={setFilters}
                onApply={() => fetchData(activeTab, 1)}
                onClose={() => setIsFilterOpen(false)}
              />
            )}

            {isAddOpen && activeTab === 'clients' && (
              <AddClientDropdown
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleAddSuccess}
              />
            )}
          </div>
        </div>

        <div className="table-container">
          <InventoryTable 
            type={activeTab}
            data={tableData[activeTab]}
            loading={loading}
            onPageChange={(page) => setCurrentPage(page)}
            totalPages={totalPages[activeTab]}
            currentPage={currentPage}
            fetchData={fetchData}
          />
        </div>
      </main>
    </div>
  );
}


export default InventoryPage;
