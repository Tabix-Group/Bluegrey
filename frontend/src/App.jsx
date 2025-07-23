
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ClientesPage from './pages/ClientesPage';
import ContactosPage from './pages/ContactosPage';
import ProductosPage from './pages/ProductosPage';
import CronogramasPage from './pages/CronogramasPage';
import EntregasPage from './pages/EntregasPage';
import ModelosMensajePage from './pages/ModelosMensajePage';

export default function App() {
  return (
    <Router>
      <nav style={{ margin: 10 }}>
        <Link to="/clientes">Clientes</Link> |{' '}
        <Link to="/contactos">Contactos</Link> |{' '}
        <Link to="/productos">Productos</Link> |{' '}
        <Link to="/cronogramas">Cronogramas</Link> |{' '}
        <Link to="/entregas">Entregas</Link> |{' '}
        <Link to="/modelos-mensaje">Modelos de Mensaje</Link>
      </nav>
      <Routes>
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/contactos" element={<ContactosPage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/cronogramas" element={<CronogramasPage />} />
        <Route path="/entregas" element={<EntregasPage />} />
        <Route path="/modelos-mensaje" element={<ModelosMensajePage />} />
        <Route path="*" element={<ClientesPage />} />
      </Routes>
    </Router>
  );
}
