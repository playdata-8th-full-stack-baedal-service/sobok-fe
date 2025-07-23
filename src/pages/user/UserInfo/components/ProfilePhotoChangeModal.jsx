import React, { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import styles from './ProfilePhotoChangeModal.module.scss';
import useToast from '@/common/hooks/useToast';

function ProfilePhotoChangeModal({ currentPhoto, onSubmit, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(currentPhoto || '/photodefault.svg');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { showSuccess, showNegative, showInfo } = useToast();

  const handleFileSelect = e => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 유효성 검사
    if (!file.type.startsWith('image/')) {
      showNegative('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNegative('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = e => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      showNegative('변경할 이미지를 선택해주세요.');
      return;
    }

    setIsUploading(true);
    try {
      await onSubmit(selectedFile);
    } catch (error) {
      console.error('프로필 사진 변경 실패:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setImagePreview(currentPhoto || '/photodefault.svg');
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>프로필 사진 변경</h2>
          <button type="button" className={styles.closeButton} onClick={handleCancel}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.imagePreviewSection}>
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt="프로필 미리보기" />
            </div>
            <div className={styles.imageUpload}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className={styles.selectButton}
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={20} />
                이미지 선택
              </button>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={isUploading}
            >
              취소
            </button>
            <button
              type="button"
              className={styles.confirmButton}
              onClick={handleSubmit}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? '업로드 중...' : '변경하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePhotoChangeModal;
