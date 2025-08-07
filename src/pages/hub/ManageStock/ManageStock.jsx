/* eslint-disable react/function-component-definition */
import React from 'react';
import Page from '../../../common/components/Page';
import ManageStockHeader from './component/ManageStockHeader';
import IngredientInfoList from './component/IngredientInfoList';
import PagingFooter from './component/PagingFooter';

const ManageStock = () => {
  return (
    <Page>
      {/* 헤더 */}
      <ManageStockHeader />
      {/* 식재료 */}
      <IngredientInfoList />
      {/* 페이징 */}
      <PagingFooter />
    </Page>
  );
};

export default ManageStock;
