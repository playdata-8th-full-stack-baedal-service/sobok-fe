import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { logout } from '../../store/authSlice';
import axios from '../../services/axios-config';
import styles from './AdminHeader.module.scss';
import useToast from '@/common/hooks/useToast';
import { logoutCleanup } from '@/store/productSlice';

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
      dispatch(logoutCleanup()); // 추가재료, 검색 초기화 redux 초기화
      navigate('/');
      showSuccess('로그아웃 되었습니다.');
    }
  };

  return (
    <Header
      lefttitle={<p>관리자용 페이지</p>}
      rightthree={
        <button type="button" onClick={handleLogout} className={styles.adminlogoutbutton}>
          로그아웃
        </button>
      }
    />
  );
}

export default AdminHeader;
