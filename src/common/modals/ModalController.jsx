import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FindIDModal from '../../pages/auth/FindID/FindIDModal';
import YourIDIsModal from '../../pages/auth/FindID/YourIDisModal';
// import FindPWModal from '../../pages/auth/FindPW/FindPWModal';
// import NewPWModal from '../../pages/auth/FindPW/NewPWModal';
// 모달들은 모두 추가해두어야함

import { closeModal } from '../../store/modalSlice';

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
    // case 'FIND_PW':
    //   return <FindPWModal onClose={handleClose} />;
    // case 'NEW_PW':
    //   return <NewPWModal onClose={handleClose} />;
    default:
      return null;
  }
}

export default ModalController;
