import React, { useEffect } from 'react';
import { Layout, message } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import useEmpresaStore from '../store/useEmpresaStore';

const { Content } = Layout;

const DashboardLayout = () => {
  const empresaSeleccionada = useEmpresaStore((state) => state.empresaSeleccionada);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Si intentan acceder al dashboard sin empresa seleccionada, echarlos al inicio.
    if (!empresaSeleccionada) {
      message.warning('Debes seleccionar una empresa primero.');
      navigate('/');
    }
  }, [empresaSeleccionada, navigate, location.pathname]);

  if (!empresaSeleccionada) return null;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ background: '#f5f7fa' }}>
        <Content>
          {/* El contenido de las subrutas del dashboard irá aquí */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
