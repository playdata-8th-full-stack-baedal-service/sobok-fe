import React from 'react';
import styles from '../UserInfoPage.module.scss';

function EditableField({
  label,
  value,
  isEditing,
  onEdit,
  onCancel,
  onConfirm,
  children,
  error,
  disabled = false,
  hideActions = false,
}) {
  return (
    <div className={styles.formField}>
      <label htmlFor={label}>{label}</label>
      <div className={styles.fieldValue}>
        {isEditing ? (
          <div className={styles.editingField}>
            {children}
            {!hideActions && (
              <div className={styles.editActions}>
                <button type="button" onClick={onConfirm} className={styles.confirmBtn}>
                  확인
                </button>
                <button type="button" onClick={onCancel} className={styles.cancelBtn}>
                  취소
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.fieldWithButton}>
            <span className={disabled ? styles.disabledText : ''}>{value || '정보 없음'}</span>
            {!disabled && (
              <button type="button" onClick={onEdit} className={styles.changeBtn}>
                {value ? '변경' : '추가'}
              </button>
            )}
          </div>
        )}
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
}

export default EditableField;
