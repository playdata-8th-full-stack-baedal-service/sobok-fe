import React from 'react';
import styles from './MainPage.module.scss';

function CategorySelection() {
  return (
    <div className={styles.CategorySelection}>
      <div className={styles.categorytopselection}>
        <h3>카테고리 분류</h3>
        
      </div>

      <div>
        <button>한식</button>
        <button>중식</button>
        <button>일식</button>
        <button>양식</button>
        <button>간식</button>
        <button>야식</button>
      </div>

      <div>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
      </div>

      <button>더보기</button>
    </div>
  );
}

export default CategorySelection;
