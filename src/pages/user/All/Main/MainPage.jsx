import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfoPage from '../../UserInfo/UserInfoPage';

function MainPage() {
  const nav = useNavigate();
  return (
    <div>
      <h2>메인페이지 입니다.</h2>
      <button onClick={() => nav('/userinfo')}>수정페이지</button>
      
    </div>
  );
}

export default MainPage;
