import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import ScanFilePage from './pages/ScanFilePage';
import ScanProjectPage from './pages/ScanProjectPage';
import WebMonitorPage from './pages/WebMonitorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="scan-file" element={<ScanFilePage />} />
          <Route path="scan-project" element={<ScanProjectPage />} />
          <Route path="monitor-web" element={<WebMonitorPage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
