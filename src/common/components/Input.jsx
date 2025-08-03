import React from 'react';
import '../styles/style.scss';

function Input({
  label,
  required = false,
  error = '',
  success = '',
  children,
  className = '',
  showLabel = true, // 기본값 false 대신 true로 설정
  ...props
}) {
  return (
    <div className={`form-group ${className}`}>
      {showLabel && (
        <label htmlFor={props.id}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      {children || <input className={error ? 'input-error' : ''} {...props} />}
      {error && <p className="message error">{error}</p>}
      {success && <p className="message success">{success}</p>}
    </div>
  );
}

export default Input;
