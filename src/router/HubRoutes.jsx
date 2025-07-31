import React from 'react';
import { Routes, Route } from 'react-router-dom';
// 허브용 페이지 컴포넌트
import MainPage from '../pages/hub/Main/MainPage';
import HubHistoryPage from '../pages/hub/HubHistory/HubHistoryPage';
import HubInfoPage from '../pages/hub/HubInfo/HubInfoPage';
import ManageStock from '../pages/hub/ManageStock/ManageStock';
import HubHeader from '../layout/headers/HubHeader';
import HubDashboard from '../pages/hub/HubDashborad/HubDashboard';
import AnimatedText from '../pages/hub/MainText/AnimatedText';

function HubRoutes() {
  return (
    <>
      <HubHeader />
      <Routes>
        <Route path="/" element={<MainPage />}>
          {/* 기본 경로 - 로고 클릭 시 보여질 대시보드 */}
          <Route index element={<AnimatedText />} />
          {/* 각 메뉴별 라우트 */}
          <Route path="order" element={<HubDashboard />} />
          <Route path="history" element={<HubHistoryPage />} />
          <Route path="info" element={<HubInfoPage />} />
          <Route path="stock" element={<ManageStock />} />
        </Route>
      </Routes>
    </>
  );
}

export default HubRoutes;
