/* eslint-disable react/function-component-definition */
import React from 'react';
import styles from './CheckBox.module.scss';

const CheckBox = ({ checked, onChange }) => {
  return (
    <input
      type="checkbox"
      className={styles.checkBox}
      checked={checked}
      onChange={() => onChange()}
    />
  );
};

export default CheckBox;
