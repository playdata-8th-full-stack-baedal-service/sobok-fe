/* eslint-disable react/function-component-definition */
import React from 'react';
import ModalWrapper from '../../../../../common/modals/ModalWrapper';
// import styles from './RecipeModal.module.scss';

const RecipeModal = ({ onClose, recipe }) => {
  console.log(recipe);
  return (
    <ModalWrapper title="레시피" onClose={onClose}>
      <div>
        <h3>레시피</h3>
        <p>{recipe}</p>
      </div>
    </ModalWrapper>
  );
};

export default RecipeModal;
