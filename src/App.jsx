import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthRoutes from './router/AuthRoutes';
import UserRoutes from './router/UserRoutes';
import AdminRoutes from './router/AdminRoutes';
import RiderRoutes from './router/RiderRoutes';
import HubRoutes from './router/HubRoutes';
import RoleRoute from './router/RoleRoute';

import MainPage from './app/user/MainPage';
import Footer from './common/headerfooter/Footer';

function App() {
  return (
    <Router>
      <>
        <Routes>
          {/* 비회원도 접근 가능한 유저 메인페이지 */}
          <Route path="/" element={<MainPage />} />

          {/* 로그인, 회원가입, 아이디/비밀번호 찾기 등 */}
          <Route path="/auth/*" element={<AuthRoutes />} />

          {/* 유저 라우트 전체 */}
          <Route path="/user/*" element={<UserRoutes />} />

          {/* 관리자 전용 */}
          <Route
            path="/admin/*"
            element={
              <RoleRoute role="ADMIN">
                <AdminRoutes />
              </RoleRoute>
            }
          />

          {/* 라이더 전용 */}
          <Route
            path="/rider/*"
            element={
              <RoleRoute role="RIDER">
                <RiderRoutes />
              </RoleRoute>
            }
          />

          {/* 허브 전용 */}
          <Route
            path="/hub/*"
            element={
              <RoleRoute role="HUB">
                <HubRoutes />
              </RoleRoute>
            }
          />
        </Routes>
        <Footer />
      </>
    </Router>
  );
}


export default App;
