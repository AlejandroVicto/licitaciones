import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Modal, Checkbox, message, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { loginUser, registerUser } from '../services/api';
import useAuthStore from '../store/useAuthStore';

const { Title, Text } = Typography;

const PERMISSION_OPTIONS = [
  { label: 'Generar Documento', value: 'Generar' },
  { label: 'Editar Empresa', value: 'Editar' },
  { label: 'Capturar Nueva Empresa', value: 'Crear_Empresa' },
  { label: 'Bóveda Digital (Permitir Subir Archivos)', value: 'Boveda_Subir' },
];

const Login = () => {
  const login = useAuthStore(state => state.login);
  const [loading, setLoading] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [form] = Form.useForm();
  const [registerForm] = Form.useForm();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await loginUser(values);
      message.success(`Bienvenido ${response.username}`);
      login(response); // Guarda en store
    } catch (error) {
      message.error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setRegistering(true);
    try {
      const response = await registerUser({
        username: values.username,
        password: values.password,
        super_user_password: values.super_user_password,
        permisos: values.permisos || []
      });
      message.success(response.mensaje);
      setRegisterModalVisible(false);
      registerForm.resetFields();
    } catch (error) {
      message.error(error.message || 'Error al registrar usuario');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Card 
        style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px' }}
        bodyStyle={{ padding: '32px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={3} style={{ color: '#F5A623', margin: 0 }}>🏗️ Sistema Licitaciones</Title>
          <Text type="secondary">Inicia sesión para continuar</Text>
        </div>

        <Form
          form={form}
          name="login_form"
          onFinish={handleLogin}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Por favor ingresa tu usuario!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Usuario" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              Ingresar
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Button type="link" onClick={() => setRegisterModalVisible(true)}>
            Crear nuevo usuario (Solo Admin)
          </Button>
        </div>
      </Card>

      <Modal
        title={<span><SafetyCertificateOutlined style={{ color: '#F5A623' }} /> Registro de Nuevo Usuario</span>}
        open={registerModalVisible}
        onCancel={() => { setRegisterModalVisible(false); registerForm.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form
          form={registerForm}
          name="register_form"
          onFinish={handleRegister}
          layout="vertical"
          style={{ marginTop: '24px' }}
        >
          <Form.Item
            label="Nombre de Usuario"
            name="username"
            rules={[{ required: true, message: 'Ingresa un nombre de usuario' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Ingresa una contraseña' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Permisos Asignados (RBAC)"
            name="permisos"
          >
            <Checkbox.Group options={PERMISSION_OPTIONS} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} />
          </Form.Item>

          <Divider />

          <Form.Item
            label="Contraseña de Súper Usuario (Validación de Admin)"
            name="super_user_password"
            rules={[{ required: true, message: 'Requerido para autorizar el registro' }]}
          >
            <Input.Password prefix={<SafetyCertificateOutlined />} placeholder="Clave Maestra" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setRegisterModalVisible(false)}>Cancelar</Button>
              <Button type="primary" htmlType="submit" loading={registering}>
                Crear Usuario
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
