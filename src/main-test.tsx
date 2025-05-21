import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const TestApp = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f0f4f8'
    }}>
      <div style={{
        padding: '2rem',
        backgroundColor: '#3b82f6',
        color: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Test React App</h1>
        <p style={{ fontSize: '1.25rem' }}>If you can see this, React is working correctly!</p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>,
) 