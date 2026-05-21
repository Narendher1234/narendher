import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css'

// Use Vite environment variable VITE_API_URL when provided, otherwise default to localhost
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)