import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header/Header';
import '../styles/WelcomePage.css';
import { 
  FaUserCog, 
  FaKey, 
  FaWarehouse, 
  FaClipboardCheck, 
  FaExclamationTriangle,
  FaThLarge // Importar o ícone do fluxo
} from 'react-icons/fa';

function WelcomePage() {
  const { userData } = useAuth();

  useEffect(() => {
    document.title = 'Gestão de Inventário | Home';
  }, []);

  const cards = [
    {
      title: 'Perfil',
      description: 'Gerencie suas informações pessoais e configurações da conta',
      active: true,
      icon: <FaUserCog size={32} />,
      subItems: [
        { name: 'Alterar Senha', icon: <FaKey size={16} />, path: '/perfil/senha' }
      ]
    },
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
          <h1>Bem-vindo ao Sistema de Gestão de Inventário{userData?.first_name ? `, ${userData.first_name}` : ''}!</h1>
          <p className="welcome-subtitle">
            Selecione uma das opções abaixo para começar sua jornada:
          </p>
        </header>
        
        <main className="welcome-cards-grid">
          {cards.map((card, index) => (
            <div key={index} className="welcome-card">
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
