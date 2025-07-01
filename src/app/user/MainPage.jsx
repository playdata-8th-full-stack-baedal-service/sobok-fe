// MainPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/auth/signin');
  };

  return (
    <div>
      <h2>메인페이지 입니다.</h2>
    </div>
  );
}

export default MainPage;
