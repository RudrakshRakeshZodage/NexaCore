
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from "@/components/ui/toaster"
import { FirebaseProvider } from './context/FirebaseContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseProvider>
      <App />
      <Toaster />
    </FirebaseProvider>
  </React.StrictMode>,
)
