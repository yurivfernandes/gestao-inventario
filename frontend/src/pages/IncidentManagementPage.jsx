import React from 'react';
import Header from '../components/Header/Header';
import IncidentTable from '../components/Incidents/IncidentTable';

function IncidentManagementPage() {
  return (
    <>
      <Header />
      <div className="page-container">
        <h1>Gestão de Incidentes</h1>
        <IncidentTable />
      </div>
    </>
  );
}

export default IncidentManagementPage;
