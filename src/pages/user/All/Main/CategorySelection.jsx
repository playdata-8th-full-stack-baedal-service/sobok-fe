import React, { useState, useEffect } from 'react';
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

function CategorySelection() {
  const [cookList, setCookList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('한식');

  // 카테고리별 데이터 불러오기 함수 (axiosInstance)
  const fetchCategory = async korCategory => {
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
      console.log(res.data);
      if (res.data.success) {
        setCookList(res.data.data);
      } else {
        setCookList([]);
      }
    } catch (e) {
      setCookList([]);
    }
  };

  // 마운트 시 한식 자동 조회
  useEffect(() => {
    fetchCategory('한식');
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.CategorySelection}>
      <div className={styles.categorytopselection}>
        <h3>카테고리 분류</h3>
        <label htmlFor="filter" className={styles.switch} aria-label="Toggle Filter">
          <input type="checkbox" id="filter" />
          <span>최신순</span>
          <span>주문량순</span>
        </label>
      </div>

      <div className={styles.selectbuttonzone}>
        {Object.keys(CATEGORY_MAP).map(kor => (
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
          <div style={{ gridColumn: '1 / 6', textAlign: 'center' }}>로딩중입니다...</div>
        ) : (
          cookList.slice(0, 5).map((cook, idx) => (
            <div key={cook.id || idx} className={styles[`grid${idx + 1}`]}>
              <img src={cook.thumbnail} className={styles.cookThumbnail} alt={cook.name} />
              <div>{cook.name}</div>
            </div>
          ))
        )}
      </div>

      <button type="button">더보기</button>
    </div>
  );
}

export default CategorySelection;
