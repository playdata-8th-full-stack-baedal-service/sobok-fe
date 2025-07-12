/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../../../services/axios-config';
import CookGrid from '../component/CookGrid';
import styles from './SearchPage.module.scss';
import Button from '../../../../common/components/Button';

const SearchPage = () => {
  const [items, setItems] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [numOfRows] = useState(12);
  const [isFullLoaded, setIsFullLoaded] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function fetchItems() {
      const response = await axiosInstance.get('/cook-service/cook/search-cook', {
        params: {
          pageNo,
          numOfRows,
          keyword: searchParams.get('keyword'),
        },
      });
      console.log(response.data.data);
      setItems(response.data.data || []);
      if (response.data.data.length < numOfRows) {
        setIsFullLoaded(true);
      }
    }

    fetchItems();
  }, [pageNo, numOfRows, searchParams]);

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchHeader}>
        <h2>검색</h2>
        <input type="text" placeholder="검색어를 입력하세요." />
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

export default SearchPage;
