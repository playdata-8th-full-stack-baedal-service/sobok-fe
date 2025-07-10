import React from 'react';
import style from '../RecipeRegistPage.module.scss';

function RecipeSelection({ formData, onChange }) {
  return (
    <div className={style.RecipeSelection}>
      <h2 className={style.Recipetitle}>레시피 등록</h2>
      <textarea
        cols={115}
        rows={50}
        className={style.RecipeTextarea}
        name="recipe"
        value={formData.recipe}
        onChange={onChange}
        placeholder="레시피를 입력하세요..."
      />
    </div>
  );
}

export default RecipeSelection;
