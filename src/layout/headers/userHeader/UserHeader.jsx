import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Settings2, ShoppingCart } from 'lucide-react';
import { logout } from '../../../store/authSlice';
import axios from '../../../services/axios-config';
import Header from '../Header';
import styles from './UserHeader.module.scss';
import MenuTest from './HamburgerMenu';

// 테스트용
/*
    localStorage.setItem('accessToken', 'temp-access-token');
    localStorage.setItem('refreshToken', 'temp-refresh-token');
    localStorage.setItem('userRole', 'USER');
    localStorage.setItem('userId', '/user1');

     window.history.pushState({}, '', '/user');
     window.dispatchEvent(new PopStateEvent('popstate'));
*/

function UserHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = !!localStorage.getItem('ACCESS_TOKEN');

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      alert('로그아웃 되었습니다.');
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleOutsideClick = e => {
    if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [dropdownOpen]);

  const MenuIcon = (
    <div className={styles.menuIcon} onClick={() => console.log('사이드바 열기')}>
      <MenuTest />
    </div>
  );

  const Logo = (
    <div className={styles.logo} onClick={() => safeNavigate('/')}>
      \n <img src="/icons/logo.svg" alt="로고" />
    </div>
  );

  const LoggedInControls = (
    <div className={styles.navItems}>
      <ShoppingCart
        onClick={() => safeNavigate('/user/cart')}
        className={styles.iconBtn}
      />
      <button onClick={handleLogout} className={styles.logoutbutton}>
        로그아웃
      </button>
      <div className={styles.dropdownWrapper} ref={dropdownRef}>
        <Settings2
          onClick={toggleDropdown}
          className={styles.iconBtn}
        />
        {dropdownOpen && (
          <ul className={styles.dropdownMenu}>
            <li onClick={() => safeNavigate('/user/info')}>회원 정보 수정</li>
            <li onClick={() => safeNavigate('/user/my-posts')}>내 게시글 조회</li>
            <li onClick={() => safeNavigate('/user/orders')}>내 주문 내역</li>
            <li onClick={() => safeNavigate('/user/bookmarks')}>즐겨찾기한 요리</li>
            <li onClick={() => safeNavigate('/user/likes')}>좋아요한 게시글</li>
          </ul>
        )}
      </div>
    </div>
  );

  const GuestControls = (
    <div className={styles.navItems}>
      <button onClick={() => safeNavigate('/auth/signin')} className={styles.loginbutton}>로그인</button>
      <button onClick={() => safeNavigate('/auth/signup')} className={styles.signupbutton}>회원가입</button>
    </div>
  );

  return (
    <Header
      lefttitle={MenuIcon}
      title={Logo}
      rightone={isLoggedIn ? LoggedInControls : GuestControls}
    />
  );
}

export default UserHeader;
