/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
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

// Skeleton UI Components
const CookCardSkeleton = () => (
  <div className={styles.cookItem}>
    <Skeleton height={200} />
    <div className={styles.cookName}>
      <Skeleton height={20} />
    </div>
  </div>
);

const CookGridSkeleton = ({ count = 12 }) => (
  <div className={styles.cookGrid}>
    {Array.from({ length: count }, (_, index) => (
      <CookCardSkeleton key={`skeleton-${index}`} />
    ))}
  </div>
);

const CategoryPage = () => {
  const [items, setItems] = useState([]);
  const [searchParams] = useSearchParams();
  const [pageNo, setPageNo] = useState(1);
  const [numOfRows] = useState(12);
  const [isFullLoaded, setIsFullLoaded] = useState(false);
  const [sortByOrder, setSortByOrder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function fetchItems() {
      if (isFullLoaded) return;
      
      try {
        // 첫 페이지가 아닐 때만 loadingMore 상태 설정
        if (pageNo > 1) {
          setLoadingMore(true);
        }

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
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }

    fetchItems();
  }, [pageNo, sortByOrder, searchParams]);

  // 정렬 버튼 클릭 시 로딩 상태 초기화
  const handleSortChange = () => {
    setLoading(true);
    setPageNo(1);
    setSortByOrder(prev => !prev);
    setIsFullLoaded(false);
    setItems([]);
  };

  // 더보기 버튼 클릭 시
  const handleLoadMore = () => {
    setPageNo(pageNo + 1);
  };

  return (
    <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
      <div className={styles.categoryCookPage}>
        <div className={styles.categoryHeader}>
          <h2>
            {loading ? (
              <Skeleton width={80} height={32} />
            ) : (
              categoryList.find(c => c.en === searchParams.get('category'))?.name || '전체'
            )}
          </h2>
          {loading ? (
            <Skeleton width={80} height={40} />
          ) : (
            <Button
              className={styles.sortButton}
              onClick={handleSortChange}
            >
              {sortByOrder ? '주문량순' : '최신순'}
            </Button>
          )}
        </div>

        {loading ? (
          <CookGridSkeleton count={12} />
        ) : (
          <>
            <CookGrid items={items} />
            {loadingMore && <CookGridSkeleton count={numOfRows} />}
          </>
        )}

        {!loading && !isFullLoaded && !loadingMore && (
          <div className={styles.loadMoreButton}>
            <Button onClick={handleLoadMore}>더보기 +</Button>
          </div>
        )}
      </div>
    </SkeletonTheme>
  );
};

export default CategoryPage;