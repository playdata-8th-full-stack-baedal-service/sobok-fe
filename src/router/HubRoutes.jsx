import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 허브용 페이지 컴포넌트
import MainPage from '../app/hub/MainPage';
import OrderDetailPage from '../app/hub/OrderDetailPage';
import HubHistoryPage from '../app/hub/HubHistoryPage';
import HubInfoPage from '../app/hub/HubInfoPage';

function HubRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/order-detail" element={<OrderDetailPage />} />
      <Route path="/history" element={<HubHistoryPage />} />
      <Route path="/info" element={<HubInfoPage />} />
    </Routes>
  );
}

export default HubRoutes;
