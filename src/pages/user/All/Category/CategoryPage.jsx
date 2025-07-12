/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNo, setPageNo] = useState(1);
  const [numOfRows, setNumOfRows] = useState(10);

  useEffect(() => {
    async function fetchItems() {
      const response = await axiosInstance.get(`/cook-service/cook/get-cook-category`, {
        params: {
          category: searchParams.get('category'),
          pageNo,
          numOfRows,
        },
      });
      setItems(prev => [...prev, ...response.data.data]);
    }
    fetchItems();
  }, [pageNo, numOfRows, searchParams]);

  return (
    <div className={styles.categoryCookPage}>
      <div className={styles.categoryHeader}>
        <h2>{categoryList.find(c => c.en === searchParams.get('category').toUpperCase()).name}</h2>
        <Button className={styles.sortButton}>최신순/주문량순</Button>
      </div>
      <CookGrid items={items} />
      <div className={styles.loadMoreButton}>
        <Button onClick={() => setPageNo(pageNo + 1)}>더보기 +</Button>
      </div>
    </div>
  );
};

export default CategoryPage;
