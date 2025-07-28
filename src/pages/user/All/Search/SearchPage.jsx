/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../../../services/axios-config';
import CookGrid from '../component/CookGrid';
import styles from './SearchPage.module.scss';
import Button from '../../../../common/components/Button';
import useToast from '@/common/hooks/useToast';

const SearchPage = () => {
  const [items, setItems] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [numOfRows] = useState(12);
  const [isFullLoaded, setIsFullLoaded] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess, showNegative, showInfo } = useToast();

  useEffect(() => {
    setItems([]);
    setIsFullLoaded(false);
    setPageNo(1);
  }, [searchParams]);

  useEffect(() => {
    async function fetchItems() {
      if (searchParams.get('keyword') === '') {
        showNegative('검색어를 입력해주세요.');
        navigate(-1);
        return;
      }

      try {
        const response = await axiosInstance.get('/cook-service/cook/search-cook', {
          params: {
            pageNo,
            numOfRows,
            keyword: searchParams.get('keyword'),
          },
        });

        console.log(response.data.data);

        // 🔥 첫 번째 페이지면 기존 결과 초기화, 그 이후는 누적
        if (pageNo === 1) {
          setItems(response.data.data || []);
        } else {
          setItems(prev => [...prev, ...(response.data.data || [])]);
        }

        if (response.data.data.length < numOfRows) {
          setIsFullLoaded(true);
        }
      } catch (error) {
        console.error('검색 중 오류 발생:', error);
        showNegative('검색 중 오류가 발생했습니다.');
        setIsFullLoaded(true);
      }
    }

    fetchItems();
  }, [pageNo, numOfRows, searchParams, navigate, showNegative]);

  const handleSearch = e => {
    e.preventDefault();
    const keyword = e.target.keyword.value.trim();

    if (keyword === '') {
      showNegative('검색어를 입력해주세요.');
      return;
    }

    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    setSearchParams({ keyword });
  };

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchHeader}>
        <h2>
          &quot;
          <span className={styles.keyword}>{searchParams.get('keyword')}</span>
          &quot;의 검색 결과
          <span> {items.length} 개</span>
        </h2>
        <form onSubmit={handleSearch}>
          <input type="text" placeholder="검색어를 입력하세요." name="keyword" />
        </form>
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
