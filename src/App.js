import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate,useLocation } from 'react-router-dom';
import { useAppContext } from './context';
import Home from './pages/Inicio/Home';
import Login from './pages/Login/Login';
import ShowClientInfo from './pages/ClientsInfo/ShowClientInfo';

function App() {
  const { retrieveAdmin, isAuthenticated } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation(); // Obtiene la ubicación actual

  useEffect(() => {
    (async () => {
      await retrieveAdmin();
      const currentPath = location.pathname;
      
      // Si la ruta es /show-client-info/:userId, no redirigimos
      if (currentPath.startsWith('/show-client-info')) {
        return;
      }

      // Redirige a la página de inicio de sesión si el usuario no está autenticado
      if (isAuthenticated === false) {
        navigate('/', { replace: true });
      } else if (isAuthenticated === true) {
        // Redirige a /home/dashboard si está autenticado y está en la ruta raíz
        if (currentPath === '/') {
          navigate('/home/dashboard', { replace: true });
        }
      }
    })();
  }, [isAuthenticated, navigate, location]);


  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/show-client-info/:userId' element={<ShowClientInfo/>}/>
      {isAuthenticated ? (
        <Route path="/home/*" element={<Home />} />
      ) : (
        <Route path="*" element={<Navigate to="/" />} />
      )}
    </Routes>
  );
}

export default App;
