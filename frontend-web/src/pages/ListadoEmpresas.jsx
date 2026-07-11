import React, { useEffect, useState } from 'react';
import { Table, Typography, Button, Card, message, Space } from 'antd';
import { PlusOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useEmpresaStore from '../store/useEmpresaStore';
import { descargarMachote } from '../services/api';

const { Title } = Typography;

const ListadoEmpresas = () => {
  const navigate = useNavigate();
  const empresas = useEmpresaStore((state) => state.empresas);
  const cargarEmpresas = useEmpresaStore((state) => state.cargarEmpresas);
  const [loadingDescarga, setLoadingDescarga] = useState(null);

  useEffect(() => {
    cargarEmpresas();
  }, [cargarEmpresas]);

  const handleDescarga = async (id) => {
    try {
      setLoadingDescarga(id);
      await descargarMachote(id);
      message.success('Documento descargado con éxito');
    } catch (error) {
      message.error('Error al generar el documento');
    } finally {
      setLoadingDescarga(null);
    }
  };

  const columns = [
    {
      title: 'Nombre / Razón Social',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'RFC',
      dataIndex: 'rfc',
      key: 'rfc',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            ghost
            icon={<EditOutlined />} 
            onClick={() => navigate(`/editar/${record.id}`)}
          >
            Editar
          </Button>
          <Button 
            type="default" 
            icon={<DownloadOutlined />} 
            loading={loadingDescarga === record.id}
            onClick={() => handleDescarga(record.id)}
          >
            Descargar Word
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>Directorio de Empresas</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/registrar')} size="large">
          Nueva Empresa
        </Button>
      </div>
      
      <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
        <Table 
          columns={columns} 
          dataSource={empresas} 
          rowKey="id" 
          locale={{ emptyText: 'No hay empresas registradas aún.' }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ListadoEmpresas;
