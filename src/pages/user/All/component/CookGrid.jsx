/* eslint-disable react/function-component-definition */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CookCard from './CookCard';
import styles from './CookGrid.module.scss';

const CookGrid = ({ items }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.cookGrid}>
      {items.map(item => (
        <CookCard
          key={item.id}
          item={item}
          onClick={() => {
            navigate(`/user/product?id=${item.id || item.cookId}`);
          }}
        />
      ))}
    </div>
  );
};

export default CookGrid;
