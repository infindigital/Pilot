import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { VaultProvider } from './context/VaultContext.jsx';
import { UIProvider } from './context/UIContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <VaultProvider>
          <UIProvider>
            <App />
          </UIProvider>
        </VaultProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
