import React from 'react';
import Header from './Header';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axios-config';
import style from './RiderHeader.module.scss';

// 테스트용
/*
    localStorage.setItem('ACCESS_TOKEN', 'temp-access-token');
    localStorage.setItem('REFRESH_TOKEN', 'temp-refresh-token');
    localStorage.setItem('USER_ROLE', 'RIDER');
    localStorage.setItem('USER_ID', 'rider1');

    window.history.pushState({}, '', '/rider');
    window.dispatchEvent(new PopStateEvent('popstate'));
*/

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
      navigate('/');
      showSuccess('로그아웃 되었습니다.');
    }
  };

  return (
    <Header
      rightone={
        <button onClick={handleLogout} className={style.riderlogoutbutton}>
          로그아웃
        </button>
      }
    />
  );
};

export default RiderHeader;
