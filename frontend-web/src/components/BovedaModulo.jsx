import React, { useState, useEffect } from 'react';
import { Typography, Card, Tabs, Select, Button, Upload, message, List, Popconfirm, Alert, Space, Tag, Input } from 'antd';
import { UploadOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import useEmpresaStore from '../store/useEmpresaStore';
import { getDocumentos, subirDocumento, eliminarDocumento, descargarDocumento } from '../services/api';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const { Title, Text } = Typography;
const { Option } = Select;

const BovedaModulo = ({ titulo, documentosPermitidos }) => {
  const empresaSeleccionada = useEmpresaStore((state) => state.empresaSeleccionada);
  const { usuarioActivo } = useAuthStore();
  const permisos = usuarioActivo?.permisos || [];
  const canUpload = permisos.includes('Boveda_Subir');
  const navigate = useNavigate();

  const obtenerDiasVigencia = (docReq) => {
    const docLower = docReq.toLowerCase();
    if (docLower.includes("constancia_situacion_fiscal")) return 30;
    if (docLower.includes("opinion_cumplimiento_32d_sat")) return 30;
    if (docLower.includes("opinion_cumplimiento_imss")) return 15;
    if (docLower.includes("comprobante_domicilio")) return 90;
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
  const [customNames, setCustomNames] = useState({});

  // Eliminado prefixModulo porque guardaremos los archivos solo con su nombre (ej. INE_Representante_Legal.pdf)

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



  const archivosDelModulo = archivos.filter(a => {
    return documentosPermitidos.some(doc => {
      const docClean = doc.replace(/ /g, "_").replace(/\//g, "_").replace(/-/g, "_");
      return a.name.includes(docClean);
    });
  });

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
        
        // Creamos una nueva instancia de archivo con el nombre esperado por el sistema (sin prefijo de módulo)
        let customSuffix = '';
        if (isMultiple) {
          const userSuffix = customNames[file.uid];
          // Si el usuario escribió un sufijo, lo usamos limpiándolo un poco. Si no, usamos un secuencial.
          customSuffix = userSuffix ? `_${userSuffix.replace(/ /g, "_")}` : `_${i+1}`;
        }

        const nuevoNombre = isMultiple
            ? `${docClean}${customSuffix}.${ext}` 
            : `${docClean}.${ext}`;
            
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
        setCustomNames({});
        cargarArchivos();
      }
    }
  };

  const isMultiple = tipoSeleccionado.includes("Acta_Constitutiva") || 
                     tipoSeleccionado.includes("Declaracion_Anual_Previas") ||
                     tipoSeleccionado.includes("Declaraciones_Provisionales") ||
                     tipoSeleccionado.includes("Estados_Financieros");

  const uploadProps = {
    onRemove: (file) => {
      setFileList(prev => prev.filter(item => item.uid !== file.uid));
      setCustomNames(prev => {
        const copy = { ...prev };
        delete copy[file.uid];
        return copy;
      });
    },
    beforeUpload: (file) => {
      setFileList(prev => [...prev, file]);
      return false; // Prevent auto upload
    },
    fileList,
    multiple: isMultiple,
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
        <Tabs defaultActiveKey={canUpload ? "1" : "2"}>
          
          {canUpload && (
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

                {(() => {
                  const docClean = tipoSeleccionado.replace(/ /g, "_").replace(/\//g, "_").replace(/-/g, "_");
                  const uploadedFilesForSelected = archivosDelModulo.filter(f => f.name.includes(docClean));
                  
                  return uploadedFilesForSelected.length > 0 ? (
                    <div style={{ marginBottom: '24px', padding: '16px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px' }}>
                      <Text strong style={{ color: '#d48806', display: 'block', marginBottom: '8px' }}>Ya existen documentos subidos para este requisito:</Text>
                      <List
                        size="small"
                        style={{ background: '#fff', borderRadius: '6px' }}
                        dataSource={uploadedFilesForSelected}
                        renderItem={fileItem => (
                          <List.Item
                            actions={[
                              <Popconfirm title="¿Eliminar archivo?" onConfirm={() => handleDelete(fileItem.name)}>
                                <Button type="text" danger size="small" icon={<DeleteOutlined />}>Eliminar</Button>
                              </Popconfirm>
                            ]}
                          >
                            <Space>
                              <Text type="secondary">{fileItem.name}</Text>
                              {calcularEstadoVigencia(fileItem, tipoSeleccionado)}
                            </Space>
                          </List.Item>
                        )}
                      />
                    </div>
                  ) : null;
                })()}

                <div style={{ marginTop: '24px' }}>
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>Seleccionar archivo(s)</Button>
                  </Upload>
                  
                  {/* Opciones para nombramiento personalizado si es múltiple */}
                  {isMultiple && fileList.length > 0 && (
                    <div style={{ marginTop: '16px', padding: '16px', background: '#fafafa', border: '1px dashed #d9d9d9', borderRadius: '8px' }}>
                      <Text strong style={{ display: 'block', marginBottom: '12px' }}>
                        Asigna un nombre o identificador a cada archivo (ej. modificacion_2010):
                      </Text>
                      {fileList.map((file, index) => (
                        <div key={file.uid} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <Text type="secondary" style={{ width: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {file.name}
                          </Text>
                          <Input 
                            placeholder={`Identificador (Opcional)`} 
                            value={customNames[file.uid] || ''}
                            onChange={(e) => setCustomNames({ ...customNames, [file.uid]: e.target.value })}
                            style={{ marginLeft: '12px', flex: 1 }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

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
          )}
          
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
                              <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => handleDownload(fileItem.name)}>Descargar</Button>
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
