import React from 'react';
import '../styles/style.scss';

function Button({
  text,
  children,
  onClick,
  type = 'button',
  variant = '', // BASIC, PRIMARY 등
  className = '', // wide 등
  loading,
  disabled,
  ...props
}) {
  const filteredProps = { ...props };
  if (loading !== undefined) {
    delete filteredProps.loading;
  }

  const buttonClass = variant ? `button_${variant}` : 'button';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${buttonClass} ${className}`}
      disabled={loading || disabled}
      {...filteredProps}
    >
      {loading ? '로딩중...' : text || children}
    </button>
  );
}

export default Button;
