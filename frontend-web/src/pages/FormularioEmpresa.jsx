import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, Card, Divider, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import useEmpresaStore from '../store/useEmpresaStore';

const { Title } = Typography;

const FormularioEmpresa = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const agregarEmpresa = useEmpresaStore((state) => state.agregarEmpresa);
  const crearSocio = useEmpresaStore((state) => state.crearSocio);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { socios, ...empresaData } = values;
      const nuevaEmpresa = await agregarEmpresa(empresaData);
      
      if (socios && socios.length > 0) {
        for (const socio of socios) {
          if (socio && socio.nombre) {
            await crearSocio(nuevaEmpresa.id, socio);
          }
        }
      }

      const setEmpresaSeleccionada = useEmpresaStore.getState().setEmpresaSeleccionada;
      setEmpresaSeleccionada(nuevaEmpresa);
      message.success('Empresa registrada correctamente');
      form.resetFields();
      navigate('/dashboard/informacion');
    } catch (error) {
      message.error('Hubo un error al registrar la empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>Registrar Nueva Empresa</Title>
        <Button onClick={() => navigate('/')}>Cancelar</Button>
      </div>
      
      <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          
          <Divider orientation="left">Perfil de la Empresa</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="nombre" label="Nombre o Razón Social" rules={[{ required: true, message: 'Requerido' }]}>
                <Input placeholder="Ej. Constructora SA de CV" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="rfc" label="RFC" rules={[{ required: true, message: 'Requerido' }]}>
                <Input placeholder="Ej. ABC123456T8" size="large" />
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

          <Divider orientation="left">Socios (Opcional)</Divider>
          <Form.List name="socios">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={16} key={key} align="middle">
                    <Col xs={24} md={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'nombre']}
                        rules={[{ required: true, message: 'Falta el nombre' }]}
                      >
                        <Input placeholder="Nombre Completo" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'rfc']}
                      >
                        <Input placeholder="RFC del Socio" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={4} style={{ marginBottom: '24px' }}>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red', fontSize: '20px' }} />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Agregar Socio
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item style={{ marginTop: '24px', textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" loading={loading}>
              Guardar Empresa
            </Button>
          </Form.Item>
          
        </Form>
      </Card>
    </div>
  );
};

export default FormularioEmpresa;
