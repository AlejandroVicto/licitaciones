import React, { useState, useEffect } from 'react';
import { Table, Typography, Card, Button, Space, Tag, Modal, Checkbox, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { getUsuarios, updatePermisosUsuario, deleteUsuario } from '../services/api';

const { Title, Text } = Typography;

const PERMISSION_OPTIONS = [
  { label: 'Generar Documento', value: 'Generar' },
  { label: 'Editar Empresa', value: 'Editar' },
  { label: 'Capturar Nueva Empresa', value: 'Crear_Empresa' },
  { label: 'Bóveda Digital (Permitir Subir Archivos)', value: 'Boveda_Subir' },
];

const ControlUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [superKey, setSuperKey] = useState('');
  
  // Para eliminar
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteSuperKey, setDeleteSuperKey] = useState('');

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await getUsuarios();
      setUsuarios(data || []);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setSelectedPermisos(user.permisos || []);
    setSuperKey('');
    setIsEditModalVisible(true);
  };

  const handleSavePermisos = async () => {
    if (!superKey) {
      message.warning('Debes ingresar la llave maestra');
      return;
    }
    try {
      await updatePermisosUsuario(editingUser.id, {
        permisos: selectedPermisos,
        super_user_password: superKey
      });
      message.success('Permisos actualizados correctamente');
      setIsEditModalVisible(false);
      fetchUsuarios();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteSuperKey('');
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!deleteSuperKey) {
      message.warning('Debes ingresar la llave maestra');
      return;
    }
    try {
      await deleteUsuario(userToDelete.id, deleteSuperKey);
      message.success('Usuario eliminado correctamente');
      setIsDeleteModalVisible(false);
      fetchUsuarios();
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nombre de Usuario',
      dataIndex: 'username',
      key: 'username',
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Permisos',
      dataIndex: 'permisos',
      key: 'permisos',
      render: (permisos) => (
        <>
          {permisos && permisos.length > 0 ? (
            permisos.map(p => {
              let color = 'blue';
              if (p === 'Generar') color = 'green';
              if (p === 'Editar') color = 'orange';
              if (p === 'Crear_Empresa') color = 'purple';
              if (p === 'Boveda_Subir') color = 'geekblue';
              return (
                <Tag color={color} key={p} style={{ marginBottom: 4 }}>
                  {p}
                </Tag>
              );
            })
          ) : (
            <Text type="secondary">Solo lectura básica</Text>
          )}
        </>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            ghost 
            icon={<EditOutlined />} 
            onClick={() => handleEditClick(record)}
          >
            Editar Permisos
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteClick(record)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>👥 Control de Usuarios</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
        Administra los accesos y permisos de todos los usuarios registrados en el sistema.
      </Text>

      <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
        <Table 
          columns={columns} 
          dataSource={usuarios} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Modal Editar Permisos */}
      <Modal
        title={`Editar permisos de: ${editingUser?.username}`}
        open={isEditModalVisible}
        onOk={handleSavePermisos}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Guardar Cambios"
        cancelText="Cancelar"
      >
        <div style={{ margin: '20px 0' }}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Selecciona las opciones a las que puede acceder:</Text>
          <Checkbox.Group 
            options={PERMISSION_OPTIONS} 
            value={selectedPermisos} 
            onChange={(checkedValues) => setSelectedPermisos(checkedValues)}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}
          />
          
          <Text strong style={{ display: 'block', marginBottom: 8, color: '#f5222d' }}>Llave Maestra Requerida:</Text>
          <Input.Password 
            placeholder="Super User Key" 
            value={superKey}
            onChange={e => setSuperKey(e.target.value)}
          />
        </div>
      </Modal>

      {/* Modal Eliminar Usuario */}
      <Modal
        title="Eliminar Usuario"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Eliminar Definitivamente"
        okButtonProps={{ danger: true }}
        cancelText="Cancelar"
      >
        <div style={{ margin: '20px 0' }}>
          <Text style={{ display: 'block', marginBottom: 16 }}>
            ¿Estás seguro de que deseas eliminar permanentemente al usuario <Text strong>{userToDelete?.username}</Text>? 
            Esta acción no se puede deshacer.
          </Text>
          
          <Text strong style={{ display: 'block', marginBottom: 8, color: '#f5222d' }}>Ingresa la Llave Maestra para confirmar:</Text>
          <Input.Password 
            placeholder="Super User Key" 
            value={deleteSuperKey}
            onChange={e => setDeleteSuperKey(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ControlUsuarios;
