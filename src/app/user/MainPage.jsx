import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/auth/signin');
  };

  return (
    <div>
      <header>메인페이지 입니다.</header>
      <button onClick={handleLoginClick}>로그인</button>
    </div>
  );
}

export default MainPage;
