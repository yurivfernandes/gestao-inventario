import React, { useState, useEffect } from 'react';
import { FaFilter, FaPlus } from 'react-icons/fa';
import Header from '../components/Header/Header';
import FilterDropdown from '../components/Inventory/FilterDropdown';
import AddClientDropdown from '../components/Inventory/AddClientDropdown';
import InventoryTable from '../components/Inventory/InventoryTable';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/InventoryPage.css';
import AddSiteDropdown from '../components/Inventory/AddSiteDropdown';
import AddEquipamentoDropdown from '../components/Inventory/AddEquipamentoDropdown';
import AddServicoDropdown from '../components/Inventory/AddServicoDropdown';
import AddGrupoEconomicoDropdown from '../components/Inventory/AddGrupoEconomicoDropdown';
import AddLinkDropdown from '../components/Inventory/AddLinkDropdown';
import AddContratoDropdown from '../components/Inventory/AddContratoDropdown';
import AddLicencaDropdown from '../components/Inventory/AddLicencaDropdown';

const tabs = [
  { id: 'economic_groups', label: 'Grupos Econômicos' },
  { id: 'clients', label: 'Clientes' },
  { id: 'sites', label: 'Sites' },
  { id: 'equipments', label: 'Equipamentos' },
  { id: 'services', label: 'Serviços' },
  { id: 'links', label: 'Links' },
  { id: 'contratos', label: 'Contratos' },
  { id: 'licencas', label: 'Licenças' }
];

function InventoryPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('economic_groups');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [tableData, setTableData] = useState({
    economic_groups: [],
    clients: [],
    sites: [],
    equipments: [],
    services: [],
    links: [],
    contratos: [],
    licencas: []
  });
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState({
    economic_groups: 1,
    clients: 1,
    sites: 1,
    equipments: 1,
    services: 1,
    links: 1,
    contratos: 1,
    licencas: 1
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [isAddEquipamentoOpen, setIsAddEquipamentoOpen] = useState(false);
  const [isAddServicoOpen, setIsAddServicoOpen] = useState(false);
  const [isAddGrupoEconomicoOpen, setIsAddGrupoEconomicoOpen] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isAddContratoOpen, setIsAddContratoOpen] = useState(false);
  const [isAddLicencaOpen, setIsAddLicencaOpen] = useState(false);

  const fetchData = async (type, page = 1) => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({ page });
      
      // Sempre incluir grupo_economico se existir no filtro
      if (filters.grupo_economico) {
        queryParams.append('grupo_economico', filters.grupo_economico);
      }

      // Adicionar outros filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'grupo_economico') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      let response;

      switch (type) {
        case 'economic_groups':
          response = await api.get(`/inventario/grupos-economicos/?${queryString}`);
          setTableData(prev => ({ ...prev, economic_groups: response.data.results }));
          setTotalPages(prev => ({ ...prev, economic_groups: response.data.num_pages }));
          break;
        case 'clients':
          // Agora sempre requer grupo_economico
          if (!filters.grupo_economico) {
            setTableData(prev => ({ ...prev, clients: [] }));
            setTotalPages(prev => ({ ...prev, clients: 1 }));
            return;
          }
          response = await api.get(`/inventario/clientes/?${queryString}`);
          setTableData(prev => ({ ...prev, clients: response.data.results }));
          setTotalPages(prev => ({ ...prev, clients: response.data.num_pages }));
          break;
        case 'sites':
          if (!filters.grupo_economico) {
            setTableData(prev => ({ ...prev, sites: [] }));
            setTotalPages(prev => ({ ...prev, sites: 1 }));
            return;
          }
          response = await api.get(`/inventario/sites/?${queryString}`);
          setTableData(prev => ({ ...prev, sites: response.data.results }));
          setTotalPages(prev => ({ ...prev, sites: response.data.num_pages }));
          break;
        case 'equipments':
          if (!filters.grupo_economico) {
            setTableData(prev => ({ ...prev, equipments: [] }));
            setTotalPages(prev => ({ ...prev, equipments: 1 }));
            return;
          }
          response = await api.get(`/inventario/equipamentos/?${queryString}`);
          setTableData(prev => ({ ...prev, equipments: response.data.results }));
          setTotalPages(prev => ({ ...prev, equipments: response.data.num_pages }));
          break;
        case 'services':
          if (!filters.grupo_economico) {
            setTableData(prev => ({ ...prev, services: [] }));
            setTotalPages(prev => ({ ...prev, services: 1 }));
            return;
          }
          response = await api.get(`/inventario/servicos/?${queryString}`);
          setTableData(prev => ({ ...prev, services: response.data.results }));
          setTotalPages(prev => ({ ...prev, services: response.data.num_pages }));
          break;
        case 'links':
          if (!filters.grupo_economico) {
            setTableData(prev => ({ ...prev, links: [] }));
            setTotalPages(prev => ({ ...prev, links: 1 }));
            return;
          }
          response = await api.get(`/inventario/links/?${queryString}`);
          setTableData(prev => ({ ...prev, links: response.data.results }));
          setTotalPages(prev => ({ ...prev, links: response.data.num_pages }));
          break;
        case 'contratos':
          if (!filters.grupo_economico) {
            setTableData(prev => ({ ...prev, contratos: [] }));
            setTotalPages(prev => ({ ...prev, contratos: 1 }));
            return;
          }
          response = await api.get(`/inventario/contratos/?${queryString}`);
          setTableData(prev => ({ ...prev, contratos: response.data.results }));
          setTotalPages(prev => ({ ...prev, contratos: response.data.num_pages }));
          break;
        case 'licencas':
          if (!filters.grupo_economico) {
            setTableData(prev => ({ ...prev, licencas: [] }));
            setTotalPages(prev => ({ ...prev, licencas: 1 }));
            return;
          }
          response = await api.get(`/inventario/licencas/?${queryString}`);
          setTableData(prev => ({ ...prev, licencas: response.data.results }));
          setTotalPages(prev => ({ ...prev, licencas: response.data.num_pages }));
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
    setCurrentPage(1);
    // Mantem apenas o grupo econômico no filtro ao trocar de aba
    if (filters.grupo_economico) {
      setFilters({ grupo_economico: filters.grupo_economico });
    }
  };

  const handleAddSuccess = () => {
    setIsAddOpen(false);
    fetchData(activeTab, currentPage);
  };

  const handleSiteSuccess = (newSite) => {
    setIsAddSiteOpen(false);
    setFilters(prev => ({
      ...prev,
      grupo_economico: newSite.grupo_economico
    }));
    fetchData(activeTab, 1);
  };

  const handleEquipamentoSuccess = (newEquipamento) => {
    setIsAddEquipamentoOpen(false);
    setFilters(prev => ({
      ...prev,
      grupo_economico: newEquipamento.grupo_economico
    }));
    fetchData(activeTab, 1);
  };

  const handleServicoSuccess = (newServico) => {
    setIsAddServicoOpen(false);
    setFilters(prev => ({
      ...prev,
      grupo_economico: newServico.grupo_economico
    }));
    fetchData(activeTab, 1);
  };

  const handleGrupoEconomicoSuccess = (novoGrupoEconomico) => {
    setIsAddGrupoEconomicoOpen(false);
    setFilters({ grupo_economico: novoGrupoEconomico.id });
    fetchData(activeTab, currentPage);
  };

  const handleLinkSuccess = (newLink) => {
    setIsAddLinkOpen(false);
    fetchData(activeTab, currentPage);
  };

  const handleContratoSuccess = (newContrato) => {
    setIsAddContratoOpen(false);
    fetchData(activeTab, currentPage);
  };

  const handleLicencaSuccess = (newLicenca) => {
    setIsAddLicencaOpen(false);
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

            {activeTab === 'sites' && (
              <button 
                className="action-button"
                onClick={() => setIsAddSiteOpen(!isAddSiteOpen)}
              >
                <FaPlus /> Adicionar Site
              </button>
            )}

            {activeTab === 'equipments' && (
              <button 
                className="action-button"
                onClick={() => setIsAddEquipamentoOpen(!isAddEquipamentoOpen)}
              >
                <FaPlus /> Adicionar Equipamento
              </button>
            )}

            {activeTab === 'services' && (
              <button 
                className="action-button"
                onClick={() => setIsAddServicoOpen(!isAddServicoOpen)}
              >
                <FaPlus /> Adicionar Serviço
              </button>
            )}

            {activeTab === 'economic_groups' && (
              <div className="dropdown-wrapper">
                <button 
                  className="action-button"
                  onClick={() => setIsAddGrupoEconomicoOpen(!isAddGrupoEconomicoOpen)}
                >
                  <FaPlus /> Adicionar Grupo Econômico
                </button>
                {isAddGrupoEconomicoOpen && (
                  <AddGrupoEconomicoDropdown
                    isOpen={isAddGrupoEconomicoOpen}
                    onClose={() => setIsAddGrupoEconomicoOpen(false)}
                    onSuccess={handleGrupoEconomicoSuccess}
                  />
                )}
              </div>
            )}

            {activeTab === 'links' && (
              <button 
                className="action-button"
                onClick={() => setIsAddLinkOpen(!isAddLinkOpen)}
              >
                <FaPlus /> Adicionar Link
              </button>
            )}

            {activeTab === 'contratos' && (
              <button 
                className="action-button"
                onClick={() => setIsAddContratoOpen(!isAddContratoOpen)}
              >
                <FaPlus /> Adicionar Contrato
              </button>
            )}

            {activeTab === 'licencas' && (
              <button 
                className="action-button"
                onClick={() => setIsAddLicencaOpen(!isAddLicencaOpen)}
              >
                <FaPlus /> Adicionar Licença
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

            {isAddSiteOpen && activeTab === 'sites' && (
              <AddSiteDropdown
                isOpen={isAddSiteOpen}
                onClose={() => setIsAddSiteOpen(false)}
                onSuccess={handleSiteSuccess}
              />
            )}

            {isAddEquipamentoOpen && activeTab === 'equipments' && (
              <AddEquipamentoDropdown
                isOpen={isAddEquipamentoOpen}
                onClose={() => setIsAddEquipamentoOpen(false)}
                onSuccess={handleEquipamentoSuccess}
              />
            )}

            {isAddServicoOpen && activeTab === 'services' && (
              <AddServicoDropdown
                isOpen={isAddServicoOpen}
                onClose={() => setIsAddServicoOpen(false)}
                onSuccess={handleServicoSuccess}
              />
            )}

            {isAddGrupoEconomicoOpen && activeTab === 'economic_groups' && (
              <AddGrupoEconomicoDropdown
                isOpen={isAddGrupoEconomicoOpen}
                onClose={() => setIsAddGrupoEconomicoOpen(false)}
                onSuccess={handleGrupoEconomicoSuccess}
              />
            )}

            {isAddLinkOpen && (
              <AddLinkDropdown
                isOpen={isAddLinkOpen}
                onClose={() => setIsAddLinkOpen(false)}
                onSuccess={handleLinkSuccess}
              />
            )}

            {isAddContratoOpen && (
              <AddContratoDropdown
                isOpen={isAddContratoOpen}
                onClose={() => setIsAddContratoOpen(false)}
                onSuccess={handleContratoSuccess}
              />
            )}

            {isAddLicencaOpen && (
              <AddLicencaDropdown
                isOpen={isAddLicencaOpen}
                onClose={() => setIsAddLicencaOpen(false)}
                onSuccess={handleLicencaSuccess}
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
