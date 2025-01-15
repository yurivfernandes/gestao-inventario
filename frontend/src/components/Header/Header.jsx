import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCog, FaDatabase, FaChartBar, FaCogs, FaCalculator, FaUserEdit, FaCreditCard, FaKey, FaUsers, FaIndustry, FaBars } from 'react-icons/fa';
import logo from '../../assets/logo.svg';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    {
      title: 'Perfil',
      icon: <FaUserCog />,
      submenu: [
        { name: 'Usuário e Senha', icon: <FaKey />, path: '/perfil/senha' }
      ]
    },
    {
      title: 'Inventário',
      icon: <FaDatabase />,
      path: '/inventario/'
    },
    {
      title: 'Gestão de Incidentes',
      icon: <FaChartBar />,
      path: '/incidentes/gestao-incidentes'
    }
  ];

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/welcome" className="logo">
          <img src={logo} alt="Gestão de Inventario" />
        </Link>

        <nav className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <ul className="menu-items">
            {menuItems.map((item, index) => (
              <li key={index} className="menu-item">
                {item.submenu ? (
                  <div className="menu-dropdown">
                    <button className="dropdown-trigger">
                      {item.icon}
                      <span>{item.title}</span>
                    </button>
                    <ul className="dropdown-content">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link to={subItem.path}>
                            {subItem.icon}
                            <span>{subItem.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <button 
          className="menu-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>
      </div>
    </header>
  );
}

export default Header;
