import React, { useState } from 'react';
import { Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';
import { Layout, Menu, Button, Drawer } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  FileOutlined,
  MenuOutlined
} from '@ant-design/icons';

import ClientManagement from '../Administracion de clientes/ClientManagement';
import Dashboard from '../Dashboard/Dashboard';
import Reports from '../Reportes/Reports';
import Settings from '../Ajustes/Settings';
import HistoryClient from '../Administracion de clientes/HistorialEntregas/HistoryClient';
import { ProtectedRoute } from '../../components/ProtectedRoute';

const { Header, Content } = Layout;

function Home() {
  const location = useLocation();
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = [
    { key: '/home/dashboard', icon: <DashboardOutlined />, label: 'Inicio' },
    { key: '/home/clients', icon: <UserOutlined />, label: 'Administrar Clientes' },
    { key: '/home/reports', icon: <FileOutlined />, label: 'Reportes' },
    { key: '/home/settings', icon: <SettingOutlined />, label: 'Configuración' },
  ];

  const NavigationMenu = () => (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      style={{ height: '100%', borderRight: 0 }}
    >
      {menuItems.map(item => (
        <Menu.Item key={item.key} icon={item.icon}>
          <Link to={item.key}>{item.label}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Drawer
        title="Menú"
        placement="left"
        onClose={() => setMenuVisible(false)}
        onClick={() => setMenuVisible(false)}
        open={menuVisible}
      >
        <NavigationMenu />
      </Drawer>
      <Layout>
        <Header style={{ padding: 0, background: '#fff', display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMenuVisible(true)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <h1 style={{ margin: 0, padding: '0 16px' }}>Panel de Administración</h1>
        </Header>
        <Layout>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: "100vh" }}>
              <Routes>
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="clients"
                  element={
                    <ProtectedRoute>
                      <ClientManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                
                <Route path="*" element={<Navigate to="/home/dashboard" />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Home;
