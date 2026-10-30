import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

if ('serviceWorker' in navigator) {
  // Sur localhost, désinscrire les anciens Service Workers pour éviter tout conflit de cache ou avertissement console en dev
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister().catch(() => {})
      }
    }).catch(() => {})
  } else {
    const handleLoad = () => {
      window.removeEventListener('load', handleLoad)
      navigator.serviceWorker
        .register('/sw.js')
        .then(reg => {
          reg.update().catch(() => {})
        })
        .catch(() => {})
    }
    window.addEventListener('load', handleLoad, { once: true })
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)



