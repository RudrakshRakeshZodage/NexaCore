
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from "@/components/ui/toaster"
import { FirebaseProvider } from './context/FirebaseContext.tsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <FirebaseProvider>
        <App />
        <Toaster />
      </FirebaseProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
