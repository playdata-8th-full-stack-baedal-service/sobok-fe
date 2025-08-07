import React from 'react';
import Header from './Header';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axios-config';
import styles from './HubHeader.module.scss';
import useToast from '@/common/hooks/useToast';

const RiderHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccess, showNegative, showInfo } = useToast();

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
        <button onClick={handleLogout} className={styles.logoutbuttonhub}>
          로그아웃
        </button>
      }
    />
  );
};

export default RiderHeader;
