import React from 'react';
import DuplicateCheckInput from '@/common/components/DuplicateCheckInput';

function ShopNameDuplicateCheckInput({
  value,
  onChange,
  onCheck,
  loading,
  isChecked,
  isAvailable,
  error,
}) {
  return (
    <DuplicateCheckInput
      label="지점 이름"
      value={value}
      onChange={onChange}
      onCheck={onCheck}
      loading={loading}
      success={isChecked && isAvailable ? '✓ 사용 가능한 지점명 입니다!' : ''}
      error={error}
      placeholder="지점명을 입력하세요"
      buttonLabel="중복 확인"
      inputId="shopName"
    />
  );
}

export default ShopNameDuplicateCheckInput;
