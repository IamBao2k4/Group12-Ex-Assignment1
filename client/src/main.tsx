import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { NotificationProvider } from './components/common/NotificationContext'
import './i18n/config.ts' // Import i18n config

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotificationProvider>
      <React.Suspense fallback={<div>Loading...</div>}>
        <App />
      </React.Suspense>
    </NotificationProvider>
  </React.StrictMode>,
)
