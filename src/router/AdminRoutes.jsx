import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AllOrderPage from '../app/admin/AllOrderPage';
import HubDetailModal from '../app/admin/HubDetailModal';
import HubRegisterPage from '../app/admin/HubRegisterPage';
import IngrediantPage from '../app/admin/IngrediantPage';
import MainPage from '../app/admin/MainPage';
import MenuRecommendPage from '../app/admin/MenuRecommendPage';
import OrderDetailModal from '../app/admin/OrderDetailModal';
import RecipeRegistPage from '../app/admin/RecipeRegistPage';
import RiderDetailModal from '../app/admin/RiderDetailModal';
import RiderListPage from '../app/admin/RiderListPage';

import AdminHeader from '../common/headerfooter/AdminHeader';

function AdminRoutes() {
  return (
    <>
      <AdminHeader />
      <Routes>
        {/* <Route path="/" element={<MainPage />} />
        <Route path="all-order" element={<AllOrderPage />} />
        <Route path="hub-detail" element={<HubDetailModal />} />
        <Route path="hub-register" element={<HubRegisterPage />} />
        <Route path="ingredient" element={<IngrediantPage />} />
        <Route path="menu-recommend" element={<MenuRecommendPage />} />
        <Route path="order-detail" element={<OrderDetailModal />} />
        <Route path="recipe-regist" element={<RecipeRegistPage />} />
        <Route path="rider-detail" element={<RiderDetailModal />} />
        <Route path="rider-list" element={<RiderListPage />} /> */}
      </Routes>
    </>
  );
}

export default AdminRoutes;
