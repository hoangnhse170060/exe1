import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Simple test component
function TestApp() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        maxWidth: '600px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ color: '#667eea', marginBottom: '20px' }}>
          ✅ React App is Working!
        </h1>
        <p style={{ color: '#333', lineHeight: '1.6' }}>
          <strong>Congratulations!</strong> If you can see this, it means:
        </p>
        <ul style={{ color: '#333', lineHeight: '1.8' }}>
          <li>✅ React is mounting correctly</li>
          <li>✅ JavaScript is executing</li>
          <li>✅ Vite build is working</li>
          <li>✅ Preview server is running</li>
        </ul>
        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ddd' }} />
        <p style={{ color: '#666', fontSize: '14px' }}>
          <strong>Issue found:</strong> The main App component might have rendering issues.
          This test component proves the infrastructure is working.
        </p>
      </div>
    </div>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <TestApp />
    </StrictMode>
  );
} else {
  console.error('❌ Root element not found!');
}
