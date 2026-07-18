import React, { useEffect } from 'react';
import { Layout, message, Button, Typography, Space, Avatar } from 'antd';
import { LogoutOutlined, BankOutlined, UserOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import useEmpresaStore from '../store/useEmpresaStore';
import useAuthStore from '../store/useAuthStore';

const { Content, Header } = Layout;
const { Text } = Typography;

const DashboardLayout = () => {
  const empresaSeleccionada = useEmpresaStore((state) => state.empresaSeleccionada);
  const usuarioActivo = useAuthStore((state) => state.usuarioActivo);
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
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <Sidebar />
      <Layout style={{ background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
          zIndex: 1
        }}>
          <Space size="middle" align="center">
            <Avatar shape="square" icon={<BankOutlined />} style={{ backgroundColor: '#1E293B' }} />
            <Text strong style={{ fontSize: '18px', color: '#1E293B' }}>
              {empresaSeleccionada.nombre}
            </Text>
            <Text type="secondary">({empresaSeleccionada.rfc})</Text>
          </Space>
          
          <Space size="middle" align="center">
            <Space style={{ background: '#f1f5f9', padding: '4px 16px', borderRadius: '20px' }}>
              <UserOutlined style={{ color: '#64748b' }} />
              <Text style={{ color: '#475569', fontWeight: 'bold' }}>{usuarioActivo?.username || 'Usuario'}</Text>
            </Space>
            <Button 
              type="text" 
              danger 
              icon={<LogoutOutlined />} 
              onClick={() => navigate('/')}
            >
              Cambiar Empresa
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: '24px', overflow: 'initial' }}>
          <div style={{ padding: 0, minHeight: 360, width: '100%' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
