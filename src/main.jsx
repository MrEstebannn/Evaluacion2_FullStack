import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';
import { NotificacionProvider } from './context/NotificacionContext.jsx';
import { TiendaProvider } from './context/TiendaContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotificacionProvider>
      <TiendaProvider>
        <App />
      </TiendaProvider>
    </NotificacionProvider>
  </React.StrictMode>
);
