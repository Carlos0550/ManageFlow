import React, { useEffect, useRef, useState } from 'react';
import { Typography, Card, Row, Col, Statistic, List, message, Pagination, Skeleton } from 'antd';
import { useAppContext } from '../../context';
import { procesarPagosRecientes } from './utils/CapturarClientesNuevos';
import { procesarPagosPendientes } from './utils/CapturarDeudores';
import "./css/dashboard.css"
import Search from 'antd/es/transfer/search';

const { Title } = Typography;

function Dashboard() {
  const { fetchDashboardData, dashboardData } = useAppContext()
  const [fetchingData, setFetchingData] = useState(false)
  const [searchText, setSearchText] = useState("")
  //Paginaion
  const [currentPagePayments, setCurrentPagePayments] = useState(1);
  const [currentPageDeudores, setCurrentPageDeudores] = useState(1)
  const itemsPerPage = 5;

  //info para las cards
  const conteoTotalActivos = dashboardData.filter(client => client.estadomembresia === 'activa')
  let totalMembers = dashboardData.length > 0 ? dashboardData.length : 0;
  let activeClients = conteoTotalActivos.length > 0 ? conteoTotalActivos.length  : 0;
  let newClients = procesarPagosRecientes(dashboardData).length;
  let pendingPayments = procesarPagosPendientes(dashboardData);
  const recentPayments = procesarPagosRecientes(dashboardData);

  const alreadyFetch = useRef(false)
  useEffect(() => {
    if (!alreadyFetch.current) {
      (async () => {
        const hiddenMessage = message.loading("Aguarde...", 0)
        alreadyFetch.current = true
        setFetchingData(true)
        await fetchDashboardData()
        setFetchingData(false)
        hiddenMessage()
      })()
    }
  }, [])

  const startIndexPayments = (currentPagePayments - 1) * itemsPerPage
  const startIndexDeudores = (currentPageDeudores - 1) * itemsPerPage
  const endIndex = startIndexPayments + itemsPerPage
  const endIndexDeudores = startIndexDeudores + itemsPerPage
  const paginatedPayments = recentPayments
  .filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))
  .slice(startIndexPayments, endIndex)
  const paginatedDeudores = pendingPayments
  .slice(startIndexDeudores, endIndexDeudores)
    
  return (
    <div className='dashboard__wrapper'>
      <Title level={2}>Dashboard</Title>
      <p>Bienvenido al panel de administración. Aquí podrás ver un resumen de cuentas del mes.</p>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={10} xl={12}>
          {fetchingData ? <Skeleton active /> : <Card>
            <Statistic title="Total de clientes" value={totalMembers} />
          </Card>}
        </Col>
        <Col xs={24} sm={12} md={10} xl={12}>
          {fetchingData ? <Skeleton active /> : <Card>
            <Statistic title="Clientes al día" value={activeClients} />
          </Card>}
        </Col>

      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col xs={24} sm={24} md={12}>
          {fetchingData ? <Skeleton active /> : <Card title="Pagos Pendientes">
            <Statistic title="Pagos Pendientes" value={pendingPayments.length} />
            <List
              dataSource={pendingPayments}
              renderItem={item => (
                <List.Item>
                  {item.name} - {item.fecha_vencimiento}
                </List.Item>
              )}
            >
              <Pagination
                current={currentPageDeudores}
                pageSize={itemsPerPage}
                total={paginatedDeudores.length}
                onChange={page => setCurrentPageDeudores(page)}
              />
            </List>
          </Card>}
        </Col>
        <Col xs={24} sm={24} md={12}>
          {fetchingData ? <Skeleton active /> : (
            <Card title={`Nuevos clientes del mes: ${newClients}`}>
              <strong>Datos de Clientes / valor abonado</strong>
              <Search
                value={searchText}
                placeholder='Buscá un cliente'
                onChange={(e) => setSearchText(e.target.value)}
              />
              <List
                dataSource={paginatedPayments}
                renderItem={item => (
                  <>
                    <List.Item>
                      {item.name} - {item.amount.toLocaleString("es-ES", { style: "currency", currency: "ARS" })}
                    </List.Item>
                  </>
                )}
              />
              <Pagination
                current={currentPagePayments}
                pageSize={itemsPerPage}
                total={recentPayments.length}
                onChange={page => setCurrentPagePayments(page)}
              />
            </Card>
          )}
        </Col>
      </Row>

    </div>
  );
}

export default Dashboard;
