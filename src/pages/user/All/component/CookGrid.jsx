/* eslint-disable react/function-component-definition */
import React from 'react';
import CookCard from './CookCard';
import styles from './CookGrid.module.scss';

const CookGrid = ({ items }) => {
  console.log(items);
  return (
    <div className={styles.cookGrid}>
      {items.map(item => (
        <CookCard item={item} />
      ))}
    </div>
  );
};

export default CookGrid;
