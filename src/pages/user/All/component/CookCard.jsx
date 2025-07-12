/* eslint-disable react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './CookCard.module.scss';

const CookCard = ({ item }) => {
  return (
    <div className={styles.cookItem}>
      <img src={item.thumbnail} alt={item.name} />
      <div className={styles.cookName}>{item.name}</div>
    </div>
  );
};

CookCard.propTypes = {
  item: PropTypes.shape({
    thumbnail: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default CookCard;
