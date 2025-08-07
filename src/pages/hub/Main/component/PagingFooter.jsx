/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
import React from 'react';

const PagingFooter = ({ pageNo, setPageNo }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
      <button
        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
        onClick={() => setPageNo(pageNo - 1)}
      >
        {'<'}
      </button>
      <div>{pageNo}</div>
      <button
        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
        onClick={() => setPageNo(pageNo + 1)}
      >
        {'>'}
      </button>
    </div>
  );
};

export default PagingFooter;
