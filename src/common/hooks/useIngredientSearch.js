// hooks/useIngredientSearch.js
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchAdditionalIngredients, setSearchQuery } from '@/store/productSlice';

/**
 * 공통 재료 검색 훅
 * - Redux의 fetchAdditionalIngredients를 사용해 검색
 * - 검색 결과와 로딩 상태를 반환
 * - 여러 컴포넌트에서 재사용 가능
 */
export const useIngredientSearch = (keyword) => {
  const dispatch = useDispatch();

  // Redux state에서 검색 결과와 로딩 상태 가져오기
  const searchResults = useSelector((state) => state.product.searchQuery);
  const loading = useSelector((state) => state.product.loading);

  // keyword가 변경될 때마다 API 요청
  useEffect(() => {
  // keyword가 없더라도 전체 조회 API 호출
  dispatch(fetchAdditionalIngredients(keyword));
}, [keyword, dispatch]);

  return { searchResults, loading };
};
