import React, { useState } from 'react';
import ModalWrapper from '@/common/modals/ModalWrapper';

function AddrConfirmModal({
  onClose,
  onConfirm,
  isUpdating,
  targetAddressId,
  selectedAddress,
  initialDetailAddress,
}) {
  const [detailAddress, setDetailAddress] = useState(initialDetailAddress || '');

  const handleConfirm = () => {
    onConfirm(detailAddress);
  };

  return (
    <ModalWrapper
      title={targetAddressId ? '주소 변경 확인' : '주소 추가 확인'}
      onClose={onClose}
      size="md"
    >
      <div>
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: 0, fontWeight: 600 }}>선택된 주소:</h4>
          <p style={{ fontSize: '16px', margin: '10px 0' }}>
            [{selectedAddress?.zonecode}] {selectedAddress?.roadFull}
          </p>
          <div style={{ marginTop: '10px' }}>
            <label
              htmlFor="detailAddress"
              style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}
            >
              상세주소
            </label>
            <input
              id="detailAddress"
              type="text"
              value={detailAddress}
              onChange={e => setDetailAddress(e.target.value)}
              placeholder="상세주소를 입력하세요 (선택사항)"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                marginBottom: '10px',
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isUpdating}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.3s ease',
            }}
          >
            {isUpdating
              ? targetAddressId
                ? '변경 중...'
                : '추가 중...'
              : targetAddressId
                ? '확인'
                : '추가'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.3s ease',
            }}
          >
            취소
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default AddrConfirmModal;
