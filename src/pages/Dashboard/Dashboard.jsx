import React from 'react'
import {  Typography } from 'antd';

const { Title } = Typography;

function Dashboard() {
  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <p>Bienvenido al panel de administración. Aquí podrás ver un resumen de la actividad reciente.</p>
    </div>
  )
}

export default Dashboard