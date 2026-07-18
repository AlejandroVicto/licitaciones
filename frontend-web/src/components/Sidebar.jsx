import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { 
  InfoCircleOutlined, 
  FileWordOutlined, 
  EditOutlined, 
  CloudDownloadOutlined,
  LogoutOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import useEmpresaStore from '../store/useEmpresaStore';
import useAuthStore from '../store/useAuthStore';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const empresaSeleccionada = useEmpresaStore((state) => state.empresaSeleccionada);
  const { usuarioActivo, logout } = useAuthStore();
  const permisos = usuarioActivo?.permisos || [];

  const rawMenuItems = [
    {
      key: '/dashboard/informacion',
      icon: <InfoCircleOutlined />,
      label: 'Información',
      perm: 'always'
    },
    {
      key: '/dashboard/generar',
      icon: <FileWordOutlined />,
      label: 'Generar Documento',
      perm: 'Generar'
    },
    {
      key: '/dashboard/editar',
      icon: <EditOutlined />,
      label: 'Editar Empresa',
      perm: 'Editar'
    },
    {
      key: '/dashboard/usuarios',
      icon: <TeamOutlined />,
      label: 'Control de Usuarios',
      perm: 'admin_only'
    },
    {
      key: 'boveda',
      icon: <CloudDownloadOutlined />,
      label: 'Bóveda Digital',
      perm: 'always',
      children: [
        {
          key: '/dashboard/boveda/info',
          label: 'Guía de Requisitos',
          perm: 'always'
        },
        {
          key: '/dashboard/boveda/1',
          label: 'Legal y Acreditación',
          perm: 'always'
        },
        {
          key: '/dashboard/boveda/2',
          label: 'Experiencia y Operación',
          perm: 'always'
        },
        {
          key: '/dashboard/boveda/3',
          label: 'Financiero y Contable',
          perm: 'always'
        },
        {
          key: '/dashboard/boveda/4',
          label: 'Personal Clave',
          perm: 'always'
        }
      ]
    }
  ];

  const menuItems = rawMenuItems.filter(item => {
    if (item.perm === 'always') return true;
    if (item.perm === 'admin_only') return usuarioActivo?.username === 'admin';
    if (item.children) {
      // In this case, Boveda children are also 'always', but just to be safe:
      item.children = item.children.filter(child => child.perm === 'always' || permisos.includes(child.perm));
      return item.children.length > 0;
    }
    return permisos.includes(item.perm);
  });

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
            navigate(key);
          }}
          style={{ borderRight: 0 }}
        />
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
        <Button 
          type="text" 
          danger 
          icon={<LogoutOutlined />} 
          style={{ width: '100%', textAlign: 'left' }}
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          Cerrar Sesión
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;
