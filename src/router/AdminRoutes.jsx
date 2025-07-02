import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AllOrderPage from '../pages/admin/AllOrder/AllOrderPage';
// import HubDetailModal from '../pages/admin/_modals/HubDetailModal';
import HubRegisterPage from '../pages/admin/HubRegister/HubRegisterPage';
import IngrediantPage from '../pages/admin/Ingrediant/IngrediantPage';
import MainPage from '../pages/admin/Main/MainPage';
// import OrderDetailModal from '../pages/admin/_modals/OrderDetailModal';
import RecipeRegistPage from '../pages/admin/RecipeRegeister/RecipeRegistPage';
// import RiderDetailModal from '../pages/admin/_modals/RiderDetailModal';
import RiderListPage from '../pages/admin/RiderList/RiderListPage';

import AdminHeader from '../layout/headers/AdminHeader';

function AdminRoutes() {
  return (
    <>
      <AdminHeader />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="all-order" element={<AllOrderPage />} />
        {/* <Route path="hub-detail" element={<HubDetailModal />} /> */}
        <Route path="hub-register" element={<HubRegisterPage />} />
        <Route path="ingredient" element={<IngrediantPage />} />
        <Route path="menu-recommend" element={<MenuRecommendPage />} />
        {/* <Route path="order-detail" element={<OrderDetailModal />} /> */}
        <Route path="recipe-regist" element={<RecipeRegistPage />} />
        {/* <Route path="rider-detail" element={<RiderDetailModal />} /> */}
        <Route path="rider-list" element={<RiderListPage />} />
      </Routes>
    </>
  );
}

export default AdminRoutes;
