import React, { useState } from 'react';
import { Typography, Card, Button, message, Alert } from 'antd';
import { FileWordOutlined, InfoCircleOutlined } from '@ant-design/icons';
import useEmpresaStore from '../store/useEmpresaStore';
import { descargarMachote } from '../services/api';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const GenerarDocumento = () => {
  const empresaSeleccionada = useEmpresaStore((state) => state.empresaSeleccionada);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDescarga = async () => {
    try {
      setLoading(true);
      await descargarMachote(empresaSeleccionada.id);
      message.success('Documento procesado y descargado exitosamente');
    } catch (error) {
      message.error('Error al generar el documento');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Generador de Documentos</Title>
      <Text type="secondary">Módulo de autocompletado de machotes para licitación</Text>
      
      <Card bordered={false} style={{ marginTop: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
        <p style={{ fontSize: '16px' }}>Empresa objetivo: <Text strong>{empresaSeleccionada.nombre}</Text></p>
        
        <Alert
          message="Información del módulo"
          description="Este módulo inyectará los datos, socios y domicilio de la empresa actual dentro de la plantilla maestra (Word) de forma automática."
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ marginBottom: '24px' }}
        />

        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Button 
            type="primary" 
            size="large" 
            icon={<FileWordOutlined />} 
            onClick={handleDescarga}
            loading={loading}
            style={{ minWidth: '300px', height: '60px', fontSize: '18px' }}
          >
            Procesar Plantilla de Licitación
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GenerarDocumento;
