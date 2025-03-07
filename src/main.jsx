import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// import favicon from './assets/favicon.ico';

// const link = document.createElement('link');
// link.rel = 'icon';
// link.href = favicon;
// document.head.appendChild(link);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
