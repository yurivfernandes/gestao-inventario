import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCog, FaDatabase, FaChartBar, FaSignOutAlt, FaKey, FaThLarge, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo_header.svg';
import './../../styles//Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { 
      icon: <FaDatabase />, 
      text: "Inventário",
      submenu: [
        { to: "/inventario", icon: <FaDatabase />, text: "Acessar Inventário" },
        { to: "/inventario/flow", icon: <FaThLarge />, text: "Fluxo de Inventário" }
      ]
    },
    { to: "/incidentes", icon: <FaChartBar />, text: "Gestão de Incidentes" },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="app-header">
      <div className="app-header-content">
        <Link to="/welcome" className="app-logo">
          <img src={logo} alt="Logo" />
        </Link>

        <div className="hamburger" onClick={toggleMenu}>
          <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
        </div>

        <nav className={`app-nav ${menuOpen ? 'active' : ''}`}>
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
            <li className="app-menu-item user-menu">
              <span className="user-name">
                <FaUser />
                <span>{`${user?.first_name || ''} ${user?.last_name || ''}`}</span>
              </span>
              <ul className="user-submenu">
                <li>
                  <Link to="/perfil/senha">
                    <FaKey />
                    <span>Alterar Senha</span>
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="app-logout">
                    <FaSignOutAlt />
                    <span>Sair</span>
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
