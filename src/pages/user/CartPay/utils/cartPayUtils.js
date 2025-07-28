import { calculateItemTotal } from '../../../../common/utils/cartUtils';

/* eslint-disable import/prefer-default-export */
export const calculateTotalPrice = (cartItems, selectedCartItems) => {
  return cartItems
    .filter(i => selectedCartItems.includes(i.id))
    .reduce((sum, item) => sum + calculateItemTotal(item), 0);
};

export const calculateCartIngredientStockList = (cartItems, selectedCartItems) => {
  const ingredientStockMap = {};

  cartItems
    .filter(item => selectedCartItems.includes(item.id))
    .forEach(item => {
      const allIngredients = [...item.baseIngredients, ...item.additionalIngredients];
      allIngredients.forEach(ingredient => {
        const id = ingredient.ingredientId;
        const quantityToAdd = ingredient.unit * ingredient.unitQuantity * item.quantity;

        if (ingredientStockMap[id]) {
          ingredientStockMap[id] += quantityToAdd;
        } else {
          ingredientStockMap[id] = quantityToAdd;
        }
      });
    });

  return Object.entries(ingredientStockMap).map(([ingredientId, quantity]) => ({
    ingredientId: Number(ingredientId),
    quantity,
  }));
};
