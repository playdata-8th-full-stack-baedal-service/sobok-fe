import React from 'react';
import Header from '../Header';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from '@/services/ExAxiosConfig';

const RiderHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/auth-service/auth/logout');
    } catch (err) {
      console.error('서버 로그아웃 실패:', err);
    } finally {
      dispatch(logout());
      navigate('/signin');
    }
  };

  return (
    <Header
      lefttitle={null}
      title={<img src="/소복소복로고.svg" alt="로고" style={{ height: '32px' }} />}
      rightone={<button onClick={handleLogout}>로그아웃</button>}
      righttwo={null}
      rightthree={null}
    />
  );
};

export default RiderHeader;
