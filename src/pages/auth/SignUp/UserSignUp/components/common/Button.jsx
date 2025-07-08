import React from 'react';

function Button({ text, onClick, type = 'button', variant = 'BASIC', className = '', ...props }) {
  return (
    <button type={type} onClick={onClick} className={`button_${variant} ${className}`} {...props}>
      {text}
    </button>
  );
}

export default Button;
