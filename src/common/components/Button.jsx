import React from 'react';
import '../styles/style.scss';

function Button({ text, onClick, disabled, className }) {
  return (
    <button type="button" className={`button_${className}`} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}

export default Button;
