

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ClientesPage from './pages/ClientesPage';
import ContactosPage from './pages/ContactosPage';
import ProductosPage from './pages/ProductosPage';
import CronogramasPage from './pages/CronogramasPage';
import EntregasPage from './pages/EntregasPage';
import ModelosMensajePage from './pages/ModelosMensajePage';
import UsuariosPage from './pages/UsuariosPage';


function Footbar({ collapsed, onToggle }) {
  const location = useLocation();
  return (
    <div className={`footbar${collapsed ? ' collapsed' : ' expanded'}`}>
      <button
        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        onClick={onToggle}
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
      <Link to="/clientes" className={location.pathname === '/clientes' ? 'active' : ''}>Clientes</Link>
      <Link to="/contactos" className={location.pathname === '/contactos' ? 'active' : ''}>Contactos</Link>
      <Link to="/productos" className={location.pathname === '/productos' ? 'active' : ''}>Productos</Link>
      <Link to="/cronogramas" className={location.pathname === '/cronogramas' ? 'active' : ''}>Cronogramas</Link>
      <Link to="/entregas" className={location.pathname === '/entregas' ? 'active' : ''}>Entregas</Link>
      <Link to="/modelos-mensaje" className={location.pathname === '/modelos-mensaje' ? 'active' : ''}>Modelos de Mensaje</Link>
      <Link to="/usuarios" className={location.pathname === '/usuarios' ? 'active' : ''}>Usuarios</Link>
    </div>
  );
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Router>
      <Footbar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
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
