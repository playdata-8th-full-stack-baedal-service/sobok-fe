import React from 'react';
import '../style/style.scss';

function Button({ text, onClick, type }) {
  return (
    <button className={`button_${type}`} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
