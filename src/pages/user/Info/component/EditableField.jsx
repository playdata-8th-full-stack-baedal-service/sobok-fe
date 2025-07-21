import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Input from '../../../../common/components/Input';
import styles from '../UserInfo.module.scss';

function EditableField({ label, value, onEditClick, disabled }) {
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  return (
    <div className={styles.fieldRow}>
      <label htmlFor={label}>{label}</label>
      <input
        type="text"
        value={editValue}
        disabled={disabled}
        id={label}
        style={{
          backgroundColor: disabled ? 'lightgray' : 'white',
        }}
        onChange={e => setEditValue(e.target.value)}
      />
      {!disabled && (
        <button type="button" onClick={() => onEditClick(editValue)}>
          변경
        </button>
      )}
    </div>
  );
}

EditableField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onEditClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default EditableField;
