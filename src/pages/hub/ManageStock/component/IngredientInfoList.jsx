/* eslint-disable no-nested-ternary */
/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchIngredientList,
  fetchStockList,
  setPageNo,
  setItemList,
  registerStock,
  updateStock,
} from '../../../../store/stockSlice';
import Button from '../../../../common/components/Button';
import styles from '../ManageStock.module.scss';
import useToast from '@/common/hooks/useToast';

const IngredientInfoList = () => {
  const [isClick, setIsClick] = useState(-1);
  const [registerQuantity, setRegisterQuantity] = useState(0);

  const { showInfo, showNegative } = useToast();
  const dispatch = useDispatch();
  const {
    itemList,
    ingredientList,
    filterRetain,
    filterKeyword,
    keyword,
    filterQuantity,
    minStock,
    maxStock,
    numOfRows,
    pageNo,
    stockList,
  } = useSelector(state => state.stock);

  useEffect(() => {
    dispatch(fetchStockList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchIngredientList({ hasKeyword: filterKeyword, keyword }));
  }, [stockList, keyword, filterKeyword, dispatch]);

  useEffect(() => {
    let items = ingredientList;
    if (filterRetain) {
      items = items.filter(item => item.active);
    }

    if (filterQuantity) {
      items = items.filter(item => item.quantity >= minStock && item.quantity <= maxStock);
    }

    dispatch(setItemList(items));
  }, [dispatch, ingredientList, filterRetain, filterQuantity, minStock, maxStock, numOfRows]);

  const handleRegisterClick = ingredient => {
    setRegisterQuantity(0);
    if (isClick === ingredient.id) {
      setIsClick(-1);
      return;
    }
    setIsClick(ingredient.id);
  };

  const handleRegister = ingredient => {
    if (registerQuantity === 0) {
      showNegative('발주 수량을 입력해주세요.');
      return;
    }

    if (!ingredient.active) {
      dispatch(registerStock({ ingredient, quantity: registerQuantity }));
    } else {
      dispatch(updateStock({ ingredient, quantity: registerQuantity }));
    }
    showInfo('발주가 완료되었습니다.');
    setIsClick(-1);
  };

  return (
    <div className={styles.ingredientInfoList}>
      <ul className={styles.itemHeader}>
        <span className={styles.name}>식재료 이름</span>
        <span className={styles.quantity}>재고 수량</span>
        <span className={styles.register}>발주/등록</span>
      </ul>
      <hr className={styles.hr2} />
      {itemList
        .map(ingredient => (
          <div className={!ingredient.active ? styles.masking : styles.active}>
            <ul key={ingredient?.ingredientId || ingredient?.id} className={styles.item}>
              <span className={styles.name}>{ingredient?.name}</span>
              <span className={styles.quantity}>{ingredient?.quantity}</span>
              <Button onClick={() => handleRegisterClick(ingredient)}>
                {isClick === -1 || isClick !== ingredient.id
                  ? ingredient?.active
                    ? '발주'
                    : '등록'
                  : '취소'}
              </Button>
            </ul>
            <ul className={isClick === ingredient.id ? styles.registerQuantity : styles.hidden}>
              <span className={styles.instruction}>발주 수량 입력 후 발주 버튼을 눌러주세요.</span>
              <div className={styles.inputContainer}>
                <input
                  type="number"
                  value={registerQuantity}
                  onChange={e => {
                    if (Number(e.target.value) < 0) {
                      showNegative('발주 수량은 0 이상이어야 합니다.');
                      return;
                    }
                    setRegisterQuantity(e.target.value);
                  }}
                />
                <span> g</span>
              </div>
              <Button onClick={() => handleRegister(ingredient)}>발주</Button>
            </ul>
            <hr className={styles.hr} />
          </div>
        ))
        .filter((_, idx) => idx >= (pageNo - 1) * numOfRows && idx < pageNo * numOfRows)}
    </div>
  );
};

export default IngredientInfoList;
