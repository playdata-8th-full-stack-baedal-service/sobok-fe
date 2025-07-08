import React from 'react';
import style from '../RecipeRegistPage.module.scss';

function ImageandOverview({name}) {
  return (
    <div className={style.ImageandOverview}>
      <div className={style.imageselection}>
        <img src="#" />
        <button>추가하기</button>
      </div>

      <div className={style.overviewselection}>
        <input className={style.nameselection} type="text" name={name} placeholder="음식이름을 입력하세요" />
        <div>
          <button className={style.categoryselection}>카테고리</button>
        </div>
        <textarea rows={17} cols={100} name="allergy" placeholder="알레르기 정보를 입력하세요" />
      </div>
    </div>
  );
}

export default ImageandOverview;
