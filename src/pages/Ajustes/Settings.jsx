import React from 'react'
import {  Typography } from 'antd';

const { Title } = Typography;
function Settings() {
  return (
    <div>
      <Title level={2}>Configuración</Title>
      <p>Ajusta las configuraciones de tu cuenta y de la aplicación.</p>
    </div>
  )
}

export default Settings