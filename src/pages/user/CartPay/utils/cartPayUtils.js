import { calculateItemTotal } from '../../../../common/utils/cartUtils';

/* eslint-disable import/prefer-default-export */
export const calculateTotalPrice = (cartItems, selectedCartItems) => {
  return cartItems
    .filter(i => selectedCartItems.includes(i.id))
    .reduce((sum, item) => sum + calculateItemTotal(item), 0);
};
