import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Select, Space, Layout, Row, Col } from 'antd';
import { PlusOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useEmpresaStore from '../store/useEmpresaStore';

const { Title, Text } = Typography;
const { Content } = Layout;

const SeleccionInicial = () => {
  const navigate = useNavigate();
  const empresas = useEmpresaStore((state) => state.empresas);
  const cargarEmpresas = useEmpresaStore((state) => state.cargarEmpresas);
  const setEmpresaSeleccionada = useEmpresaStore((state) => state.setEmpresaSeleccionada);
  const [empresaId, setEmpresaId] = useState(null);

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
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Content style={{ width: '100%', maxWidth: '800px', padding: '24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={1} style={{ color: '#F5A623', marginBottom: 0 }}>🏗️ Sistema de Licitaciones</Title>
          <Text type="secondary" style={{ fontSize: '18px' }}>Portal de Entrada y Selección de Empresa</Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card 
              title="Trabajar con Empresa Existente" 
              bordered={false} 
              style={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Text>Selecciona la empresa con la que deseas trabajar en el dashboard:</Text>
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Buscar empresa..."
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
                  style={{ width: '100%' }}
                >
                  Entrar al Entorno de Trabajo
                </Button>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card 
              title="Registrar Nueva Empresa" 
              bordered={false} 
              style={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', background: '#fafafa' }}
            >
              <Space direction="vertical" style={{ width: '100%', textAlign: 'center', marginTop: '10px' }} size="large">
                <Text>¿La empresa no existe en el sistema?</Text>
                <Button 
                  type="default" 
                  size="large" 
                  icon={<PlusOutlined />} 
                  onClick={() => navigate('/registrar')}
                  style={{ width: '100%' }}
                >
                  Capturar Nueva Empresa
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

      </Content>
    </Layout>
  );
};

export default SeleccionInicial;
