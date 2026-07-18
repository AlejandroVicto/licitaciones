import React from 'react';
import { List, Typography, Space, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { calcularEstadoVigencia } from '../utils/vigenciaUtils';

const { Text } = Typography;

const ExplorarTab = ({ 
  documentosPermitidos, 
  archivos, 
  loadingList, 
  downloadFile 
}) => {
  return (
    <List
      loading={loadingList}
      dataSource={documentosPermitidos}
      renderItem={(docReq) => {
        const docClean = docReq.replace(/ /g, "_").replace(/\//g, "_").replace(/-/g, "_");
        
        // Match the requirement with any uploaded file that includes the requirement's name
        const uploadedFiles = archivos.filter(f => f.name.includes(docClean));
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
                      <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => downloadFile(fileItem.name)}>Descargar</Button>
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
  );
};

export default ExplorarTab;
