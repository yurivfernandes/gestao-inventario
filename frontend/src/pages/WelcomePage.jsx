import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header/Header';
import '../styles/WelcomePage.css';
import { 
  FaUserCog, 
  FaWarehouse, 
  FaClipboardCheck, 
  FaExclamationTriangle,
  FaThLarge, // Importar o ícone do fluxo
  FaChartPie // Importar o ícone de relatórios
} from 'react-icons/fa';

function WelcomePage() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Gestão de Inventário | Home';
  }, []);

  const cards = [
    {
      title: 'Inventário',
      description: 'Gerencie clientes, sites, equipamentos e serviços',
      active: true,
      icon: <FaWarehouse size={32} />,
      subItems: [
        { name: 'Acessar Inventário', icon: <FaClipboardCheck size={16} />, path: '/inventario' },
        { name: 'Fluxo de Inventário', icon: <FaThLarge size={16} />, path: '/inventario/flow' } // Adicionar a nova opção
      ]
    },
    {
      title: 'Gestão de Incidentes',
      description: 'Gerencie ocorrências e indisponibilidades',
      active: true,
      icon: <FaExclamationTriangle size={32} />,
      subItems: [
        { name: 'Gerenciar Incidentes', icon: <FaExclamationTriangle size={16} />, path: '/incidentes' }
      ]
    },
    {
      title: 'Relatórios',
      description: 'Acesse relatórios detalhados e estatísticas',
      active: false,
      icon: <FaChartPie size={32} />,
      subItems: []
    }
  ];

  return (
    <>
      <Header />
      <div className="welcome-container">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <header className="welcome-header">
          <h1>Bem-vindo ao Sistema de Gestão de Inventário{user?.first_name ? `, ${user.first_name}` : ''}!</h1>
          <p className="welcome-subtitle">
            Selecione uma das opções abaixo para começar sua jornada:
          </p>
        </header>
        
        <main className="welcome-cards-grid">
          {cards.map((card, index) => (
            <div key={index} className={`welcome-card ${!card.active ? 'disabled' : ''}`}>
              <div className="welcome-card-content">
                <div className="welcome-card-header">
                  <div className="welcome-card-icon">{card.icon}</div>
                  <h2>{card.title}</h2>
                </div>
                <p>{card.description}</p>
                {card.subItems && (
                  <ul className="sub-items">
                    {card.subItems.map((item, i) => (
                      <li key={i}>
                        <Link to={item.path}>
                          <span className="sub-item-icon">{item.icon}</span>
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </main>
      </div>
    </>
  );
}

export default WelcomePage;
