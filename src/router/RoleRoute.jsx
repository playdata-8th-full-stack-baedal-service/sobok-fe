import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function RoleRoute({ role, children }) {
  const token = localStorage.getItem('ACCESS_TOKEN');
  const userRole = localStorage.getItem('USER_ROLE');
  const location = useLocation();

  // 로그인 여부 확인
  if (!token) {
    alert('로그인이 필요한 페이지입니다.');
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  // 역할 권한 확인
  if (userRole !== role) {
    alert('접근 권한이 없습니다.');
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleRoute;
