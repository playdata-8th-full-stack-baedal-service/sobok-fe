import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import styles from './UserHeader.module.scss';

const UserHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const safeNavigate = path => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
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
      <img src="/icons/menu.svg" alt="메뉴" />
    </div>
  );

  const Logo = (
    <div className={styles.logo} onClick={() => safeNavigate('/')}>
      <img src="/icons/logo.svg" alt="로고" />
    </div>
  );

  const LoggedInControls = (
    <div className={styles.navItems}>
      <img
        src="/icons/cart.svg"
        alt="장바구니"
        onClick={() => safeNavigate('/user/cart')}
        className={styles.iconBtn}
      />
      <button onClick={handleLogout}>로그아웃</button>
      <div className={styles.dropdownWrapper} ref={dropdownRef}>
        <img
          src="/icons/dashboard.svg"
          alt="더보기"
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
      <button onClick={() => safeNavigate('/auth/signin')}>로그인</button>
      <button onClick={() => safeNavigate('/auth/signup')}>회원가입</button>
    </div>
  );

  return (
    <Header
      lefttitle={MenuIcon}
      title={Logo}
      rightone={isLoggedIn ? LoggedInControls : GuestControls}
    />
  );
};

export default UserHeader;
