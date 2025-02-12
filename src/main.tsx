import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Import Bootstrap JS (includes Popper.js)
import './index.css'
import App from './App.tsx'
import * as ECT from '@whoicd/icd11ect';
import '@whoicd/icd11ect/style.css';

const mySettings = {
  apiServerUrl: "http://localhost:8382/",
  height: "60vh"   
};

// configure the ECT Handler
ECT.Handler.configure(mySettings);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
