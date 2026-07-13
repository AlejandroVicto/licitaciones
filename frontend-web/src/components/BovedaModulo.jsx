import React, { useState, useEffect } from 'react';
import { Typography, Card, Tabs, Select, Button, Upload, message, List, Popconfirm, Alert, Space, Tag } from 'antd';
import { UploadOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import useEmpresaStore from '../store/useEmpresaStore';
import { getDocumentos, subirDocumento, eliminarDocumento, descargarDocumento } from '../services/api';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const BovedaModulo = ({ titulo, documentosPermitidos }) => {
  const empresaSeleccionada = useEmpresaStore((state) => state.empresaSeleccionada);
  const navigate = useNavigate();

  const obtenerDiasVigencia = (docReq) => {
    if (docReq.includes("Constancia_Situacion_Fiscal")) return 30;
    if (docReq.includes("Opinion_Cumplimiento_32D_SAT")) return 30;
    if (docReq.includes("Opinion_Cumplimiento_IMSS")) return 15;
    if (docReq.includes("Comprobante_Domicilio")) return 90;
    return null;
  };

  const calcularEstadoVigencia = (fileItem, docReq) => {
    const diasPermitidos = obtenerDiasVigencia(docReq);
    if (!diasPermitidos) return <Tag color="default">Sin Caducidad</Tag>;

    const fechaSubida = new Date(fileItem.updated_at || fileItem.created_at);
    // Verificar si es una fecha válida
    if (isNaN(fechaSubida)) return <Tag color="default">Sin Fecha</Tag>;

    const hoy = new Date();
    const diffTime = hoy - fechaSubida;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays <= diasPermitidos) {
      return <Tag color="success">Vigente</Tag>;
    } else {
      return <Tag color="error">Desactualizado</Tag>;
    }
  };

  
  const [archivos, setArchivos] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  
  const [tipoSeleccionado, setTipoSeleccionado] = useState(documentosPermitidos[0] || '');
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Prefix del módulo, similar a Streamlit
  const prefixModulo = titulo.split(":")[0].replace("ó", "o").replace(" ", "_");

  const cargarArchivos = async () => {
    if (!empresaSeleccionada) return;
    try {
      setLoadingList(true);
      const data = await getDocumentos(empresaSeleccionada.id);
      setArchivos(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    cargarArchivos();
  }, [empresaSeleccionada]);



  const archivosDelModulo = archivos.filter(a => a.name.startsWith(prefixModulo));

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Selecciona un archivo primero');
      return;
    }
    
    setUploading(true);
    let todosOk = true;
    
    // Cleanup de nombre de documento
    const docClean = tipoSeleccionado.replace(/ /g, "_").replace(/\//g, "_").replace(/-/g, "_");
    
    const isMultiple = tipoSeleccionado.includes("Acta_Constitutiva") || tipoSeleccionado.includes("Declaracion_Anual_Previas");
    
    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const ext = file.name.split('.').pop().toLowerCase();
        
        // Creamos una nueva instancia de archivo con el nombre esperado por el sistema
        const nuevoNombre = (isMultiple && fileList.length > 1) 
            ? `${prefixModulo}_${docClean}_${i+1}.${ext}` 
            : `${prefixModulo}_${docClean}.${ext}`;
            
        const renamedFile = new File([file], nuevoNombre, { type: file.type });
        await subirDocumento(empresaSeleccionada.id, renamedFile);
      }
    } catch (error) {
      todosOk = false;
      message.error('Hubo un error al subir los archivos');
    } finally {
      setUploading(false);
      if (todosOk) {
        message.success('Documento(s) subidos correctamente');
        setFileList([]);
        cargarArchivos();
      }
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      setFileList(prev => prev.filter(item => item.uid !== file.uid));
    },
    beforeUpload: (file) => {
      setFileList(prev => [...prev, file]);
      return false; // Prevent auto upload
    },
    fileList,
    multiple: tipoSeleccionado.includes("Acta_Constitutiva") || tipoSeleccionado.includes("Declaracion_Anual_Previas"),
  };

  const handleDelete = async (fileName) => {
    try {
      await eliminarDocumento(empresaSeleccionada.id, fileName);
      message.success('Archivo eliminado');
      cargarArchivos();
    } catch (error) {
      message.error('Error al eliminar archivo');
    }
  };

  const handleDownload = async (fileName) => {
    try {
      await descargarDocumento(empresaSeleccionada.id, fileName);
    } catch (error) {
      message.error('Error al descargar');
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1600px', margin: '0 auto' }}>
      <Title level={2}>🗄️ Bóveda Digital</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>Repositorio seguro estructurado para documentación de licitaciones.</Text>
      
      <p style={{ fontSize: '16px' }}>Gestionando documentos para: <Text strong>{empresaSeleccionada.nombre}</Text></p>
      
      <Card title={titulo} bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Tabs defaultActiveKey="1">
          
          <Tabs.TabPane tab="Subir Documentos" key="1">
            <div style={{ padding: '16px 0' }}>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Selecciona el documento específico a subir:</Text>
                <Select 
                  style={{ width: '100%', marginTop: '8px' }} 
                  value={tipoSeleccionado} 
                  onChange={setTipoSeleccionado}
                >
                  {documentosPermitidos.map(doc => {
                    const label = doc.replace(/_/g, ' ').replace(/Anios/g, 'Años');
                    return <Option key={doc} value={doc}>{label}</Option>;
                  })}
                </Select>
              </div>

              <div style={{ marginTop: '24px' }}>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Seleccionar archivo(s)</Button>
                </Upload>
                <Button
                  type="primary"
                  onClick={handleUpload}
                  disabled={fileList.length === 0}
                  loading={uploading}
                  style={{ marginTop: 16, display: 'block' }}
                >
                  {uploading ? 'Subiendo...' : 'Subir Documento'}
                </Button>
              </div>
            </div>
          </Tabs.TabPane>
          
          <Tabs.TabPane tab="Explorar y Descargar" key="2">
            <List
              loading={loadingList}
              dataSource={documentosPermitidos}
              renderItem={(docReq) => {
                const docClean = docReq.replace(/ /g, "_").replace(/\//g, "_").replace(/-/g, "_");
                const uploadedFiles = archivosDelModulo.filter(f => f.name.includes(docClean));
                const isUploaded = uploadedFiles.length > 0;

                return (
                  <List.Item
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                  >
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ fontSize: '16px' }}>{docReq.replace(/_/g, ' ').replace(/Anios/g, 'Años')}</Text>
                      {!isUploaded && <Text type="danger">Falta documento</Text>}
                    </div>
                    
                    {isUploaded ? (
                      <List
                        size="small"
                        style={{ width: '100%', marginTop: '8px', background: '#f8fafc', borderRadius: '6px' }}
                        dataSource={uploadedFiles}
                        renderItem={fileItem => (
                          <List.Item
                            actions={[
                              <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => handleDownload(fileItem.name)}>Descargar</Button>,
                              <Popconfirm title="¿Eliminar archivo?" onConfirm={() => handleDelete(fileItem.name)}>
                                <Button type="link" danger size="small" icon={<DeleteOutlined />}>Eliminar</Button>
                              </Popconfirm>
                            ]}
                          >
                            <Space>
                              <Text type="secondary">{fileItem.name}</Text>
                              {calcularEstadoVigencia(fileItem, docReq)}
                            </Space>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <Text type="secondary" style={{ marginTop: '8px', fontStyle: 'italic' }}>
                        No hay archivo subido para este requisito.
                      </Text>
                    )}
                  </List.Item>
                );
              }}
            />
          </Tabs.TabPane>
          
        </Tabs>
      </Card>
    </div>
  );
};

export default BovedaModulo;
