import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import DashboardLayout from './components/DashboardLayout';
import SeleccionInicial from './pages/SeleccionInicial';
import FormularioEmpresa from './pages/FormularioEmpresa';
import EditarEmpresa from './pages/EditarEmpresa';
import Informacion from './pages/Informacion';
import GenerarDocumento from './pages/GenerarDocumento';
import BovedaSub1 from './pages/BovedaSub1';
import BovedaSub2 from './pages/BovedaSub2';
import BovedaSub3 from './pages/BovedaSub3';
import BovedaSub4 from './pages/BovedaSub4';

function App() {
  return (
    <ConfigProvider 
      theme={{ 
        token: { 
          colorPrimary: '#F5A623',
          borderRadius: 6,
          fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
          colorTextBase: '#1E293B'
        },
        components: {
          Card: {
            boxShadowTertiary: '0 4px 20px rgba(0,0,0,0.03)'
          }
        }
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas (Sin Sidebar) */}
          <Route path="/" element={<SeleccionInicial />} />
          <Route path="/registrar" element={<FormularioEmpresa />} />
          
          {/* Entorno de Trabajo / Dashboard (Con Sidebar) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="informacion" element={<Informacion />} />
            <Route path="generar" element={<GenerarDocumento />} />
            <Route path="editar" element={<EditarEmpresa />} />
            <Route path="boveda/1" element={<BovedaSub1 />} />
            <Route path="boveda/2" element={<BovedaSub2 />} />
            <Route path="boveda/3" element={<BovedaSub3 />} />
            <Route path="boveda/4" element={<BovedaSub4 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
