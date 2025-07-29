import React from 'react';
import { useDispatch } from 'react-redux';
import { setNumOfRows } from '../../../../store/stockSlice';

// eslint-disable-next-line react/function-component-definition
const RadioInput = ({ checked, value, name }) => {
  const dispatch = useDispatch();
  return (
    <div>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={e => dispatch(setNumOfRows(e.target.value))}
      />
      <span>{value}개</span>
    </div>
  );
};

export default RadioInput;
