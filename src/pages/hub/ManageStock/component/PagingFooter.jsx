/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageNo } from '../../../../store/stockSlice';
import styles from '../ManageStock.module.scss';
import Button from '../../../../common/components/Button';

const PagingFooter = () => {
  const dispatch = useDispatch();
  const { pageNo, maxPageNo } = useSelector(state => state.stock);
  return (
    <div className={styles.pagingFooter}>
      <Button onClick={() => dispatch(setPageNo(1))}>{'<<'}</Button>
      <Button onClick={() => dispatch(setPageNo(pageNo - 1))}>{'<'}</Button>
      <span>{pageNo}</span>
      <Button onClick={() => dispatch(setPageNo(pageNo + 1))}>{'>'}</Button>
      <Button onClick={() => dispatch(setPageNo(maxPageNo))}>{'>>'}</Button>
    </div>
  );
};

export default PagingFooter;
