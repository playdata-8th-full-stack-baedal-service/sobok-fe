import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

function PasswordInput({
  value,
  onChange,
  showPassword,
  onTogglePassword,
  placeholder,
  error,
  id = 'password',
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label
        htmlFor={id}
        style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}
      >
        비밀번호
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '12px 40px 12px 15px',
            border: '1px solid #e9ecef',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.3s ease',
          }}
          onFocus={e => (e.target.style.borderColor = '#007bff')}
          onBlur={e => (e.target.style.borderColor = '#e9ecef')}
        />
        <button
          type="button"
          onClick={onTogglePassword}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6c757d',
            padding: '5px',
          }}
          onMouseOver={e => (e.target.style.color = '#333')}
          onMouseOut={e => (e.target.style.color = '#6c757d')}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>{error}</p>}
    </div>
  );
}

export default PasswordInput;
