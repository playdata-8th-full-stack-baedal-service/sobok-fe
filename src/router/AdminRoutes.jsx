import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AllOrderPage from '../pages/admin/AllOrder/AllOrderPage';
import HubRegisterPage from '../pages/admin/HubRegister/HubRegisterPage';
import IngrediantPage from '../pages/admin/Ingrediant/IngrediantPage';
import MainPage from '../pages/admin/Main/MainPage';
import RecipeRegistPage from '../pages/admin/RecipeRegeister/RecipeRegistPage';
import RiderListPage from '../pages/admin/RiderList/RiderListPage';

import AdminHeader from '../layout/headers/AdminHeader';

function AdminRoutes() {
  return (
    <>
      <AdminHeader />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="all-order" element={<AllOrderPage />} />
        <Route path="hub-register" element={<HubRegisterPage />} />
        <Route path="ingredient" element={<IngrediantPage />} />
        <Route path="menu-recommend" element={<MenuRecommendPage />} />
        <Route path="recipe-regist" element={<RecipeRegistPage />} />
        <Route path="rider-list" element={<RiderListPage />} />
      </Routes>
    </>
  );
}

export default AdminRoutes;
