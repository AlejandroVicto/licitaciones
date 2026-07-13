import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { 
  InfoCircleOutlined, 
  FileWordOutlined, 
  EditOutlined, 
  CloudDownloadOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import useEmpresaStore from '../store/useEmpresaStore';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const empresaSeleccionada = useEmpresaStore((state) => state.empresaSeleccionada);

  const menuItems = [
    {
      key: '/dashboard/informacion',
      icon: <InfoCircleOutlined />,
      label: 'Información',
    },
    {
      key: '/dashboard/generar',
      icon: <FileWordOutlined />,
      label: 'Generar Documento',
    },
    {
      key: '/dashboard/editar',
      icon: <EditOutlined />,
      label: 'Editar Empresa',
    },
    {
      key: 'boveda',
      icon: <CloudDownloadOutlined />,
      label: 'Bóveda Digital',
      children: [
        {
          key: '/dashboard/boveda/1',
          label: 'Legal y Acreditación',
        },
        {
          key: '/dashboard/boveda/2',
          label: 'Experiencia y Operación',
        },
        {
          key: '/dashboard/boveda/3',
          label: 'Financiero y Contable',
        },
        {
          key: '/dashboard/boveda/4',
          label: 'Personal Clave',
        }
      ]
    }
  ];

  return (
    <Sider theme="light" width={250} style={{ minHeight: '100vh', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '32px', margin: '16px', background: 'rgba(245, 166, 35, 0.1)', borderRadius: '6px', textAlign: 'center', lineHeight: '32px', fontWeight: 'bold', color: '#F5A623', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', padding: '0 8px' }}>
        {empresaSeleccionada ? empresaSeleccionada.nombre : '🏗️ Licitaciones'}
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => {
            if (!key.startsWith('boveda')) {
               navigate(key);
            } else {
               navigate(key);
            }
          }}
          style={{ borderRight: 0 }}
        />
      </div>
    </Sider>
  );
};

export default Sidebar;
