import React from 'react';
import ModalWrapper from '@/common/modals/ModalWrapper';
import style from '../RecipeRegistPage.module.scss';

function CategorySelectModal({ onClose, formData, onChange }) {
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
            {category.categoryName}
          </button>
        ))}
      </div>
    </ModalWrapper>
  );
}

export default CategorySelectModal;
