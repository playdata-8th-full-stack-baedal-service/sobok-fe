import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FindIDModal from '../../pages/auth/FindID/FindIDModal';
import YourIDIsModal from '../../pages/auth/FindID/YourIDisModal';

import WithdrawalModal from '../../pages/user/Info/component/Delete/WithdrawalModal';
import AddrConfirmModal from '../../pages/user/Info/component/Address/AddrConfirmModal';
import FindPWModal from '../../pages/auth/FindPW/FindPWModal';
import PWChangedModal from '../../pages/auth/FindPW/PWChangedModal';
import { closeModal } from '../../store/modalSlice';
import CategorySelectModal from '../../pages/admin/RecipeRegeister/units/CategorySelectModal';
import IngredientRegisterModal from '../../pages/admin/RecipeRegeister/units/ingredientRegisterModal';
import DeleteConfilmModal from '../../pages/user/Info/component/Delete/DeleteConfilmModal';
import RecipeModal from '../../pages/user/All/Product/modals/RecipeModal';
import MyOrderDetailPage from '../../pages/user/UserOptions/MyOrderDetail/MyOrderDetailPage';
import UserPasswordChangeModal from '../../pages/user/Info/component/UserPasswordChangeModal';
import AdminOrderDetailModal from '../../pages/admin/AllOrder/modals/AdminOrderDetailModal';
import RecoveryConfirmModal from '../../pages/auth/Recovery/RecoveryConfirmModal';
import ShopOrderDetailModal from '../../pages/hub/Main/modals/ShopOrderDetailModal';
import PayAddressChange from '../../pages/user/CartPay/component/pay/PayAddressChange';

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

    case 'NEW_PW':
      return <NewPWModal onClose={handleClose} />;
    case 'PW_CHANGED':
      return <PWChangedModal onClose={handleClose} />;
    case 'DEL_USER':
      return <DeleteConfilmModal onClose={handleClose} />;
    case 'RECIPE':
      return <RecipeModal onClose={handleClose} recipe={modalProps.recipe} />;
    case 'ORDER_DETAIL':
      return <MyOrderDetailPage onClose={handleClose} order={modalProps.order} />;
    case 'USER_INFO_PASSWORD_CHANGE':
      return <UserPasswordChangeModal onClose={handleClose} />;
    case 'ADMIN_ORDER_DETAIL':
      return <AdminOrderDetailModal onClose={handleClose} order={modalProps.order} />;
    case 'USER_RESTORE':
      return <RecoveryConfirmModal onClose={handleClose} {...modalProps} />;
    case 'SHOP_ORDER_DETAIL':
      return <ShopOrderDetailModal onClose={handleClose} order={modalProps.order} />;
    default:
      return null;
  }
}

export default ModalController;
