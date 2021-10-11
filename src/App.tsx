import { HashRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

import { Routes } from './Routes';
import { AuthProvider } from './providers/auth';
import { SocketProvider } from './providers/socket';

import 'react-toastify/dist/ReactToastify.css';
function App() {
  axios.defaults.baseURL = `http://${process.env.REACT_APP_API}/api/v1`;

  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');

    if (token) {
      if (config.headers) config.headers['Authorization'] = `bearer ${token}`;
    }

    return config;
  });


  return (
    <Router>
      <SocketProvider>
        <ToastContainer
          autoClose={2000}
          position='bottom-right'
          theme='colored'
        />
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </SocketProvider>
    </Router>
  );
}

export default App;
