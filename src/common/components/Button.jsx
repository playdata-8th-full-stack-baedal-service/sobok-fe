import React from 'react';
import '../styles/style.scss';

function Button({
  text,
  children,
  onClick,
  type = 'button',
  variant = '', // 기본값 빈 문자열
  className = '',
  loading,
  disabled,
  ...props
}) {
  // loading 속성이 DOM에 전달되지 않도록 제거
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
      disabled={loading || disabled} // loading 중일 땐 클릭 막기
      {...filteredProps}
    >
      {loading ? '로딩중...' : text || children}
    </button>
  );
}

export default Button;
