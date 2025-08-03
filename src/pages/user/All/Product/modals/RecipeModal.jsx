/* eslint-disable react/function-component-definition */
import React from 'react';
import ModalWrapper from '../../../../../common/modals/ModalWrapper';
import commonStyles from '../../../../../common/forms/Post/PostContent.module.scss'; // 공통 스타일 불러오기
import styles from './RecipeModal.module.scss'; // 모달 전용 스타일

const RecipeModal = ({ onClose, recipe }) => {
  return (
    <ModalWrapper title="레시피" onClose={onClose} size="long">
      <div className={styles.container}>
        <div
          className={`${styles.tiptap} ${commonStyles.postContent}`}
          dangerouslySetInnerHTML={{ __html: recipe }}
        />
      </div>
    </ModalWrapper>
  );
};

export default RecipeModal;
