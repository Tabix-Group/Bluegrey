

import { useState } from 'react';
import Button from '@mui/material/Button';
import { MdPeople, MdContacts, MdInventory2, MdEventNote, MdLocalShipping, MdMessage, MdAdminPanelSettings } from 'react-icons/md';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import ClientesPage from './pages/ClientesPage';
import ContactosPage from './pages/ContactosPage';
import ProductosPage from './pages/ProductosPage';
import CronogramasPage from './pages/CronogramasPage';
import EntregasPage from './pages/EntregasPage';
import ModelosMensajePage from './pages/ModelosMensajePage';
import UsuariosPage from './pages/UsuariosPage';
import LoginPage from './pages/LoginPage';


import { useRef } from 'react';
function Footbar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const timerRef = useRef(null);
  // Iconos Material Design para cada sección
  // Paleta de colores sutiles y profesionales para los iconos
  const iconStyle = {
    marginRight: 8,
    verticalAlign: 'middle',
    fontSize: '1.3em',
    transition: 'color 0.18s',
  };
  const iconColors = {
    clientes: '#3b82f6',      // azul
    contactos: '#06b6d4',     // celeste
    productos: '#f59e42',     // naranja
    cronogramas: '#a855f7',   // violeta
    entregas: '#10b981',      // verde
    modelos: '#f43f5e',       // rojo coral
    usuarios: '#64748b',      // gris profesional
  };
  // Mejoras: sombra, transición, opacidad colapsado, escala hover, alineación flex
  function MenuIcon({ Icon, color, collapsed }) {
    return (
      <span
        className={`menu-icon${collapsed ? ' collapsed' : ''}`}
        style={{
          ...iconStyle,
          color,
          filter: collapsed ? 'grayscale(0.5) opacity(0.5)' : 'none',
          boxShadow: collapsed ? 'none' : '0 2px 8px rgba(60,60,90,0.10)',
        }}
      >
        <Icon />
      </span>
    );
  }
  const icons = {
    clientes: (collapsed) => <MenuIcon Icon={MdPeople} color={iconColors.clientes} collapsed={collapsed} />,
    contactos: (collapsed) => <MenuIcon Icon={MdContacts} color={iconColors.contactos} collapsed={collapsed} />,
    productos: (collapsed) => <MenuIcon Icon={MdInventory2} color={iconColors.productos} collapsed={collapsed} />,
    cronogramas: (collapsed) => <MenuIcon Icon={MdEventNote} color={iconColors.cronogramas} collapsed={collapsed} />,
    entregas: (collapsed) => <MenuIcon Icon={MdLocalShipping} color={iconColors.entregas} collapsed={collapsed} />,
    modelos: (collapsed) => <MenuIcon Icon={MdMessage} color={iconColors.modelos} collapsed={collapsed} />,
    usuarios: (collapsed) => <MenuIcon Icon={MdAdminPanelSettings} color={iconColors.usuarios} collapsed={collapsed} />,
  };

  // Al entrar, expandir y limpiar timer
  const handleMouseEnter = () => {
    setCollapsed(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  // Al salir, iniciar timer de 10s. Si vuelve a entrar, se reinicia el timer.
  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCollapsed(true);
      timerRef.current = null;
    }, 10000);
  };

  return (
    <div
      className={`footbar${collapsed ? ' collapsed' : ' expanded'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        onClick={() => setCollapsed((c) => !c)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-primary)',
          fontSize: '1.5em',
          cursor: 'pointer',
          marginRight: collapsed ? 0 : 12,
          marginLeft: 4,
          transition: 'color 0.18s',
        }}
        tabIndex={0}
      >
        {collapsed ? '☰' : '✕'}
      </button>
      <Link to="/clientes" className={location.pathname === '/clientes' ? 'active' : ''} style={{display:'flex',alignItems:'center',gap:8}}>
        {icons.clientes(collapsed)}Clientes
      </Link>
      <Link to="/contactos" className={location.pathname === '/contactos' ? 'active' : ''} style={{display:'flex',alignItems:'center',gap:8}}>
        {icons.contactos(collapsed)}Contactos
      </Link>
      <Link to="/productos" className={location.pathname === '/productos' ? 'active' : ''} style={{display:'flex',alignItems:'center',gap:8}}>
        {icons.productos(collapsed)}Productos
      </Link>
      <Link to="/cronogramas" className={location.pathname === '/cronogramas' ? 'active' : ''} style={{display:'flex',alignItems:'center',gap:8}}>
        {icons.cronogramas(collapsed)}Cronogramas
      </Link>
      <Link to="/entregas" className={location.pathname === '/entregas' ? 'active' : ''} style={{display:'flex',alignItems:'center',gap:8}}>
        {icons.entregas(collapsed)}Entregas
      </Link>
      <Link to="/modelos-mensaje" className={location.pathname === '/modelos-mensaje' ? 'active' : ''} style={{display:'flex',alignItems:'center',gap:8}}>
        {icons.modelos(collapsed)}Modelos de Mensaje
      </Link>
      <Link to="/usuarios" className={location.pathname === '/usuarios' ? 'active' : ''} style={{display:'flex',alignItems:'center',gap:8}}>
        {icons.usuarios(collapsed)}Usuarios
      </Link>
    </div>
  );
}

export default function App() {
  const [collapsed, setCollapsed] = useState(true);
  const [isLogged, setIsLogged] = useState(() => {
    // Persistencia simple en localStorage
    return localStorage.getItem('isLogged') === 'true';
  });

  const handleLogin = () => {
    setIsLogged(true);
    localStorage.setItem('isLogged', 'true');
  };
  const handleLogout = () => {
    setIsLogged(false);
    localStorage.removeItem('isLogged');
  };

  if (!isLogged) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      {/* Logo fijo arriba a la derecha */}
      <img 
        src="/images/logo-text.png"
        alt="Logo"
        style={{
          position: 'fixed',
          top: 18,
          right: 32,
          height: 44,
          zIndex: 200,
          objectFit: 'contain',
          background: 'rgba(255,255,255,0.85)',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          padding: '4px 16px',
        }}
        draggable={false}
      />
      <Footbar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main-content">
        <Button
          onClick={handleLogout}
          variant="outlined"
          size="small"
          sx={{
            position: 'fixed',
            top: 24,
            left: 32,
            zIndex: 201,
            borderRadius: 2,
            fontWeight: 500,
            fontSize: '0.98em',
            color: '#64748b',
            borderColor: '#cbd5e1',
            background: 'rgba(255,255,255,0.85)',
            px: 1.8,
            py: 0.5,
            minWidth: 0,
            boxShadow: 'none',
            textTransform: 'none',
            transition: 'all 0.18s',
            '&:hover': {
              background: '#f1f5f9',
              borderColor: '#94a3b8',
              color: '#334155',
              boxShadow: '0 2px 8px rgba(100,116,139,0.08)',
            },
          }}
        >Cerrar sesión</Button>
        <Routes>
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/contactos" element={<ContactosPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/cronogramas" element={<CronogramasPage />} />
          <Route path="/entregas" element={<EntregasPage />} />
          <Route path="/modelos-mensaje" element={<ModelosMensajePage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="*" element={<ClientesPage />} />
        </Routes>
      </div>
    </Router>
  );
}
