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

const FlowSection = ({ 
  title, 
  items = [],
  icon: Icon, 
  onSelect, 
  onSearch,
  selected,
  searchTerm,
  type,
  showInactive,
  onToggleInactive,
  onClear
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
      {Array.isArray(items) && items
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
      // Limpa as seleções subsequentes dependendo do tipo
      setSelected(prev => {
        const newSelected = { ...prev };
        
        switch(type) {
          case 'client':
            // Se mudou o cliente, limpa site, equipamento e serviço
            delete newSelected.site;
            delete newSelected.equipment;
            delete newSelected.service;
            break;
          case 'site':
            // Se mudou o site, limpa equipamento e serviço
            delete newSelected.equipment;
            delete newSelected.service;
            break;
          case 'equipment':
            // Se mudou o equipamento, limpa só o serviço
            delete newSelected.service;
            break;
        }

        // Atualiza a seleção atual
        newSelected[type] = item.id;
        return newSelected;
      });

      // Atualiza os dados relacionados
      const fetchMap = {
        client: ['sites', 'equipments', 'services'],
        site: ['equipments', 'services'],
        equipment: ['services']
      };

      const typesToFetch = fetchMap[type] || [];
      for (const nextType of typesToFetch) {
        await onFetchData(nextType, item.id);
      }

    } catch (error) {
      console.error('Erro ao selecionar item:', error);
    }
  };

  // Função para limpar seleções específicas
  const clearSelection = (type) => {
    setSelected(prev => {
      const newSelected = { ...prev };
      switch(type) {
        case 'client':
          return {};
        case 'site':
          delete newSelected.site;
          delete newSelected.equipment;
          delete newSelected.service;
          return newSelected;
        case 'equipment':
          delete newSelected.equipment;
          delete newSelected.service;
          return newSelected;
        case 'service':
          delete newSelected.service;
          return newSelected;
        default:
          return newSelected;
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
        items={filterItems(data.clients, searches.clients)}
        icon={FaBuilding}
        onSelect={(item) => handleSelect('client', item)}
        onSearch={(term) => setSearches(prev => ({ ...prev, clients: term }))}
        selected={selected.client}
        searchTerm={searches.clients}
        type="client"
        showInactive={showInactive.clients}
        onToggleInactive={(checked) => setShowInactive(prev => ({ ...prev, clients: checked }))}
        onClear={() => clearSelection('client')}
      />

      {selected.client && (
        <FlowSection
          title="Sites"
          items={filterItems(data.sites[selected.client] || [], searches.sites)}
          icon={FaServer}
          onSelect={(item) => handleSelect('site', item)}
          onSearch={(term) => setSearches(prev => ({ ...prev, sites: term }))}
          selected={selected.site}
          searchTerm={searches.sites}
          type="site"
          showInactive={showInactive.sites}
          onToggleInactive={(checked) => setShowInactive(prev => ({ ...prev, sites: checked }))}
          onClear={() => clearSelection('site')}
        />
      )}

      {selected.client && (
        <FlowSection
          title="Equipamentos"
          items={filterEquipmentsBySite(
            filterItems(data.equipments[selected.client] || [], searches.equipments),
            selected.site
          )}
          icon={FaServer} // Alterado de FaCogs para FaServer
          onSelect={(item) => handleSelect('equipment', item)}
          onSearch={(term) => setSearches(prev => ({ ...prev, equipments: term }))}
          selected={selected.equipment}
          searchTerm={searches.equipments}
          type="equipment"
          showInactive={showInactive.equipments}
          onToggleInactive={(checked) => setShowInactive(prev => ({ ...prev, equipments: checked }))}
          onClear={() => clearSelection('equipment')}
        />
      )}

      {selected.client && (
        <FlowSection
          title="Serviços"
          items={filterServicesBySiteAndEquipment(
            filterItems(data.services[selected.client] || [], searches.services),
            selected.site,
            selected.equipment
          )}
          icon={FaCogs}
          onSelect={(item) => handleSelect('service', item)}
          onSearch={(term) => setSearches(prev => ({ ...prev, services: term }))}
          selected={selected.service}
          searchTerm={searches.services}
          type="service"
          showInactive={showInactive.services}
          onToggleInactive={(checked) => setShowInactive(prev => ({ ...prev, services: checked }))}
          onClear={() => clearSelection('service')}
        />
      )}
    </div>
  );
}

export default InventoryFlow;
