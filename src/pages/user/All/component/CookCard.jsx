/* eslint-disable react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './CookCard.module.scss';

const CookCard = ({ item, onClick }) => {
  return (
    <div className={styles.cookItem} onClick={onClick}>
      <img
        src={item.thumbnail}
        alt={item.name || item.cookName}
        onError={e => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = './soboklogo.png';
        }}
      />
      <div className={styles.cookName}>{item.name || item.cookName}</div>
    </div>
  );
};

CookCard.propTypes = {
  item: PropTypes.shape({
    thumbnail: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CookCard;
