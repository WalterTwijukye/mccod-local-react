import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MedFormDeath from './components/MedFormDeath';
import { useInternetStatus } from './hooks/useInternetStatus';
import './App.css';

/**
 * Main application component
 */
function App() {
  const isOnline = useInternetStatus();
  const [syncInProgress, setSyncInProgress] = useState(false);

  return (
    <BrowserRouter>
      {/* Online status indicator */}
      <div className="sync-status-indicator" style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        backgroundColor: isOnline ? '#dff0d8' : '#f2dede',
        color: isOnline ? '#3c763d' : '#a94442',
        zIndex: 1000,
      }}>
        {isOnline ? 'Online' : 'Offline'}
        {syncInProgress && ' - Syncing...'}
      </div>
      
      <Routes>
        <Route 
          path="/" 
          element={
            <MedFormDeath 
              isOnline={isOnline} 
              onSyncStateChange={setSyncInProgress} 
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;