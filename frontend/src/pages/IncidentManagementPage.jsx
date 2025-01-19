import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import Header from '../components/Header/Header';
import IncidentFilterDropdown from '../components/Incidents/IncidentFilterDropdown';
import IncidentTable from '../components/Incidents/IncidentTable';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/InventoryPage.css';

const tabs = [
  { id: 'incidents', label: 'Incidentes' },
  { id: 'management', label: 'Gestão' }
];

function IncidentManagementPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('incidents');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({ page });
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const response = await api.get(`/incidentes/list/?${queryString}`);
      
      setTableData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 50)); // Assumindo 50 itens por página
      setIsFilterOpen(false);
    } catch (error) {
      console.error('Erro ao buscar incidentes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'incidents') {
      fetchData(currentPage);
    }
  }, [filters, activeTab, currentPage]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
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

          {activeTab === 'incidents' && (
            <div className="filter-container" style={{ position: 'relative' }}>
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
                <IncidentFilterDropdown
                  isOpen={isFilterOpen}
                  filters={filters}
                  setFilters={setFilters}
                  onApply={() => fetchData(1)}
                  onClose={() => setIsFilterOpen(false)}
                />
              )}
            </div>
          )}
        </div>

        <div className="table-container">
          {activeTab === 'incidents' ? (
            <IncidentTable 
              data={tableData}
              loading={loading}
              onPageChange={(page) => setCurrentPage(page)}
              totalPages={totalPages}
              currentPage={currentPage}
              fetchData={fetchData}
            />
          ) : (
            <div>Conteúdo da aba de Gestão</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default IncidentManagementPage;
