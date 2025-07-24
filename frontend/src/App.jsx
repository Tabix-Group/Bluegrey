

import { useState } from 'react';
import { MdPeople, MdContacts, MdInventory2, MdEventNote, MdLocalShipping, MdMessage, MdAdminPanelSettings } from 'react-icons/md';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ClientesPage from './pages/ClientesPage';
import ContactosPage from './pages/ContactosPage';
import ProductosPage from './pages/ProductosPage';
import CronogramasPage from './pages/CronogramasPage';
import EntregasPage from './pages/EntregasPage';
import ModelosMensajePage from './pages/ModelosMensajePage';
import UsuariosPage from './pages/UsuariosPage';


function Footbar({ collapsed, setCollapsed }) {
  const location = useLocation();
  // Colapsar al mouse leave, expandir al mouse enter si está colapsado
  const handleMouseEnter = () => setCollapsed(false);
  const handleMouseLeave = () => setCollapsed(true);
  // Iconos Material Design para cada sección
  const iconStyle = { marginRight: 8, verticalAlign: 'middle', fontSize: '1.3em' };
  const icons = {
    clientes: <MdPeople style={iconStyle} title="Clientes" />,
    contactos: <MdContacts style={iconStyle} title="Contactos" />,
    productos: <MdInventory2 style={iconStyle} title="Productos" />,
    cronogramas: <MdEventNote style={iconStyle} title="Cronogramas" />,
    entregas: <MdLocalShipping style={iconStyle} title="Entregas" />,
    modelos: <MdMessage style={iconStyle} title="Modelos de Mensaje" />,
    usuarios: <MdAdminPanelSettings style={iconStyle} title="Usuarios" />,
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
      <Link to="/clientes" className={location.pathname === '/clientes' ? 'active' : ''}>{icons.clientes}Clientes</Link>
      <Link to="/contactos" className={location.pathname === '/contactos' ? 'active' : ''}>{icons.contactos}Contactos</Link>
      <Link to="/productos" className={location.pathname === '/productos' ? 'active' : ''}>{icons.productos}Productos</Link>
      <Link to="/cronogramas" className={location.pathname === '/cronogramas' ? 'active' : ''}>{icons.cronogramas}Cronogramas</Link>
      <Link to="/entregas" className={location.pathname === '/entregas' ? 'active' : ''}>{icons.entregas}Entregas</Link>
      <Link to="/modelos-mensaje" className={location.pathname === '/modelos-mensaje' ? 'active' : ''}>{icons.modelos}Modelos de Mensaje</Link>
      <Link to="/usuarios" className={location.pathname === '/usuarios' ? 'active' : ''}>{icons.usuarios}Usuarios</Link>
    </div>
  );
}

export default function App() {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <Router>
      <Footbar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main-content">
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
