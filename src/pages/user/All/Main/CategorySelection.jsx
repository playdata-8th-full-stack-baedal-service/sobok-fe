import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainPage.module.scss';
import axiosInstance from '../../../../services/axios-config';

const CATEGORY_MAP = {
  한식: 'KOREAN',
  일식: 'JAPANESE',
  중식: 'CHINESE',
  양식: 'WESTERN',
  간식: 'SNACK',
  야식: 'LATE_NIGHT',
};

const CATEGORY_LIST = ['전체', ...Object.keys(CATEGORY_MAP)];

function CategorySelection() {
  const [cookList, setCookList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const navigate = useNavigate();

  // 최신순 데이터 불러오기 (프론트에서 카테고리 필터링)
  const fetchLatest = async (categoryKor = selectedCategory) => {
    try {
      const res = await axiosInstance.get('/cook-service/cook/get-cook', {
        params: { pageNo: 1, numOfRows: 20 },
      });
      let list = res.data.data;
      if (categoryKor !== '전체') {
        const categoryCode = CATEGORY_MAP[categoryKor];
        list = list.filter(cook => cook.category === categoryCode);
      }
      setCookList(list.slice(0, 5));
      setSelectedCategory(categoryKor);
    } catch (e) {
      setCookList([]);
    }
  };

  // 주문량순 데이터 불러오기 (전체에서만)
  const fetchPopular = async () => {
    try {
      const res = await axiosInstance.get('/cook-service/cook/popular', {
        params: { page: 1, size: 5 },
      });
      setCookList(res.data.data || []);
    } catch (e) {
      setCookList([]);
    }
  };

  // 카테고리별 데이터 불러오기 함수 (axiosInstance)
  const fetchCategory = async korCategory => {
    if (korCategory === '전체') {
      fetchLatest('전체');
      return;
    }
    const category = CATEGORY_MAP[korCategory];
    setSelectedCategory(korCategory);
    try {
      const res = await axiosInstance.get('/cook-service/cook/get-cook-category', {
        params: {
          category,
          pageNo: 1,
          numOfRows: 5,
        },
      });
      if (res.data.success) {
        setCookList(res.data.data);
      } else {
        setCookList([]);
      }
    } catch (e) {
      setCookList([]);
    }
  };

  // 마운트 시 전체 자동 조회
  useEffect(() => {
    fetchCategory('전체');
    // eslint-disable-next-line
  }, []);

  // 최신순 버튼 접근성 핸들러
  const handleLatestKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      fetchLatest(selectedCategory);
    }
  };
  // 주문량순 버튼 접근성 핸들러
  const handlePopularKeyDown = e => {
    if (selectedCategory === '전체' && (e.key === 'Enter' || e.key === ' ')) {
      fetchPopular();
    }
  };

  // 더보기 버튼 클릭 시 해당 카테고리 목록 페이지로 이동
  const handleMoreClick = () => {
    if (selectedCategory && selectedCategory !== '전체') {
      const categoryCode = CATEGORY_MAP[selectedCategory];
      navigate(`/category?category=${categoryCode}`);
    }
  };

  // 요리 카드 클릭 시 상세페이지로 이동
  const handleCookClick = cook => {
    const id = cook.cookId || cook.id;
    if (id) {
      navigate(`/product?id=${id}`);
    }
  };

  return (
    <div className={styles.CategorySelection}>
      <div className={styles.categorytopselection}>
        <h3>카테고리 분류</h3>
        <label htmlFor="filter" className={styles.switch} aria-label="Toggle Filter">
          <input type="checkbox" id="filter" />
          <span
            style={{ cursor: 'pointer', fontWeight: 'bold', color: '#ffffff' }}
            onClick={() => fetchLatest(selectedCategory)}
            tabIndex={0}
            role="button"
            aria-label="최신순 정렬"
            onKeyDown={handleLatestKeyDown}
          >
            최신순
          </span>
          <span
            style={{
              cursor: selectedCategory === '전체' ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              color: selectedCategory === '전체' ? '#ffffff' : '#aaa',
            }}
            onClick={selectedCategory === '전체' ? fetchPopular : undefined}
            tabIndex={selectedCategory === '전체' ? 0 : -1}
            role="button"
            aria-label="주문량순 정렬"
            aria-disabled={selectedCategory !== '전체'}
            onKeyDown={handlePopularKeyDown}
          >
            주문량순
          </span>
        </label>
      </div>

      <div className={styles.selectbuttonzone}>
        {CATEGORY_LIST.map(kor => (
          <button
            type="button"
            key={kor}
            className={styles.btn23}
            onClick={() => fetchCategory(kor)}
            style={selectedCategory === kor ? { background: '#eee' } : {}}
          >
            <span className={styles.text}>{kor}</span>
            <span aria-hidden className={styles.marquee}>
              {kor}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.categorybottomselection}>
        {cookList.length === 0 ? (
          <div style={{ gridColumn: '1 / 6', textAlign: 'center' }}>검색 결과가 없습니다.</div>
        ) : (
          cookList.slice(0, 5).map((cook, idx) => {
            const id = cook.cookId || cook.id;
            return (
              <div
                key={id || idx}
                className={`${styles.gridItem} ${styles[`grid${idx + 1}`]}`}
                onClick={() => handleCookClick(cook)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') handleCookClick(cook);
                }}
                tabIndex={0}
                role="button"
                aria-label={`${cook.cookName || cook.name} 상세페이지로 이동`}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={cook.thumbnail}
                  className={styles.cookThumbnail}
                  alt={cook.cookName || cook.name}
                />
                <div className={styles.cooknametitle}>
                  <p className={styles.realtitle}>{cook.cookName || cook.name}</p>
                </div>
                {cook.orderCount !== undefined && <div>주문수: {cook.orderCount}</div>}
              </div>
            );
          })
        )}
      </div>

      {/* 더보기 버튼: 전체 카테고리에서는 숨김, 카테고리별일 때만 보임 */}
      {selectedCategory !== '전체' && (
        <div className={styles.learnmoreBtnWrap}>
          <button className={styles.learnmore} onClick={handleMoreClick} type="button">
            <span className={styles.circle} aria-hidden="true">
              <span className={`${styles.icon} ${styles.arrow}`} />
            </span>
            <span className={styles.buttontext}>더보기</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default CategorySelection;
