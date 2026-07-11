import React, { useEffect } from 'react';
import { Typography, Card, Select, Row, Col, Divider, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import useEmpresaStore from '../store/useEmpresaStore';

const { Title, Text, Paragraph } = Typography;

const Informacion = () => {
  const empresaSeleccionada = useEmpresaStore((state) => state.empresaSeleccionada);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>Información Básica</Title>
      </div>
        <div>
          <Title level={3}>Resumen: {empresaSeleccionada.nombre}</Title>
          <Divider />
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ background: '#f5f7fa', textAlign: 'center' }}>
                <Text type="secondary">Razón Social</Text>
                <Title level={4} style={{ marginTop: '8px' }}>{empresaSeleccionada.nombre}</Title>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ background: '#f5f7fa', textAlign: 'center' }}>
                <Text type="secondary">RFC</Text>
                <Title level={4} style={{ marginTop: '8px' }}>{empresaSeleccionada.rfc}</Title>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ background: '#f5f7fa', textAlign: 'center' }}>
                <Text type="secondary">Representante Legal</Text>
                <Title level={4} style={{ marginTop: '8px' }}>{empresaSeleccionada.representante || 'No registrado'}</Title>
              </Card>
            </Col>
          </Row>
        </div>

      <Divider />
      
      <Title level={4}>Flujo de Trabajo Operativo</Title>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>Generar Documentos:</strong> Ve a esta sección para autocompletar machotes en formato Word (.docx) usando los datos fiscales de esta empresa.</li>
          <li><strong>Bóveda Digital:</strong> Utiliza el repositorio en la nube para resguardar las constancias, identificaciones y actas oficiales de la empresa.</li>
          <li><strong>Editar Empresa:</strong> Mantén la información fiscal siempre actualizada para la elaboración de propuestas técnicas y económicas.</li>
        </ol>
      </div>
    </div>
  );
};

export default Informacion;
