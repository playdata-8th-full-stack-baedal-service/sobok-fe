import React, { useState } from 'react';
import ModalWrapper from '@/common/modals/ModalWrapper';
import styles from '../RecipeRegistPage.module.scss';
import axiosInstance from '@/services/axios-config';
import useToast from '@/common/hooks/useToast';

function IngredientRegisterModal({ onClose, initialIngreName = '', ...props }) {
  const [formData, setFormData] = useState({
    ingreName: initialIngreName.trim(),
    price: '', // 빈 값 허용
    origin: '',
    unit: '', // 빈 값 허용
  });

  const { showSuccess } = useToast();
  const { showNegative } = useToast();
  const { showInfo } = useToast();

  const handleInputChange = e => {
    const { name, value } = e.target;

    if (name === 'price') {
      const numeric = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, price: numeric }));
      return;
    }
    if (name === 'unit') {
      const numeric = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, unit: numeric }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const ingreName = (formData.ingreName || '').trim();
    const origin = (formData.origin || '').trim();
    const priceInt = parseInt(formData.price, 10);
    const unitInt = parseInt(formData.unit, 10);

    if (!ingreName || !formData.price || !origin || !formData.unit) {
      showNegative('모든 필드를 입력해주세요.');
      return;
    }
    if (!Number.isInteger(priceInt) || priceInt <= 0) {
      showNegative('가격은 1 이상의 숫자를 입력해주세요.');
      return;
    }
    if (!Number.isInteger(unitInt) || unitInt <= 0) {
      showNegative('단위는 1 이상의 숫자를 입력해주세요.');
      return;
    }

    try {
      const requestData = { ingreName, origin, price: priceInt, unit: unitInt };
      const response = await axiosInstance.post(`/cook-service/ingredient/register`, requestData);

      if (response.data?.success) {
        const newIngredient = response.data.data; // 서버가 반환한 신규 식재료
        showSuccess('식재료가 등록되었습니다.');

        // 1) 부모 콜백으로도 전달(있으면)
        if (props.onSuccess) props.onSuccess(newIngredient);

        // 2) 전역 이벤트로 검색창에 알림(리셋 + 자동 추가)
        try {
          window.dispatchEvent(new CustomEvent('INGREDIENT_REGISTERED', { detail: newIngredient }));
        } catch (_) {}

        // 3) 모달 닫기
        if (onClose) onClose();
      } else {
        showNegative(response.data?.message || '식재료 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      showNegative('식재료 등록에 실패했습니다.');
    }
  };

  return (
    <ModalWrapper title="식재료 등록" onClose={onClose} size="lg">
      <div className={styles.ingredientRegisterModal}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label>
              식재료명 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="ingreName"
              value={formData.ingreName || ''}
              placeholder="식재료명을 입력하세요"
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formField}>
            <label>
              가격 <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="가격을 입력하세요"
              min="0"
              style={{ height: '35px' }}
            />
          </div>

          <div className={styles.formField}>
            <label>
              원산지 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
              placeholder="원산지를 입력하세요"
            />
          </div>

          <div className={styles.formField}>
            <label>
              단위 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              placeholder="단위를 입력하세요 (숫자만)"
            />
          </div>

          <div className={styles.buttonsGroup}>
            <button
              type="button"
              onClick={() => onClose && onClose()}
              className={styles.cancelButton}
            >
              취소
            </button>
            <button type="submit" className={styles.submitButton}>
              등록
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}

export default IngredientRegisterModal;
