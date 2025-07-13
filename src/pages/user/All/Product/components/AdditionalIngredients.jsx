/* eslint-disable react/function-component-definition */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../ProductPage.module.scss';
import IngredientControl from './IngredientControl';
import {
  fetchAdditionalIngredients,
  setAdditionalIngredients,
  setSearchQuery,
} from '../../../../../store/productSlice';

const AdditionalIngredients = () => {
  const dispatch = useDispatch();
  const { additionalIngredients, searchQuery } = useSelector(state => state.product);

  const [keyword, setKeyword] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = e => {
    setKeyword(e.target.value);
    if (e.target.value.length < 1) {
      dispatch(setSearchQuery([]));
      return;
    }

    dispatch(fetchAdditionalIngredients(e.target.value));
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (keyword.length < 1) return;

    dispatch(fetchAdditionalIngredients(keyword));
  };

  const handleBlur = () => {
    setIsFocused(false);
    setSearchQuery([]);
  };

  const handleIngredientClick = item => {
    if (!additionalIngredients.find(ingredient => ingredient.id === item.id)) {
      dispatch(
        setAdditionalIngredients([...additionalIngredients, { ...item, quantity: +item.unit }])
      );
    }

    setKeyword('');
    dispatch(setSearchQuery([]));
  };

  return (
    <div className={styles.additionalIngredients}>
      <h3>
        <strong>추가 식재료</strong>
      </h3>
      <h3>추가 식재료는 1인분 기준으로 추가해주세요.</h3>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="식재료를 입력하세요"
          onChange={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={keyword}
        />
      </div>
      {isFocused && (
        <div className={styles.searchResultContainer}>
          <ul className={styles.searchResult}>
            {searchQuery?.length > 0 &&
              searchQuery.map((item, idx) => (
                <button
                  key={item.id || idx}
                  onMouseDown={() => handleIngredientClick(item)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleIngredientClick(item);
                    }
                  }}
                  type="button"
                  className={
                    additionalIngredients.find(ingredient => ingredient.id === item.id)
                      ? styles.searchItemSelected
                      : styles.searchItem
                  }
                >
                  {item.ingreName}
                </button>
              ))}
          </ul>
        </div>
      )}
      <div className={styles.ingredientGrid}>
        {additionalIngredients?.map((item, idx) => (
          <IngredientControl key={item.id || idx} item={item} />
        ))}
      </div>
    </div>
  );
};

export default AdditionalIngredients;
