import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '@/store/modalSlice';
import { clearCategory } from '@/store/categorySlice';
import style from '../RecipeRegistPage.module.scss';

function ImageandOverview({ formData, onFileSelect, onChange, resetSignal }) {
  const [imagePreview, setImagePreview] = useState(formData.thumbnailUrl || '/Sobokcookimg.png');
  const dispatch = useDispatch();
  const selectedCategory = useSelector(state => state.category.selected);

  useEffect(() => {
    setImagePreview(formData.thumbnailUrl || '/Sobokcookimg.png');
  }, [formData.thumbnailUrl]);

  // resetSignal이 변경되면 이미지를 기본 이미지로 초기화
  useEffect(() => {
    if (resetSignal > 0) {
      setImagePreview('/Sobokcookimg.png');
    }
  }, [resetSignal]);

  useEffect(() => {
    if (selectedCategory) {
      onChange({
        target: {
          name: 'category',
          value: selectedCategory,
        },
      });
      dispatch(clearCategory());
    }
  }, [selectedCategory, onChange, dispatch]);

  const handleFileSelect = e => {
    const file = e.target.files[0];
    if (!file) {
      console.log('파일 선택하지 않으면 이게 뜹니다.');
      return;
    }

    console.log('선택된 파일의 정보:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    if (!file.type.startsWith('image/')) {
      console.log('이미지 파일이 아니면 이게 뜹니다.');
      showNegative('이미지 파일만 업로드 가능합니다. 다시 시도해주십시요');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      console.log('파일 크기 초과가 되면 이게 뜹니다.');
      showNegative('파일 크기는 5MB 이하여만 합니다. 다시 시도해 주십시요');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      console.log('파일 미리보기 생성 완료되면 이게 뜹니다.');
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    onFileSelect(file);
    e.target.value = '';
  };

  const handleOpenCategoryModal = () => {
    dispatch(
      openModal({
        type: 'CATEGORY_SELECT',
        props: {
          formData,
        },
      })
    );
  };

  const getCategoryDisplayName = categoryValue => {
    const categoryMap = {
      KOREAN: '한식',
      CHINESE: '중식',
      JAPANESE: '일식',
      WESTERN: '양식',
      SNACK: '간식',
      LATE_NIGHT: '야식',
    };
    return categoryMap[categoryValue] || categoryValue;
  };

  // 엔터 키 입력 시 폼 제출 방지
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className={style.ImageandOverview}>
      <div className={style.imageselection}>
        <img src={imagePreview} alt="프로필 미리보기" className={style.thumbnailselection} />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className={style.uploadinput}
          id="uploadimage"
        />
        <label htmlFor="uploadimage">
          <button
            type="button"
            variant="BASIC_SMALL"
            onClick={() => {
              document.getElementById('uploadimage').click();
            }}
            className={style.imageselectbutton}
          >
            이미지 선택
          </button>
        </label>
      </div>

      <div className={style.overviewselection}>
        <input
          className={style.nameselection}
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="음식이름을 입력하세요"
        />
        <div className={style.categorySection}>
          <button
            type="button"
            className={style.categoryselection}
            onClick={handleOpenCategoryModal}
          >
            카테고리
          </button>
          {formData.category && (
            <span className={style.selectedCategory}>
              {getCategoryDisplayName(formData.category)}
            </span>
          )}
        </div>
        <textarea
          rows={17}
          cols={100}
          name="allergy"
          value={formData.allergy}
          onChange={onChange}
          placeholder="알레르기 정보를 입력하세요"
          className={style.allergyselection}
        />
      </div>
    </div>
  );
}

export default ImageandOverview;
