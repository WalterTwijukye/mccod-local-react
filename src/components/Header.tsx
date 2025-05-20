
// import React from 'react';
// import './FormHeader.css';

// interface Props {
//   isOnline: boolean;
// }

// const FormHeader: React.FC<Props> = ({ isOnline }) => {
//   return (
//     <div className="header">
//       <span className="headng">Vital Events - Medical Certificate of Cause of Death</span>
//       <div className="rightEnd">
//         <a href="https://icdcdn.who.int/icdapibinaries/icdapi-setup-2.5.0.msi" download>
//           <button className="dashboardBtn">Download & Install ICD-API</button>
//         </a>
//         <a href="/Xproxy.exe" download>
//           <button className="dashboardBtn">Download & Install Proxy Service</button>
//         </a>
//         <span className="internetStatus">ICD-API: Running</span>
//         <span className="internetStatus">Proxy service: Running</span>
//         <span className="internetStatus">
//           <span className={`circle ${isOnline ? 'online' : 'offline'}`}></span>
//           {isOnline ? 'Online' : 'Offline'}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default FormHeader;

import React, { useEffect, useState } from 'react';
import './FormHeader.css';

interface Props {
  isOnline: boolean;
}

const FormHeader: React.FC<Props> = ({ isOnline }) => {
  const [icdApiStatus, setIcdApiStatus] = useState<string>('Checking...');
  const [proxyStatus, setProxyStatus] = useState<string>('Checking...');

  // Check ICD-API status
  const checkIcdApiStatus = async () => {
    try {
      const response = await fetch('http://localhost:8382/ct');
      if (response.ok || response.status === 200) {
        setIcdApiStatus('Running');
      } else {
        setIcdApiStatus('Stopped');
      }
    } catch (error) {
      setIcdApiStatus('Stopped');
      console.error('ICD-API check failed:', error);
    }
  };

  // Check Proxy service status
  const checkProxyStatus = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/');
      if (response.ok || response.status === 200) {
        setProxyStatus('Running');
      } else {
        setProxyStatus('Stopped');
      }
    } catch (error) {
      setProxyStatus('Stopped');
      console.error('Proxy service check failed:', error);
    }
  };

  // Check services periodically
  useEffect(() => {
    // Initial check
    checkIcdApiStatus();
    checkProxyStatus();

    // Set up interval for periodic checks (every 30 seconds)
    const intervalId = setInterval(() => {
      checkIcdApiStatus();
      checkProxyStatus();
    }, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="header">
      <span className="headng">Vital Events - Medical Certificate of Cause of Death</span>
      <div className="rightEnd">
        <a href="https://icdcdn.who.int/icdapibinaries/icdapi-setup-2.5.0.msi" download>
          <button className="dashboardBtn">Download & Install ICD-API</button>
        </a>
        <a href="/Xproxy.exe" download>
          <button className="dashboardBtn">Download & Install Proxy Service</button>
        </a>
        <span className="internetStatus">ICD-API: {icdApiStatus}</span>
        <span className="internetStatus">Proxy service: {proxyStatus}</span>
        <span className="internetStatus">
          <span className={`circle ${isOnline ? 'online' : 'offline'}`}></span>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );
};

export default FormHeader;