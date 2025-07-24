import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { logout } from '../../store/authSlice';
import axios from '../../services/axios-config';
import styles from './AdminHeader.module.scss';
import useToast from '@/common/hooks/useToast';

function AdminHeader() {
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
      rightthree={
        <button type="button" onClick={handleLogout} className={styles.adminlogoutbutton}>
          로그아웃
        </button>
      }
    />
  );
}

export default AdminHeader;
