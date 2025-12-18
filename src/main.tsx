import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Capacitor } from '@capacitor/core'

// Initialize Capacitor for iOS/Android
if (Capacitor.isNativePlatform()) {
  // Native platform specific initialization
  console.log('Running on native platform:', Capacitor.getPlatform());
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

