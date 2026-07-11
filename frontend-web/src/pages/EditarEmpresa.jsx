import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, Card, Divider, message, Table, Modal } from 'antd';
import { SaveOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useEmpresaStore from '../store/useEmpresaStore';

const { Title } = Typography;

const EditarEmpresa = () => {
  const [form] = Form.useForm();
  const [socioForm] = Form.useForm();
  const navigate = useNavigate();
  
  const empresaSeleccionada = useEmpresaStore((state) => state.empresaSeleccionada);
  const setEmpresaSeleccionada = useEmpresaStore((state) => state.setEmpresaSeleccionada);
  const editarEmpresa = useEmpresaStore((state) => state.editarEmpresa);
  const cargarSocios = useEmpresaStore((state) => state.cargarSocios);
  const crearSocio = useEmpresaStore((state) => state.crearSocio);
  const borrarSocio = useEmpresaStore((state) => state.borrarSocio);

  const [loading, setLoading] = useState(false);
  const [socios, setSocios] = useState([]);
  const [loadingSocios, setLoadingSocios] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (empresaSeleccionada) {
      form.setFieldsValue(empresaSeleccionada);
    }
  }, [empresaSeleccionada, form]);

  const loadSocios = async () => {
    if (!empresaSeleccionada) return;
    setLoadingSocios(true);
    try {
      const data = await cargarSocios(empresaSeleccionada.id);
      setSocios(data);
    } catch (error) {
      message.error("No se pudieron cargar los socios");
    } finally {
      setLoadingSocios(false);
    }
  };

  useEffect(() => {
    loadSocios();
  }, [empresaSeleccionada]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const actualizada = await editarEmpresa(empresaSeleccionada.id, values);
      setEmpresaSeleccionada(actualizada);
      message.success('Empresa actualizada correctamente');
      navigate('/dashboard/informacion');
    } catch (error) {
      message.error('Hubo un error al actualizar la empresa');
    } finally {
      setLoading(false);
    }
  };

  const onAddSocio = async (values) => {
    try {
      await crearSocio(empresaSeleccionada.id, values);
      message.success('Socio agregado');
      setIsModalVisible(false);
      socioForm.resetFields();
      loadSocios();
    } catch (error) {
      message.error('Error al agregar socio');
    }
  };

  const handleDeleteSocio = async (socioId) => {
    try {
      await borrarSocio(socioId);
      message.success('Socio eliminado');
      loadSocios();
    } catch (error) {
      message.error('Error al eliminar socio');
    }
  };

  const socioColumns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'RFC', dataIndex: 'rfc', key: 'rfc' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteSocio(record.id)} />
      )
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>Editar Empresa</Title>
        <Button onClick={() => navigate('/dashboard/informacion')}>Cancelar</Button>
      </div>
      
      <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          
          <Divider orientation="left">Perfil de la Empresa</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="nombre" label="Nombre o Razón Social" rules={[{ required: true, message: 'Requerido' }]}>
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="rfc" label="RFC" rules={[{ required: true, message: 'Requerido' }]}>
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Administración y Representación</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="admin_unico" label="Administrador Único">
                <Input placeholder="Nombre Completo" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="rfc_admin_unico" label="RFC Administrador Único">
                <Input placeholder="RFC" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="representante" label="Representante Legal">
                <Input placeholder="Nombre Completo" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="rfc_representante" label="RFC Representante Legal">
                <Input placeholder="RFC" />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">Domicilio Fiscal</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="calle" label="Calle">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="num_ext" label="Num Ext">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="num_int" label="Num Int">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="colonia" label="Colonia">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item name="cp" label="Código Postal">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="municipio" label="Municipio">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="estado" label="Estado">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Contacto</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="email" label="Correo Electrónico">
                <Input type="email" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="telefono" label="Teléfono">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: '24px', textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" loading={loading}>
              Actualizar Empresa
            </Button>
          </Form.Item>
          
        </Form>
      </Card>

      <Card bordered={false} style={{ marginTop: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={4} style={{ margin: 0 }}>Gestión de Socios</Title>
          <Button type="dashed" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Agregar Socio
          </Button>
        </div>
        <Table 
          columns={socioColumns} 
          dataSource={socios} 
          rowKey="id" 
          pagination={false} 
          loading={loadingSocios}
          locale={{ emptyText: 'No hay socios registrados.' }}
        />
      </Card>

      <Modal 
        title="Agregar Nuevo Socio" 
        open={isModalVisible} 
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={socioForm} layout="vertical" onFinish={onAddSocio}>
          <Form.Item name="nombre" label="Nombre Completo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="rfc" label="RFC">
            <Input />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Button type="primary" htmlType="submit">Guardar</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditarEmpresa;
