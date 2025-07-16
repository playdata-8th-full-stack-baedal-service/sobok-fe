import React from 'react';
import { Routes, Route } from 'react-router-dom';

import UserHeader from './layout/headers/userHeader/UserHeader';
import AuthRoutes from './router/AuthRoutes';
import UserRoutes from './router/UserRoutes';
import AdminRoutes from './router/AdminRoutes';
import RiderRoutes from './router/RiderRoutes';
import HubRoutes from './router/HubRoutes';
import RoleRoute from './router/RoleRoute';

import ModalController from './common/modals/ModalController';
import MainPage from './pages/user/All/Main/MainPage';
import Footer from './layout/footer/Footer';
<<<<<<< HEAD
=======
import SuccessPage from './pages/user/Pay/toss/TossSuccess';
import SocialLoginListener from './pages/auth/SignIn/components/SocialLoginListener';
>>>>>>> 9db18ce5431a10d75e15a630f7fd63d5d65fc6ae

function App() {
  return (
    <>
      <SocialLoginListener />
      <Routes>
        {/* 비회원도 접근 가능한 유저 메인페이지 */}
        <Route
          path="/"
          element={
            <>
              <UserHeader />
              <MainPage />
            </>
          }
        />

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
      <ModalController />
    </>
  );
}

export default App;
