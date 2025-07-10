import React from 'react';

function DuplicateCheckInput({
  label,
  value,
  onChange,
  onCheck,
  loading,
  success,
  error,
  placeholder,
  buttonLabel = '중복확인',
  disabled = false,
  inputId,
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          id={inputId}
          name={inputId}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{ flex: 1 }}
        />
        <button type="button" onClick={onCheck} disabled={loading || disabled || !value.trim()}>
          {loading ? '처리 중...' : buttonLabel}
        </button>
      </div>
      {success && <p style={{ color: 'green', margin: 0 }}>{success}</p>}
      {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
    </div>
  );
}

export default DuplicateCheckInput;
