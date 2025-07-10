import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import style from './RecipeRegistPage.module.scss';
import axiosInstance from '../../../services/axios-config';
import ImageandOverview from './units/ImageandOverview';
import IngredientsSelection from './units/IngredientsSelection';
import RecipeSelection from './units/RecipeSelection';
import CategorySelectModal from './units/CategorySelectModal';
import { closeModal } from '../../../store/modalSlice';

function RecipeRegistPage() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    allergy: '',
    recipe: '',
    category: '',
    thumbnailUrl: '',
    ingredients: [],
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [resetSignal, setResetSignal] = useState(0);
  const modalType = useSelector(state => state.modal.modalType);
  const modalProps = useSelector(state => state.modal.modalProps);

  // 모달이 닫힐 때마다 resetSignal 갱신
  useEffect(() => {
    if (modalType === null) {
      // setResetSignal(Date.now()); // 사용하지 않음
    }
  }, [modalType]);

  const handleChangeInput = e => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = file => {
    setSelectedFile(file);
  };

  const handleIngredientsChange = useCallback(ingredients => {
    setFormData(prev => ({
      ...prev,
      ingredients,
    }));
  }, []);

  const getPresignUrl = async fileName => {
    try {
      const response = await axiosInstance.get(`/api-service/api/presign`, {
        params: {
          fileName,
          category: 'food',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data.data);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Presigned URL 생성 실패했을때 이게 뜹니다.');
    } catch (err) {
      console.error('Presigned URL 요청 실패 시 이게 뜹니다.:', err);
      throw err;
    }
  };

  const uploadToS3 = async (presignUrl, file) => {
    try {
      const response = await fetch(presignUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      console.log(response.data);
      if (!response.ok) {
        throw new Error(
          `S3 업로드 실패일 경우 이게 뜹니다. ${response.status} ${response.statusText}`
        );
      }

      const uploadUrl = presignUrl.split('?')[0];
      return uploadUrl;
    } catch (err) {
      console.error('S3 업로드 오류시 이게 뜹니다', err);
      throw err;
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      allergy: '',
      recipe: '',
      category: '',
      thumbnailUrl: '',
      ingredients: [],
    });
    setSelectedFile(null);
    setResetSignal(Date.now()); // 선택된 식재료, 검색어 모두 초기화
  };

  const handleResetClick = () => {
    resetForm();
    // setResetSignal(Date.now()); // 사용하지 않음
  };

  const vaildSection = () => {
    if (
      !formData.name ||
      !formData.allergy ||
      !formData.ingredients ||
      !formData.category ||
      !formData.recipe ||
      !formData.thumbnailUrl
    ) {
      console.log('필수 항목을 입력하지 않음');
      return false;
    }

    if (!formData.name.trim()) {
      console.log('이름을 빈값으로 넣었을 때, 이게 뜹니다.');
      alert('요리 이름을 입력하세요.');
      return false;
    }

    if (!formData.allergy.trim()) {
      console.log('알러지 칸을 빈값으로 넣었을 때, 이게 뜹니다.');
      alert('알러지 목록을 입력하세요.');
      return false;
    }

    if (!formData.category.trim()) {
      console.log('카테고리를 선택하지 않았을 때, 이게 뜹니다.');
      alert('카테고리를 선택하세요.');
      return false;
    }

    if (formData.ingredients.length <= 0) {
      console.log('선택된 식재료가 없을 때, 이게 뜹니다.');
      alert('식재료를 등록하세요.');
      return false;
    }

    if (!formData.recipe.trim()) {
      console.log('등록된 레시피가 없을 때, 이게 뜹니다.');
      alert('레시피를 작성하세요.');
      return false;
    }

    if (!formData.thumbnailUrl.trim()) {
      console.log('썸네일 사진을 등록하지 않을 때, 이게 뜹니다.');
      alert('사진을 등록해주세요.');
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!vaildSection) {
      return;
    }

    try {
      const submitData = { ...formData };
      if (selectedFile) {
        const presignedUrl = await getPresignUrl(selectedFile.name);
        const uploadedUrl = await uploadToS3(presignedUrl, selectedFile);
        submitData.thumbnailUrl = uploadedUrl;
      }
      console.log(submitData);
      const response = await axiosInstance.post('/cook-service/cook/cook-register', submitData);
      console.log(response.data);
      if (response.data.success) {
        // 성공 시 추가 동작 필요하면 여기에 작성
      }
      // 실패 시 메시지 처리
    } catch (err) {
      alert('레시피 등록 실패!');
      console.log(err.response?.data?.message);
    }
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  return (
    <form onSubmit={handleSubmit}>
      <ImageandOverview
        formData={formData}
        onChange={handleChangeInput}
        onFileSelect={handleFileSelect}
      />
      <IngredientsSelection
        formData={formData}
        onChange={handleChangeInput}
        onIngredientsChange={handleIngredientsChange}
        resetSignal={resetSignal}
      />
      <RecipeSelection formData={formData} onChange={handleChangeInput} />
      <div className={style.buttonGroup}>
        <button type="button" onClick={handleResetClick} className={style.cleatbutton}>
          취소
        </button>
        <button type="submit" className={style.uploadbutton}>
          업로드
        </button>
      </div>
      {/* 카테고리 선택 모달 직접 렌더링 */}
      {modalType === 'CATEGORY_SELECT' && (
        <CategorySelectModal
          onClose={handleCloseModal}
          formData={modalProps?.formData || formData}
          onChange={handleChangeInput}
        />
      )}
    </form>
  );
}

export default RecipeRegistPage;
