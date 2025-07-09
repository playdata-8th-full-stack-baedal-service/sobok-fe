import React from 'react';
import ModalWrapper from '../../../common/modals/ModalWrapper';
// import styles from './NewPWModal.module.scss';

function NewPWModal({ onClose, authId }) {
  return (
    <ModalWrapper title="새 비밀번호 설정" onClose={onClose}>
      <div> </div>
    </ModalWrapper>
  );
}

export default NewPWModal;
