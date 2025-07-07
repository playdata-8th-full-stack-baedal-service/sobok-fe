import React from 'react';

function Button({
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  onClick,
  children,
  className = '',
  ...props
}) {
  const getButtonClass = () => {
    const baseClass = 'btn';
    const variantClass = variant === 'secondary' ? 'btn-secondary' : 'btn-primary';
    return `${baseClass} ${variantClass} ${className}`;
  };

  return (
    <button
      type={type}
      className={getButtonClass()}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? '처리중...' : children}
    </button>
  );
}

export default Button;
