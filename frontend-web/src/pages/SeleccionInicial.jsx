import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Select, Space, Layout, Row, Col, Divider } from 'antd';
import { PlusOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useEmpresaStore from '../store/useEmpresaStore';
import useAuthStore from '../store/useAuthStore';

const { Title, Text } = Typography;
const { Content } = Layout;

const SeleccionInicial = () => {
  const navigate = useNavigate();
  const empresas = useEmpresaStore((state) => state.empresas);
  const cargarEmpresas = useEmpresaStore((state) => state.cargarEmpresas);
  const setEmpresaSeleccionada = useEmpresaStore((state) => state.setEmpresaSeleccionada);
  const [empresaId, setEmpresaId] = useState(null);
  const usuarioActivo = useAuthStore((state) => state.usuarioActivo);
  const permisos = usuarioActivo?.permisos || [];
  const canCreate = permisos.includes('Crear_Empresa');

  useEffect(() => {
    // Limpiamos la empresa activa por si regresó del dashboard
    setEmpresaSeleccionada(null);
    cargarEmpresas();
  }, [cargarEmpresas, setEmpresaSeleccionada]);

  const handleEntrar = () => {
    if (empresaId) {
      const empresa = empresas.find((e) => e.id === empresaId);
      setEmpresaSeleccionada(empresa);
      navigate('/dashboard/informacion');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Content style={{ width: '100%', maxWidth: '900px', padding: '24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Title level={1} style={{ color: '#F5A623', marginBottom: 8, letterSpacing: '-0.5px' }}>Licitaciones Profesionales</Title>
          <Text style={{ fontSize: '18px' }} type="secondary">Portal de Gestión Administrativa para Constructoras</Text>
        </div>

        <Row gutter={[32, 32]} justify={canCreate ? 'start' : 'center'}>
          <Col xs={24} md={canCreate ? 12 : 16}>
            <Card 
              bordered={false} 
              style={{ 
                height: '100%', 
                background: '#ffffff', 
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{ padding: '16px 8px' }}>
                <Title level={3} style={{ marginBottom: '8px' }}>Entorno de Trabajo</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>Selecciona una empresa registrada para acceder a su bóveda y documentos.</Text>
                
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Buscar empresa por nombre o RFC..."
                    optionFilterProp="children"
                    onChange={(val) => setEmpresaId(val)}
                    value={empresaId}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={empresas.map(e => ({ value: e.id, label: e.nombre }))}
                    size="large"
                  />
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<LoginOutlined />} 
                    onClick={handleEntrar}
                    disabled={!empresaId}
                    style={{ width: '100%', height: '48px', fontSize: '16px', fontWeight: 'bold' }}
                  >
                    Ingresar al Dashboard
                  </Button>
                </Space>
              </div>
            </Card>
          </Col>
          
          {canCreate && (
            <Col xs={24} md={12}>
              <Card 
                bordered={false} 
                style={{ 
                  height: '100%', 
                  background: '#ffffff', 
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ padding: '16px 8px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                  <div>
                    <Title level={3} style={{ marginBottom: '8px' }}>Nueva Empresa</Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>Da de alta una nueva razón social en el sistema para comenzar a gestionar sus licitaciones.</Text>
                  </div>
                  
                  <Button 
                    type="default" 
                    size="large" 
                    icon={<PlusOutlined />} 
                    onClick={() => navigate('/registrar')}
                    style={{ 
                      width: '100%', 
                      height: '48px', 
                      fontSize: '16px', 
                      fontWeight: 'bold',
                      background: 'transparent',
                      borderColor: '#F5A623',
                      color: '#F5A623'
                    }}
                  >
                    Capturar Nueva Empresa
                  </Button>
                </div>
              </Card>
            </Col>
          )}
        </Row>

      </Content>
    </Layout>
  );
};

export default SeleccionInicial;
