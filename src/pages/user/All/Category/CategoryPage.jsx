/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import Button from '../../../../common/components/Button';
import CookGrid from '../component/CookGrid';
import axiosInstance from '../../../../services/axios-config';
import styles from './CategoryPage.module.scss';

const categoryList = [
  {
    en: 'KOREAN',
    name: '한식',
  },
  {
    en: 'CHINESE',
    name: '중식',
  },
  {
    en: 'JAPANESE',
    name: '일식',
  },
  {
    en: 'WESTERN',
    name: '양식',
  },
  {
    en: 'SNACK',
    name: '간식',
  },
  {
    en: 'LATE_NIGHT',
    name: '야식',
  },
];

const CategoryPage = () => {
  const [items, setItems] = useState([]);
  const [searchParams] = useSearchParams();
  const [pageNo, setPageNo] = useState(1);
  const [numOfRows] = useState(12);
  const [isFullLoaded, setIsFullLoaded] = useState(false);
  const [sortByOrder, setSortByOrder] = useState(false);

  // path 파라미터가 있으면 우선 사용, 없으면 쿼리스트링 사용
  useEffect(() => {
    async function fetchItems() {
      if (isFullLoaded) return;

      const response = await axiosInstance.get(`/cook-service/cooks`, {
        params: {
          category: searchParams.get('category') === 'all' ? null : searchParams.get('category'),
          pageNo,
          numOfRows,
          sort: sortByOrder ? 'order' : null,
        },
      });

      if (pageNo === 1) {
        setItems(response.data.data);
      } else {
        setItems(prev => [...prev, ...response.data.data]);
      }

      if (response.data.data.length < numOfRows) {
        setIsFullLoaded(true);
      }
    }
    fetchItems();
  }, [pageNo, sortByOrder]);

  return (
    <div className={styles.categoryCookPage}>
      <div className={styles.categoryHeader}>
        <h2>{categoryList.find(c => c.en === searchParams.get('category'))?.name || '전체'}</h2>
        <Button
          className={styles.sortButton}
          onClick={() => {
            setPageNo(1);
            setSortByOrder(prev => !prev);
            setIsFullLoaded(false);
          }}
        >
          {sortByOrder ? '주문량순' : '최신순'}
        </Button>
      </div>
      <CookGrid items={items} />
      {!isFullLoaded && (
        <div className={styles.loadMoreButton}>
          <Button onClick={() => setPageNo(pageNo + 1)}>더보기 +</Button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
