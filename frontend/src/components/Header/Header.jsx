import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCog, FaDatabase, FaChartBar, FaSignOutAlt, FaKey, FaThLarge, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';
import './../../styles//Header.css';

function Header() {
  const { logout, userData } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { 
      icon: <FaUserCog />, 
      text: "Perfil",
      submenu: [
        { to: "/perfil/senha", icon: <FaKey />, text: "Alterar Senha" }
      ]
    },
    { 
      icon: <FaDatabase />, 
      text: "Inventário",
      submenu: [
        { to: "/inventario", icon: <FaDatabase />, text: "Acessar Inventário" },
        { to: "/inventario/flow", icon: <FaThLarge />, text: "Fluxo de Inventário" } // Adicionar a nova opção
      ]
    },
    { to: "/incidentes", icon: <FaChartBar />, text: "Gestão de Incidentes" },
  ];

  return (
    <header className="app-header">
      <div className="app-header-content">
        <Link to="/welcome" className="app-logo">
          <img src={logo} alt="Logo" />
        </Link>

        <nav className="app-nav">
          <ul className="app-menu">
            {menuItems.map((item, index) => (
              <li key={index} className={item.submenu ? 'app-menu-item has-submenu' : 'app-menu-item'}>
                {item.to ? (
                  <Link to={item.to}>
                    {item.icon}
                    <span>{item.text}</span>
                  </Link>
                ) : (
                  <div className="app-menu-trigger">
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                )}
                {item.submenu && (
                  <ul className="app-submenu">
                    {item.submenu.map((subitem, subindex) => (
                      <li key={subindex}>
                        <Link to={subitem.to}>
                          {subitem.icon}
                          <span>{subitem.text}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="app-menu-divider" />
            <li className="app-menu-item">
              <span className="user-name">
                <FaUser />
                <span>{`${userData?.first_name || ''} ${userData?.last_name || ''}`}</span>
              </span>
              <button onClick={() => logout()} className="app-logout">
                <FaSignOutAlt />
                <span>Sair</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
