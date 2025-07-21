import React from 'react';
import { Routes, Route } from 'react-router-dom';

// // 허브용 페이지 컴포넌트
import MainPage from '../pages/hub/Main/MainPage';
import OrderDetailPage from '../pages/hub/OrderDetail/OrderDetailPage';
import HubHistoryPage from '../pages/hub/HubHistory/HubHistoryPage';
import HubInfoPage from '../pages/hub/HubInfo/HubInfoPage';

import HubHeader from '../layout/headers/HubHeader';

function HubRoutes() {
  return (
    <>
      <HubHeader />
      <Routes>
        <Route path="" element={<MainPage />} />
        <Route path="/order-detail" element={<OrderDetailPage />} />
        <Route path="/history" element={<HubHistoryPage />} />
        <Route path="/info" element={<HubInfoPage />} />
      </Routes>
    </>
  );
}

export default HubRoutes;
