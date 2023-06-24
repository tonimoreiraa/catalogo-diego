import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './assets/style.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext.tsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
