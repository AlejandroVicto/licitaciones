import React, { useEffect } from 'react';
import { Typography, Card, Row, Col, Divider, Descriptions } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import useEmpresaStore from '../store/useEmpresaStore';

const { Title, Text, Paragraph } = Typography;

const Informacion = () => {
  const empresaSeleccionada = useEmpresaStore((state) => state.empresaSeleccionada);

  return (
    <div style={{ padding: '32px', maxWidth: '1600px', margin: '0 auto' }}>
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
                <Text type="secondary">Administrador Único</Text>
                <Title level={4} style={{ marginTop: '8px' }}>{empresaSeleccionada.admin_unico || 'No registrado'}</Title>
              </Card>
            </Col>
          </Row>
        </div>

      <Divider />
      
      <Title level={4}>Detalles Completos de la Empresa</Title>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Razón Social">{empresaSeleccionada.nombre}</Descriptions.Item>
          <Descriptions.Item label="RFC">{empresaSeleccionada.rfc}</Descriptions.Item>
          
          <Descriptions.Item label="Administrador Único">{empresaSeleccionada.admin_unico || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="RFC Administrador">{empresaSeleccionada.rfc_admin_unico || 'N/A'}</Descriptions.Item>
          
          <Descriptions.Item label="Representante Legal">{empresaSeleccionada.representante || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="RFC Representante">{empresaSeleccionada.rfc_representante || 'N/A'}</Descriptions.Item>
          
          <Descriptions.Item label="Domicilio">
            {empresaSeleccionada.calle ? `${empresaSeleccionada.calle} ${empresaSeleccionada.num_ext || ''} ${empresaSeleccionada.num_int ? `Int. ${empresaSeleccionada.num_int}` : ''}` : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Colonia y CP">
            {empresaSeleccionada.colonia || ''} {empresaSeleccionada.cp ? `(C.P. ${empresaSeleccionada.cp})` : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Municipio y Estado">
            {empresaSeleccionada.municipio || ''}, {empresaSeleccionada.estado || 'N/A'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Correo Electrónico">{empresaSeleccionada.email || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Teléfono">{empresaSeleccionada.telefono || 'N/A'}</Descriptions.Item>
        </Descriptions>
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
