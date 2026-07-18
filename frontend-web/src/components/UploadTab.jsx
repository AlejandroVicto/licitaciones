import React, { useState } from 'react';
import { Select, Button, Upload, List, Popconfirm, Space, Typography, Input } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { calcularEstadoVigencia } from '../utils/vigenciaUtils';

const { Text } = Typography;
const { Option } = Select;

const UploadTab = ({ 
  documentosPermitidos, 
  tipoSeleccionado, 
  setTipoSeleccionado, 
  archivos, 
  uploadFiles, 
  uploading,
  deleteFile
}) => {
  const [fileList, setFileList] = useState([]);
  const [customNames, setCustomNames] = useState({});

  const docClean = tipoSeleccionado.replace(/ /g, "_").replace(/\//g, "_").replace(/-/g, "_");
  const isMultiple = tipoSeleccionado.includes("Acta_Constitutiva") || 
                     tipoSeleccionado.includes("Declaracion_Anual_Previas") ||
                     tipoSeleccionado.includes("Declaraciones_Provisionales") ||
                     tipoSeleccionado.includes("Estados_Financieros");

  const uploadedFilesForSelected = archivos.filter(f => f.name.includes(docClean));

  const handleUploadClick = async () => {
    const success = await uploadFiles(fileList, customNames, docClean, isMultiple);
    if (success) {
      setFileList([]);
      setCustomNames({});
    }
  };

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

  return (
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

      {uploadedFilesForSelected.length > 0 && (
        <div style={{ marginBottom: '24px', padding: '16px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px' }}>
          <Text strong style={{ color: '#d48806', display: 'block', marginBottom: '8px' }}>Ya existen documentos subidos para este requisito:</Text>
          <List
            size="small"
            style={{ background: '#fff', borderRadius: '6px' }}
            dataSource={uploadedFilesForSelected}
            renderItem={fileItem => (
              <List.Item
                actions={[
                  <Popconfirm title="¿Eliminar archivo?" onConfirm={() => deleteFile(fileItem.name)}>
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
      )}

      <div style={{ marginTop: '24px' }}>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Seleccionar archivo(s)</Button>
        </Upload>
        
        {isMultiple && fileList.length > 0 && (
          <div style={{ marginTop: '16px', padding: '16px', background: '#fafafa', border: '1px dashed #d9d9d9', borderRadius: '8px' }}>
            <Text strong style={{ display: 'block', marginBottom: '12px' }}>
              Asigna un nombre o identificador a cada archivo (ej. modificacion_2010):
            </Text>
            {fileList.map((file) => (
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
          onClick={handleUploadClick}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16, display: 'block' }}
        >
          {uploading ? 'Subiendo...' : 'Subir Documento'}
        </Button>
      </div>
    </div>
  );
};

export default UploadTab;
