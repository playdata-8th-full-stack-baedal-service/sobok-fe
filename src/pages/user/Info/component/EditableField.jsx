import React, { useState } from 'react';

function EditableField({ label, value, onEditClick, disabled }) {
  const [editValue, setEditValue] = useState(value);

  const handleEditClick = () => {
    onEditClick(editValue);
  };

  return (
    <div>
      <label htmlFor={label}>{label}</label>
      <input
        type="text"
        value={editValue}
        disabled={disabled}
        id={label}
        onChange={e => setEditValue(e.target.value)}
      />
      {!disabled && (
        <button type="button" onClick={handleEditClick}>
          수정
        </button>
      )}
    </div>
  );
}

export default EditableField;
