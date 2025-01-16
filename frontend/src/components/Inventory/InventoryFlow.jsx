import React, { useState } from 'react';
import { 
  FaBuilding, FaStore, FaPills, FaUtensils,
  FaNetworkWired, FaWifi, FaServer, FaDesktop,
  FaEye, FaProjectDiagram, FaPhone, FaExchangeAlt,
  FaGlobe, FaLink, FaRegWindowRestore, FaBriefcase,
  FaCogs // Adicionando o ícone que faltava
} from 'react-icons/fa';
import { 
  MdRouter, MdDeviceHub, MdSecurity, 
  MdStorefront, MdBusiness 
} from 'react-icons/md';
import '../../styles/InventoryFlow.css';

const getBusinessIcon = (type) => {
  const icons = {
    'farmacia': FaPills,
    'restaurante': FaUtensils,
    'quiosque': FaStore,
  };
  return icons[type?.toLowerCase()] || MdBusiness;
};

const getEquipmentIcon = (type) => {
  const icons = {
    'sd-wan': FaNetworkWired,
    'sd-lan': FaProjectDiagram,
    'sd-wifi': FaWifi,
    'webex': FaRegWindowRestore,
    'thousandeyes': FaEye
  };
  return icons[type?.toLowerCase()] || FaServer;
};

const getServiceIcon = (type) => {
  const icons = {
    'sd-wan': FaNetworkWired,
    'sd-lan': FaProjectDiagram,
    'sd-wifi': FaWifi,
    'router': MdRouter,
    'switch': MdDeviceHub,
    'firewall': MdSecurity,
    'sbc': FaServer,
    'access point': FaWifi,
    'controller': FaDesktop,
    'pabx ip': FaPhone,
    'media gateway': FaExchangeAlt,
    'ip fixo': FaGlobe,
    'link dedicado': FaLink
  };
  return icons[type?.toLowerCase()] || FaServer;
};

const StatusToggle = ({ checked, onChange }) => (
  <div className="status-toggle">
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      Mostrar inativos
    </label>
  </div>
);

