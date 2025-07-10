/**
 * 카트 아이템의 총 가격을 계산합니다.
 * @param {Object} item - 카트 아이템 객체
 * @param {Array} item.baseIngredients - 재료 배열
 * @param {number} item.quantity - 수량
 * @returns {number} 총 가격
 */
export const calculateItemTotal = item => {
  const ingreList = [...item.baseIngredients, ...item.additionalIngredients];
  const ingredientsTotal = ingreList.reduce(
    (sum, ing) => sum + ing.unitQuantity * ing.price * ing.unit,
    0
  );
  return ingredientsTotal * item.quantity;
};

/**
 * 재료의 총 무게를 계산합니다.
 * @param {Object} ingredient - 재료 객체
 * @param {number} ingredient.unitQuantity - 단위 수량
 * @param {number} ingredient.unit - 단위
 * @returns {number} 총 무게
 */
export const calculateIngredientWeight = ingredient => {
  return ingredient.unitQuantity * ingredient.unit;
};

/**
 * 재료의 총 가격을 계산합니다.
 * @param {Object} ingredient - 재료 객체
 * @returns {number} 총 가격
 */
export const calculateIngredientTotal = ingredient => {
  const totalWeight = calculateIngredientWeight(ingredient);
  return totalWeight * ingredient.price;
};
