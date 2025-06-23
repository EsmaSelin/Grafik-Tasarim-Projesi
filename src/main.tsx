import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { FilmProvider } from './context/FilmContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FilmProvider>
      <App />
    </FilmProvider>
  </React.StrictMode>
);
