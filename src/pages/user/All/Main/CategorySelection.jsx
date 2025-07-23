import React from 'react';
import styles from './MainPage.module.scss';

function CategorySelection() {

  
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
        <button type="button" className={styles.btn23}>
          <span className={styles.text}>한식</span>
          <span aria-hidden className={styles.marquee}>
            한식
          </span>
        </button>
        <button type="button" className={styles.btn23}>
          <span className={styles.text}>일식</span>
          <span aria-hidden className={styles.marquee}>
            일식
          </span>
        </button>
        <button type="button" className={styles.btn23}>
          <span className={styles.text}>중식</span>
          <span aria-hidden className={styles.marquee}>
            중식
          </span>
        </button>
        <button type="button" className={styles.btn23}>
          <span className={styles.text}>양식</span>
          <span aria-hidden className={styles.marquee}>
            양식
          </span>
        </button>
        <button type="button" className={styles.btn23}>
          <span className={styles.text}>간식</span>
          <span aria-hidden className={styles.marquee}>
            간식
          </span>
        </button>
        <button type="button" className={styles.btn23}>
          <span className={styles.text}>야식</span>
          <span aria-hidden className={styles.marquee}>
            야식
          </span>
        </button>
      </div>

      <div className={styles.categorybottomselection}>
        <div className={styles.grid1}>1</div>
        <div className={styles.grid2}>2</div>
        <div className={styles.grid3}>3</div>
        <div className={styles.grid4}>4</div>
        <div className={styles.grid5}>5</div>
      </div>

      <button>더보기</button>
    </div>
  );
}

export default CategorySelection;
