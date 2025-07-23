/* eslint-disable react/function-component-definition */
import React from 'react';
import ModalWrapper from '../../../../../common/modals/ModalWrapper';
import styles from './RecipeModal.module.scss'; // SCSS 연결

const RecipeModal = ({ onClose, recipe }) => {
  return (
    <ModalWrapper title="레시피" onClose={onClose}>
      <div className={styles.tiptap} dangerouslySetInnerHTML={{ __html: recipe }} />
    </ModalWrapper>
  );
};

export default RecipeModal;
