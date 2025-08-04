import React, { useState } from 'react';
import axios from 'axios';
import ModalWrapper from '@/common/modals/ModalWrapper';
import styles from '../RecipeRegistPage.module.scss';
import { API_BASE_URL } from '@/services/host-config';
import axiosInstance from '@/services/axios-config';
import useToast from '@/common/hooks/useToast';

function IngredientRegisterModal({ onClose, initialIngreName = '', ...props }) {
  const [formData, setFormData] = useState({
    ingreName: initialIngreName,
    price: '',
    origin: '',
    unit: '',
  });

  const { showSuccess } = useToast();
  const { showNegative } = useToast();
  const { showInfo } = useToast();

  const handleInputChange = e => {
    const { name, value } = e.target;

    // 가격 필드 특별 처리
    if (name === 'price') {
      // 숫자가 아닌 문자 제거
      const numericValue = value.replace(/[^0-9]/g, '');

      // 빈 문자열이거나 0인 경우 입력 막기
      if (numericValue === '' || numericValue === '0') {
        return;
      }

      // 1 이상의 숫자인 경우만 업데이트
      if (parseInt(numericValue) > 0) {
        setFormData(prev => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else if (name === 'unit') {
      // 숫자만 입력 가능
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      // 다른 필드들은 기존 로직 유지
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // 필수 필드 검증
    if (
      !formData.ingreName.trim() ||
      !formData.price.trim() ||
      !formData.origin.trim() ||
      !formData.unit.trim()
    ) {
      showNegative('모든 필드를 입력해주세요.');
      return;
    }

    // 가격 유효성 검증
    const price = parseInt(formData.price);
    if (price <= 0) {
      showNegative('가격은 0보다 큰 숫자를 입력해주세요.');
      return;
    }

    try {
      // 숫자 필드를 적절한 타입으로 변환
      const requestData = {
        ...formData,
        price: parseInt(formData.price, 10),
      };

      console.log(requestData);

      const response = await axiosInstance.post(`/cook-service/ingredient/register`, requestData);
      console.log(response.data);
      if (response.data.success) {
        showSuccess('식재료가 등록되었습니다.');
        if (onClose) onClose();
      } else {
        showNegative(response.data.message);
      }
    } catch (error) {
      console.error(error);
      console.log(error.response.message);

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
              value={formData.ingreName}
              onChange={handleInputChange}
              placeholder="식재료명을 입력하세요"
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
