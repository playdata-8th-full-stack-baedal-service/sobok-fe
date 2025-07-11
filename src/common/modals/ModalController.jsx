import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FindIDModal from '../../pages/auth/FindID/FindIDModal';
import YourIDIsModal from '../../pages/auth/FindID/YourIDisModal';

import PasswordConfirmModal from '../../pages/user/UserInfo/components/PasswordConfirmModal';
import PasswordChangeModal from '../../pages/user/UserInfo/components/PasswordChangeModal';
import WithdrawalModal from '../../pages/user/UserInfo/components/WithdrawalModal';
import AddrConfirmModal from '../../pages/user/UserInfo/components/AddrConfirmModal';
import ProfilePhotoChangeModal from '../../pages/user/UserInfo/components/ProfilePhotoChangeModal';
// import FindPWModal from '../../pages/auth/FindPW/FindPWModal';

import FindPWModal from '../../pages/auth/FindPW/FindPWModal';
// import NewPWModal from '../../pages/auth/FindPW/NewPWModal';
import PWChangedModal from '../../pages/auth/FindPW/PWChangedModal';
// 모달들은 모두 추가해두어야함

import { closeModal } from '../../store/modalSlice';
import PayAddressChange from '../../pages/user/Pay/component/PayAddressChange';
import CategorySelectModal from '../../pages/admin/RecipeRegeister/units/CategorySelectModal';
import IngredientRegisterModal from '../../pages/admin/RecipeRegeister/units/ingredientRegisterModal';
import RecipeModal from '../../pages/user/All/Product/modals/RecipeModal';

function ModalController() {
  const { modalType, modalProps } = useSelector(state => state.modal);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  switch (modalType) {
    case 'FIND_ID':
      return <FindIDModal onClose={handleClose} />;
    case 'YOUR_ID':
      return <YourIDIsModal onClose={handleClose} {...modalProps} />;
    case 'PASSWORD_CONFIRM':
      return <PasswordConfirmModal onClose={handleClose} {...modalProps} />;
    case 'PASSWORD_CHANGE':
      return <PasswordChangeModal onClose={handleClose} {...modalProps} />;
    case 'WITHDRAWAL':
      return <WithdrawalModal onClose={handleClose} {...modalProps} />;
    case 'ADDR_CONFIRM':
      return <AddrConfirmModal onClose={handleClose} {...modalProps} />;
    case 'PROFILE_PHOTO_CHANGE':
      return <ProfilePhotoChangeModal onClose={handleClose} {...modalProps} />;
    case 'CATEGORY_SELECT':
      return <CategorySelectModal onClose={handleClose} {...modalProps} />;
    case 'INGREDIENT_REGISTER':
      return <IngredientRegisterModal onClose={handleClose} {...modalProps} />;
    // case 'FIND_PW':
    //   return <FindPWModal onClose={handleClose} />;
    case 'FIND_PW':
      return <FindPWModal onClose={handleClose} />;
    case 'PAY_ADDRESS_CHANGE':
      return <PayAddressChange onClose={handleClose} />;

    // case 'NEW_PW':
    //   return <NewPWModal onClose={handleClose} />;
    case 'PW_CHANGED':
      return <PWChangedModal onClose={handleClose} />;
    case 'RECIPE':
      return <RecipeModal onClose={handleClose} recipe={modalProps.recipe} />;
    default:
      return null;
  }
}

export default ModalController;
