/* eslint-disable react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './OrderItem.module.scss';

const OrderItem = ({ item }) => (
  <div className={styles.orderItem}>
    <img src={item.thumbnail} alt={item.cookName} />
    <span>{item.cookName}</span>
  </div>
);

OrderItem.propTypes = {
  item: PropTypes.shape({
    cookName: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
  }).isRequired,
};

export default OrderItem;
