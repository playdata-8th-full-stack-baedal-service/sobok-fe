import React from 'react';
import '../styles/style.scss';

function Button({ text, onClick, type }) {
  return (
    <button className={`button_${type}`} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
