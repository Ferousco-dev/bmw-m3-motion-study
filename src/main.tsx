import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';   // must precede components: it is the base layer,
import App from './App';       // and bundled last it out-specifies every rule

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
