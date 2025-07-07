import React from 'react';

function FormInput({
  label,
  required = false,
  error = '',
  success = '',
  children,
  className = '',
  ...props
}) {
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={props.id}>
        {label} {required && <span className="required">*</span>}
      </label>
      {children || <input className={error ? 'input-error' : ''} {...props} />}
      {error && <p className="message error">{error}</p>}
      {success && <p className="message success">{success}</p>}
    </div>
  );
}

export default FormInput;
