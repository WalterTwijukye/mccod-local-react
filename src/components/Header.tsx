import React from 'react';
import './FormHeader.css';

const FormHeader: React.FC = () => {
  return (
    <div className="header">
      <span className="headng">Vital Events - Medical Certificate of Cause of Death</span>
      <div className="rightEnd">
        <a href="https://icdcdn.who.int/icdapibinaries/icdapi-setup-2.4.0.msi" download>
          <button className="dashboardBtn">Download & Install ICD-API</button>
        </a>
        <span className="internetStatus">ICD-API: Online</span>
        <span className="internetStatus">
          <span className="circle online"></span> Online
        </span>
      </div>
    </div>
  );
};

export default FormHeader;