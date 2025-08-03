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
import SuccessPage from './pages/user/Pay/toss/TossSuccess';
import SocialLoginListener from './pages/auth/SignIn/components/SocialLoginListener';
import ScrollToTop from './common/components/ScrollToTop';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductPage from './pages/user/All/Product/ProductPage';
import SearchPage from './pages/user/All/Search/SearchPage';
import CategoryPage from './pages/user/All/Category/CategoryPage';
import PostListPage from './pages/user/Post/PostList/PostListPage';
import PostDetailPage from './pages/user/Post/PostDetail/PostDetailPage';

function App() {
  return (
    <>
      <ToastContainer />

      <ScrollToTop />
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

        {/* 공용 페이지 */}
        <Route
          path="/main"
          element={
            <>
              <UserHeader />
              <MainPage />
            </>
          }
        />
        <Route
          path=""
          element={
            <>
              <UserHeader />
              <MainPage />
            </>
          }
        />
        <Route
          path="/product"
          element={
            <>
              <UserHeader />
              <ProductPage />
            </>
          }
        />
        <Route
          path="/search"
          element={
            <>
              <UserHeader />
              <SearchPage />
            </>
          }
        />
        <Route
          path="/category"
          element={
            <>
              <UserHeader />
              <CategoryPage />
            </>
          }
        />
        <Route
          path="/post-list"
          element={
            <>
              <UserHeader />
              <PostListPage />
            </>
          }
        />
        <Route
          path="/post/:id"
          element={
            <>
              <UserHeader />
              <PostDetailPage />
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
