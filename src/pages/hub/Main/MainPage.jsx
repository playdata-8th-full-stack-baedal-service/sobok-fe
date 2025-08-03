import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  PackageCheck,
  Store,
  Package,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react';
import styles from './MainPage.module.scss';

function MainPage() {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: '/hub/order',
      label: '주문 확인',
      title: '주문 확인',
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: '/hub/history',
      label: '주문 처리 완료 내역',
      title: '주문 처리 완료 내역',
      icon: <PackageCheck size={20} />,
    },
    {
      path: '/hub/info',
      label: '가게 정보',
      title: '가게 정보',
      icon: <Store size={20} />,
    },
    {
      path: '/hub/stock',
      label: '재고 조회',
      title: '재고 조회',
      icon: <Package size={20} />,
    },
  ];

  const toggleSize = () => {
    setExpanded(!expanded);
  };

  const handleNavClick = path => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleLogoClick = () => {
    // 로고 클릭 시 메인 허브 페이지로 이동 (기본 허브 대시보드)
    navigate('/hub');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav
        className={`${styles.nav} ${!expanded ? styles.collapsed : ''}`}
        data-expanded={expanded}
      >
        <div className={styles.nav__main}>
          <div className={styles.nav__logo} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <img src="/soboklogo.png" alt="Sobok Logo" />
          </div>

          <span className={styles.nav__heading}>
            <span className={styles.nav__heading_text}>Sobok Shop Menu</span>
          </span>

          <ul className={styles.nav__items}>
            {navItems.map((item, index) => (
              <li key={index} className={styles.nav__item}>
                <button
                  className={styles.nav__item_box}
                  onClick={() => handleNavClick(item.path)}
                  title={item.title}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  <span className={styles.nav__item_icon}>{item.icon}</span>
                  <span className={styles.nav__item_text}>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.nav__bottom}>
          <ul className={styles.nav__items}>
            <li className={styles.nav__item}>
              <button
                className={styles.nav__item_box}
                type="button"
                aria-expanded={expanded}
                onClick={toggleSize}
              >
                <span className={styles.nav__item_icon}>
                  {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </span>
                <span className={styles.nav__item_text}>{expanded ? '숨기기' : '펼치기'}</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* 메인 콘텐츠 영역 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: '#ffffff',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