const ItemCard = ({ item, type, selected, onSelect }) => {
  let Icon;
  let content;

  const statusClass = item.status ? 'active' : 'inactive';

  switch (type) {
    case 'client':
      Icon = FaBriefcase;
      content = (
        <>
          <span className={`item-status ${statusClass}`}>
            {item.status ? 'Ativo' : 'Inativo'}
          </span>
          <div className="card-header">
            <div className={`icon-container ${statusClass}`}>
              <Icon size={24} />
            </div>
            <div className="header-content">
              <h4 className={statusClass}>{item.razao_social}</h4>
              <span className="subtitle">Vantive ID: {item.vantive_id}</span>
            </div>
          </div>
          <div className="card-details">
            <span className="detail-label">CNPJ:</span>
            <span className="detail-value">{item.cnpj}</span>
            <span className="detail-label">Código:</span>
            <span className="detail-value">{item.codigo}</span>
          </div>
        </>
      );
      break;

    case 'site':
      Icon = getBusinessIcon(item.tipo_negocio);
      content = (
        <>
          <span className={`item-status ${statusClass}`}>
            {item.status ? 'Ativo' : 'Inativo'}
          </span>
          <div className="card-header">
            <div className={`icon-container ${statusClass}`}>
              <Icon size={24} />
            </div>
            <div className="header-content">
              <h4 className={statusClass}>{item.codigo_vivo}</h4>
              <div className="site-codes">
                <span>{item.tipo_negocio}</span>
              </div>
            </div>
          </div>
          <div className="card-details">
            <span className="detail-label">Tipo Site:</span>
            <span className="detail-value">{item.tipo_site}</span>
            <span className="detail-label">CEP:</span>
            <span className="detail-value">{item.cep}</span>
            <span className="detail-label">Código Sistema:</span>
            <span className="detail-value">{item.codigo_sys_cliente}</span>
          </div>
        </>
      );
      break;

    case 'equipment':
      Icon = getEquipmentIcon(item.tipo);
      content = (
        <>
          <span className={`item-status ${statusClass}`}>
            {item.status ? 'Ativo' : 'Inativo'}
          </span>
          <div className="card-header">
            <div className={`icon-container ${statusClass}`}>
              <Icon size={24} />
            </div>
            <div className="header-content">
              <h4 className={statusClass}>{item.designador}</h4>
            </div>
          </div>
          <div className="card-details">
            <span className="detail-label">Tipo:</span>
            <span className="detail-value">{item.tipo}</span>
            <span className="detail-label">Código:</span>
            <span className="detail-value">{item.codigo}</span>
          </div>
        </>
      );
      break;

    case 'service':
      Icon = getServiceIcon(item.tipo);
      content = (
        <>
          <span className={`item-status ${statusClass}`}>
            {item.status ? 'Ativo' : 'Inativo'}
          </span>
          <div className="card-header">
            <div className={`icon-container ${statusClass}`}>
              <Icon size={24} />
            </div>
            <div className="header-content">
              <h4 className={statusClass}>{item.designador || 'Sem designador'}</h4>
            </div>
          </div>
          <div className="card-details">
            <span className="detail-label">Designador:</span>
            <span className="detail-value">{item.designador || '-'}</span>
            <span className="detail-label">Tipo:</span>
            <span className="detail-value">{item.tipo}</span>
            <span className="detail-label">Código:</span>
            <span className="detail-value">{item.codigo}</span>
          </div>
        </>
      );
      break;

    default:
      Icon = FaBuilding;
      content = <h4>{item.nome || item.codigo}</h4>;
  }

  return (
    <div 
      className={`flow-item ${statusClass} ${selected ? 'selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
    >
      {content}
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="pagination-controls">
    <button 
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage <= 1}
    >
      Anterior
    </button>
    <span>{currentPage} de {totalPages}</span>
    <button 
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage >= totalPages}
    >
      Próximo
    </button>
  </div>
);

const FlowSection = ({ 
  title, 
  data = { results: [], currentPage: 1, numPages: 1 },
  icon: Icon, 
  onSelect, 
  onSearch,
  selected,
  searchTerm,
  type,
  showInactive,
  onToggleInactive,
  onClear,
  onPageChange
}) => (
  <div className="flow-section">
    <div className="flow-header">
      <div className="header-left">
        <h3><Icon size={20} /> {title}</h3>
      </div>
      <div className="header-right">
        <input
          type="text"
          placeholder={`Pesquisar ${title.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="flow-search"
        />
        <StatusToggle checked={showInactive} onChange={onToggleInactive} />
        <button onClick={onClear}>Limpar</button>
      </div>
    </div>
    <div className="flow-items">
      {Array.isArray(data.results) && data.results
        .filter(item => showInactive || item.status)
        .map(item => (
          <ItemCard 
            key={item.id}
            item={item} 
            type={type} 
            selected={selected === item.id}
            onSelect={onSelect}
          />
        ))}
    </div>
    {data.numPages > 1 && (
      <Pagination
        currentPage={data.currentPage}
        totalPages={data.numPages}
        onPageChange={onPageChange}
      />
    )}
  </div>
);

function InventoryFlow({ data, onFetchData }) {
  const [selected, setSelected] = useState({});
  const [searches, setSearches] = useState({});
  const [showInactive, setShowInactive] = useState({
    clients: false,
    sites: false,
    equipments: false,
    services: false
  });

  const handleSelect = async (type, item) => {
    if (!item || !item.id) return;

    try {
      // Primeiro, preparamos o novo estado baseado no tipo selecionado
      let newState;
      switch(type) {
        case 'client':
          newState = { client: item.id };
          break;
        case 'site':
          newState = { 
            ...selected,
            site: item.id,
            equipment: undefined,
            service: undefined 
          };
          break;
        case 'equipment':
          newState = { 
            ...selected,
            equipment: item.id,
            service: undefined 
          };
          break;
        case 'service':
          newState = { ...selected, service: item.id };
          break;
        default:
          newState = selected;
      }

      // Atualizamos o estado
      setSelected(newState);

      // Agora fazemos as chamadas API com o estado atualizado
      switch(type) {
        case 'client':
          await Promise.all([
            onFetchData('sites', item.id, 1),
            onFetchData('equipments', item.id, 1),
            onFetchData('services', item.id, 1)
          ]);
          break;
        
        case 'site':
          await Promise.all([
            onFetchData('equipments', newState.client, 1, { 
              site: item.id 
            }),
            onFetchData('services', newState.client, 1, { 
              site: item.id 
            })
          ]);
          break;
        
        case 'equipment':
          // Aqui está a correção principal
          await onFetchData('services', newState.client, 1, { 
            site: newState.site,
            equipamento: item.id 
          });
          break;
      }
    } catch (error) {
      console.error('Erro ao selecionar item:', error);
    }
  };

  const handleSearch = async (type, term) => {
    setSearches(prev => ({ ...prev, [type]: term }));
    
    try {
      const params = {
        search: term,
        ...(selected.site && { site: selected.site }),
        ...(selected.equipment && { equipamento: selected.equipment })
      };

      switch(type) {
        case 'clients':
          await onFetchData('clients', null, 1, { search: term });
          break;
        case 'sites':
          await onFetchData('sites', selected.client, 1, { search: term });
          break;
        case 'equipments':
          await onFetchData('equipments', selected.client, 1, { 
            ...params,
            site: selected.site 
          });
          break;
        case 'services':
          await onFetchData('services', selected.client, 1, params);
          break;
      }
    } catch (error) {
      console.error('Erro ao realizar busca:', error);
    }
  };

  const handlePageChange = async (type, page) => {
    try {
      const searchTerm = searches[type];
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(selected.site && { site: selected.site }),
        ...(selected.equipment && { equipamento: selected.equipment })
      };

      switch(type) {
        case 'clients':
          await onFetchData('clients', null, page, params);
          break;
        case 'sites':
          await onFetchData('sites', selected.client, page, params);
          break;
        case 'equipments':
          await onFetchData('equipments', selected.client, page, params);
          break;
        case 'services':
          await onFetchData('services', selected.client, page, params);
          break;
      }
    } catch (error) {
      console.error('Erro ao mudar página:', error);
    }
  };

  // Função para limpar seleções específicas
  const clearSelection = (type) => {
    setSelected(prev => {
      switch(type) {
        case 'client':
          return {};
        case 'site':
          // Ao limpar site, recarrega equipamentos e serviços sem filtro de site
          onFetchData('equipments', prev.client, 1);
          onFetchData('services', prev.client, 1);
          return { client: prev.client };
        case 'equipment':
          // Ao limpar equipamento, recarrega serviços com filtro apenas de site
          onFetchData('services', prev.client, 1, { 
            site: prev.site 
          });
          return { 
            client: prev.client, 
            site: prev.site 
          };
        case 'service':
          return { 
            client: prev.client,
            site: prev.site,
            equipment: prev.equipment
          };
        default:
          return prev;
      }
    });
  };

  // Função para filtrar equipamentos por site
  const filterEquipmentsBySite = (equipments, siteId) => {
    if (!siteId) return equipments;
    return equipments.filter(eq => eq.site === siteId);
  };

  // Função para filtrar serviços por equipamento
  const filterServicesByEquipment = (services, equipmentId) => {
    if (!equipmentId) return services;
    return services.filter(srv => srv.equipamento === equipmentId);
  };

  const filterServicesBySiteAndEquipment = (services, siteId, equipmentId) => {
    if (!services) return [];
    
    if (equipmentId) {
      return services.filter(srv => srv.equipamento === equipmentId);
    }
    
    if (siteId) {
      const siteEquipments = data.equipments[selected.client]?.filter(eq => eq.site === siteId) || [];
      const siteEquipmentIds = new Set(siteEquipments.map(eq => eq.id));
      return services.filter(srv => siteEquipmentIds.has(srv.equipamento));
    }
    
    return services;
  };

  const filterItems = (items, searchTerm) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      (item.nome || item.codigo || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="inventory-flow">
      <FlowSection
        title="Clientes"
        data={data.clients}
        icon={FaBuilding}
        onSelect={(item) => handleSelect('client', item)}
        onSearch={(term) => handleSearch('clients', term)}
        selected={selected.client}
        searchTerm={searches.clients}
        type="client"
        showInactive={showInactive.clients}
        onToggleInactive={(checked) => setShowInactive(prev => ({ ...prev, clients: checked }))}
        onClear={() => clearSelection('client')}
        onPageChange={(page) => handlePageChange('clients', page)}
      />

      {selected.client && (
        <FlowSection
          title="Sites"
          data={data.sites[selected.client] || { results: [], currentPage: 1, numPages: 1 }}
          icon={FaServer}
          onSelect={(item) => handleSelect('site', item)}
          onSearch={(term) => handleSearch('sites', term)}
          selected={selected.site}
          searchTerm={searches.sites}
          type="site"
          showInactive={showInactive.sites}
          onToggleInactive={(checked) => setShowInactive(prev => ({ ...prev, sites: checked }))}
          onClear={() => clearSelection('site')}
          onPageChange={(page) => handlePageChange('sites', page)}
        />
      )}

      {selected.client && (
        <FlowSection
          title="Equipamentos"
          data={data.equipments[selected.client] || { results: [], currentPage: 1, numPages: 1 }}
          icon={FaServer} // Alterado de FaCogs para FaServer
          onSelect={(item) => handleSelect('equipment', item)}
          onSearch={(term) => handleSearch('equipments', term)}
          selected={selected.equipment}
          searchTerm={searches.equipments}
          type="equipment"
          showInactive={showInactive.equipments}
          onToggleInactive={(checked) => setShowInactive(prev => ({ ...prev, equipments: checked }))}
          onClear={() => clearSelection('equipment')}
          onPageChange={(page) => handlePageChange('equipments', page)}
        />
      )}

      {selected.client && (
        <FlowSection
          title="Serviços"
          data={data.services[selected.client] || { results: [], currentPage: 1, numPages: 1 }}
          icon={FaCogs}
          onSelect={(item) => handleSelect('service', item)}
          onSearch={(term) => handleSearch('services', term)}
          selected={selected.service}
          searchTerm={searches.services}
          type="service"
          showInactive={showInactive.services}
          onToggleInactive={(checked) => setShowInactive(prev => ({ ...prev, services: checked }))}
          onClear={() => clearSelection('service')}
          onPageChange={(page) => handlePageChange('services', page)}
        />
      )}
    </div>
  );
}

export default InventoryFlow;
