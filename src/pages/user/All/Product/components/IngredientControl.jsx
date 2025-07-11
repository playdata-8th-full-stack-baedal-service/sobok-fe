/* eslint-disable react/function-component-definition */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styles from '../ProductPage.module.scss';
import Button from '../../../../../common/components/Button';
import { setAdditionalIngredients } from '../../../../../store/productSlice';

const IngredientControl = ({ item }) => {
  const dispatch = useDispatch();
  const { additionalIngredients, portion } = useSelector(state => state.product);

  const handleQuantityChange = async (id, newQuantity) => {
    await dispatch(
      setAdditionalIngredients(
        additionalIngredients.map(ingredient =>
          ingredient.id === id ? { ...ingredient, quantity: newQuantity } : ingredient
        )
      )
    );

    console.log(additionalIngredients);
  };

  return (
    <div className={styles.ingredientControl}>
      <span className={styles.ingredientName}>{item.ingreName}</span>
      <div className={styles.quantityControl}>
        <Button
          className={styles.qtyButton}
          onClick={() => handleQuantityChange(item.id, item.quantity - +item.unit)}
          disabled={item.quantity <= +item.unit}
        >
          -
        </Button>
        <span className={styles.ingredientQty}>{item.quantity} g</span>
        <Button
          className={styles.qtyButton}
          onClick={() => handleQuantityChange(item.id, item.quantity + +item.unit)}
        >
          +
        </Button>
      </div>

      <span className={styles.totalQty}>(총 {item.quantity * portion}g)</span>
      <Button
        className={styles.removeButton}
        onClick={() =>
          dispatch(
            setAdditionalIngredients(
              additionalIngredients.filter(ingredient => ingredient.id !== item.id)
            )
          )
        }
      >
        x
      </Button>
    </div>
  );
};

IngredientControl.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ingreName: PropTypes.string.isRequired,
    unit: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default IngredientControl;
