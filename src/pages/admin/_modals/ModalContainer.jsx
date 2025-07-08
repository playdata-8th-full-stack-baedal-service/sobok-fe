import React from 'react';
import { createPortal } from 'react-dom';

const ModalContainer = ({ chlidren }) => {
  return createPortal(<>{chlidren}</>, document.getElementById('modal'));
}

export default ModalContainer;
