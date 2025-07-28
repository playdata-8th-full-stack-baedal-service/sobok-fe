/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
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
  const [sortByOrder, setSortByOrder] = useState(false);
  const navigate = useNavigate();

  // 최신순 데이터 불러오기 (프론트에서 카테고리 필터링)
  const fetchLatest = async () => {
    try {
      console.log(selectedCategory);
      console.log(sortByOrder ? 'order' : null);
      const res = await axiosInstance.get('/cook-service/cooks', {
        params: {
          pageNo: 1,
          numOfRows: 5,
          category: selectedCategory === '전체' ? null : CATEGORY_MAP[selectedCategory],
          sort: sortByOrder ? 'order' : null,
        },
      });
      setCookList(res.data.data);
    } catch (e) {
      setCookList([]);
    }
  };

  useEffect(() => {
    fetchLatest();
  }, [selectedCategory, sortByOrder, fetchLatest]);

  // 카테고리별 데이터 불러오기 함수 (axiosInstance)
  const fetchCategory = async korCategory => {
    setSelectedCategory(korCategory);
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
            tabIndex={0}
            role="button"
            aria-label="최신순 정렬"
            onClick={() => {
              setSortByOrder(prev => !prev);
            }}
          >
            최신순
          </span>
          <span
            style={{
              fontWeight: 'bold',
              color: selectedCategory === '전체' ? '#ffffff' : '#aaa',
            }}
            tabIndex={selectedCategory === '전체' ? 0 : -1}
            role="button"
            aria-label="주문량순 정렬"
            aria-disabled={selectedCategory !== '전체'}
            onClick={() => {
              setSortByOrder(prev => !prev);
            }}
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
