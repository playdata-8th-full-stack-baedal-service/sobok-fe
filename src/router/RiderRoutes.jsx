import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RiderHeader from '../common/headerfooter/RiderHeader';

// // 라이더용 페이지 컴포넌트
import MainPage from '../app/rider/MainPage';
// import RiderInfoPage from '../app/rider/RiderInfoPage';
// import DelivaryHistoryPage from '../app/rider/DelivaryHistoryPage';
// import RequestListPage from '../app/rider/RequestListPage';
// import AcceptedListPage from '../app/rider/AcceptedListPage';

// import RiderHeader from '../common/headerfooter/RiderHeader';

function RiderRoutes() {
  return (
    <>
      <RiderHeader />
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* <Route path="/info" element={<RiderInfoPage />} />
        <Route path="/history" element={<DelivaryHistoryPage />} />
        <Route path="/request-list" element={<RequestListPage />} />
        <Route path="/accepted-list" element={<AcceptedListPage />} /> */}
      </Routes>
    </>
  );
}

export default RiderRoutes;
