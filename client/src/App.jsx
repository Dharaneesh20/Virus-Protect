import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import ScanFilePage from './pages/ScanFilePage';
import ScanProjectPage from './pages/ScanProjectPage';
import WebMonitorPage from './pages/WebMonitorPage';
import HistoryPage from './pages/HistoryPage';
import QuarantinePage from './pages/QuarantinePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="scan-file" element={<ScanFilePage />} />
        <Route path="scan-project" element={<ScanProjectPage />} />
        <Route path="monitor-web" element={<WebMonitorPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="quarantine" element={<QuarantinePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
