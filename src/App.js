import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAppContext } from './context';
import Home from './pages/Inicio/Home';
import Login from './pages/Login/Login';
import ShowClientInfo from './pages/Administracion de clientes/ClientsInfo/ShowClientInfo';
import HistoryClient from './pages/Administracion de clientes/HistorialEntregas/HistoryClient';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, retrieveAdmin } = useAppContext();

  React.useEffect(() => {
    (async () => {
      await retrieveAdmin();
    })();
  }, [retrieveAdmin]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/show-client-info/:userId" element={<ShowClientInfo />} />
      <Route path="/show-historic-clients" element={<HistoryClient />} />

      <Route path="/home/*" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
