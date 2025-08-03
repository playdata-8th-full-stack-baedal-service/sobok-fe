/* eslint-disable react/function-component-definition */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import {
  setFilterQuantity,
  setFilterRetain,
  setMinStock,
  setMaxStock,
  setKeyword,
  setNumOfRows,
} from '../../../../store/stockSlice';
import styles from '../ManageStock.module.scss';
import CheckBox from './CheckBox';
import RadioInput from './RadioInput';

const ManageStockHeader = () => {
  const dispatch = useDispatch();
  const { filterQuantity, filterRetain, minStock, maxStock, keyword, numOfRows } = useSelector(
    state => state.stock
  );

  return (
    <>
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>재고 관리</h2>
        <div className={styles.radioContainer}>
          <RadioInput checked={numOfRows === 10} value="10" name="numOfRows" />
          <RadioInput checked={numOfRows === 20} value="20" name="numOfRows" />
          <RadioInput checked={numOfRows === 50} value="50" name="numOfRows" />
        </div>
      </div>
      <div className={styles.manageStockHeader}>
        {/* 검색 */}
        <div className={styles.searchContainer}>
          <Search />
          <input
            type="text"
            placeholder="식재료를 검색해주세요."
            value={keyword}
            className={styles.searchInput}
            onChange={e => dispatch(setKeyword(e.target.value))}
          />
        </div>
        {/* 식재료 재고량 필터링 */}
        <div className={styles.container}>
          <CheckBox checked={filterQuantity} onChange={() => dispatch(setFilterQuantity())} />
          <input
            type="number"
            className={styles.numberInput}
            placeholder="수량"
            value={minStock}
            onChange={e => dispatch(setMinStock(e.target.value))}
          />
          <div>이상 </div>
          <input
            type="number"
            className={styles.numberInput}
            placeholder="수량"
            value={maxStock}
            onChange={e => dispatch(setMaxStock(e.target.value))}
          />
          <div>이하</div>
        </div>

        {/* 보유중인 식재료 필터링 */}
        <div className={styles.container}>
          <CheckBox checked={filterRetain} onChange={() => dispatch(setFilterRetain())} />
          <div>보유중</div>
        </div>
      </div>
    </>
  );
};

export default ManageStockHeader;
