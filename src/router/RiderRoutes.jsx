import React from 'react';
import { Routes, Route } from 'react-router-dom';

// // 라이더용 페이지 컴포넌트
import MainPage from '../pages/rider/Main/MainPage';
import RiderInfoPage from '../pages/rider/RiderInfo/RiderInfoPage';
import DelivaryHistoryPage from '../pages/rider/DelivaryHistory/DelivaryHistoryPage';
import RequestListPage from '../pages/rider/RequestList/RequestListPage';
import AcceptedListPage from '../pages/rider/AcceptedList/AcceptedListPage';

import RiderHeader from '../layout/headers/RiderHeader';

function RiderRoutes() {
  return (
    <>
      <RiderHeader />
      <Routes>
        <Route path="" element={<MainPage />} />
        <Route path="/info" element={<RiderInfoPage />} />
        <Route path="/history" element={<DelivaryHistoryPage />} />
        <Route path="/request-list" element={<RequestListPage />} />
        <Route path="/accepted-list" element={<AcceptedListPage />} />
      </Routes>
    </>
  );
}

export default RiderRoutes;
