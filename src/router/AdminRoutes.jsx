import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AllOrderPage from '../pages/admin/AllOrder/AllOrderPage';
import HubRegisterPage from '../pages/admin/HubRegister/HubRegisterPage';
import IngrediantPage from '../pages/admin/Ingrediant/IngrediantPage';
import MainPage from '../pages/admin/Main/MainPage';
import HubListPage from '../pages/admin/HubList/HubListPage';
import RiderListPage from '../pages/admin/RiderList/RiderListPage';

import AdminHeader from '../layout/headers/AdminHeader';
import RecipeRegistPage from '../pages/admin/RecipeRegeister/RecipeRegistPage';

function AdminRoutes() {
  return (
    <>
      <AdminHeader />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="all-order" element={<AllOrderPage />} />
        <Route path="hub-register" element={<HubRegisterPage />} />
        <Route path="ingredient" element={<RecipeRegistPage />} />
        <Route path="hub-list" element={<HubListPage />} />
        <Route path="rider-list" element={<RiderListPage />} />
      </Routes>
    </>
  );
}

export default AdminRoutes;
