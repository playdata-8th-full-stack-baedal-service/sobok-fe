import React from 'react';
import style from '../RecipeRegistPage.module.scss';

function IngredientsSelection() {
  return (
    <div>
      <p>기본 식재료 등록</p>
      <input type="text" placeholder="검색어를 입력하세요" /> {/* 드롭다운 구현이 필요 */}
      <p>식재료 이름이 들어갈 예정</p>
      <input type="number" min={0} step={100} />
    </div>
  );
}

export default IngredientsSelection;
