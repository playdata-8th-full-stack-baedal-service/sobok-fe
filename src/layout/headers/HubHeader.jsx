import React from 'react';
import Header from './Header';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axios-config';
import styles from './HubHeader.module.scss';

// 테스트용
/*
  localStorage.setItem('accessToken', 'temp-access-token');
  localStorage.setItem('refreshToken', 'temp-refresh-token');
  localStorage.setItem('userRole', 'HUB');
  localStorage.setItem('userId', 'hub1');

  window.history.pushState({}, '', '/hub');
  window.dispatchEvent(new PopStateEvent('popstate'));
*/

const RiderHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const safeNavigate = path => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

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
      lefttitle={<p>가게용 페이지</p>}
      rightone={
        <button onClick={() => safeNavigate('/hub/history')} className={styles.orderbutton}>
          주문 처리 완료 내역
        </button>
      }
      righttwo={
        <button onClick={() => safeNavigate('/hub/info')} className={styles.hubbutton}>
          가게 정보
        </button>
      }
      rightthree={
        <button onClick={handleLogout} className={styles.logoutbuttonhub}>
          로그아웃
        </button>
      }
    />
  );
};

export default RiderHeader;
