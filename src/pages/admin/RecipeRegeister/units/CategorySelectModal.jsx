import React from 'react';
import { useDispatch } from 'react-redux';
import ModalWrapper from '@/common/modals/ModalWrapper';
import { setCategory } from '@/store/categorySlice';
import style from '../RecipeRegistPage.module.scss';

function CategorySelectModal({ onClose, formData, onChange }) {
  const dispatch = useDispatch();

  const categoryList = [
    {
      categoryName: '한식',
      categoryPostName: 'KOREAN',
    },
    {
      categoryName: '중식',
      categoryPostName: 'CHINESE',
    },
    {
      categoryName: '일식',
      categoryPostName: 'JAPANESE',
    },
    {
      categoryName: '양식',
      categoryPostName: 'WESTERN',
    },
    {
      categoryName: '간식',
      categoryPostName: 'SNACK',
    },
    {
      categoryName: '야식',
      categoryPostName: 'LATE_NIGHT',
    },
  ];

  const handleSelect = category => {
    // Redux store에 카테고리 저장
    dispatch(setCategory(category.categoryPostName));

    // 기존 onChange도 호출 (백업용)
    if (onChange) {
      onChange({
        target: {
          name: 'category',
          value: category.categoryPostName,
        },
      });
    }
    onClose();
  };

  return (
    <ModalWrapper title="카테고리 선택" onClose={onClose}>
      <div className={style.cateryList}>
        {categoryList.map((category, index) => (
          <button
            key={index}
            type="button"
            className={style.categorybutton}
            onClick={() => handleSelect(category)}
          >
            <span className={style.circle1}></span>
            <span className={style.circle2}></span>
            <span className={style.circle3}></span>
            <span className={style.circle4}></span>
            <span className={style.circle5}></span>
            <span className={style.text}>{category.categoryName}</span>
          </button>
        ))}
      </div>
    </ModalWrapper>
  );
}

export default CategorySelectModal;
