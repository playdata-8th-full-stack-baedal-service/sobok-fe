import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  MdMenuBook,
  MdChecklist,
  MdChevronLeft,
  MdDeliveryDining,
  MdFastfood,
  MdGrading,
  MdAddShoppingCart,
} from 'react-icons/md';
import { GiShop } from 'react-icons/gi';
import Button from '../../../common/components/Button';
import styles from './MainPage.module.scss';
// React Icons 임포트 - 필요한 아이콘들로 교체하세요

function MainPage() {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const allOrder = () => {
    navigate('/admin/all-order');
  };

  const hubRegister = () => {
    navigate('/admin/hub-register');
  };

  const ingrediant = () => {
    navigate('/admin/ingredient');
  };

  const riderList = () => {
    navigate('/admin/rider-list');
  };

  const hubList = () => {
    navigate('/admin/hub-list');
  };

  return (
    <div className={styles.mainLayout}>
      {/* 사이드바 */}
      <nav className={`${styles.nav}`} data-expanded={sidebarExpanded}>
        <div className={styles.navMain}>
          <div className={styles.navLogo}>
            <img src="/soboklogo.png" />
          </div>
          <span className={styles.navHeading}>
            <span className={styles.navHeadingText}>Sobok Admin Menu</span>
          </span>
          <ul className={styles.navItems}>
            <li className={styles.navItem}>
              <button className={styles.navItemBox} onClick={allOrder} title="모든 주문 조회">
                <span className={styles.navItemIcon}>
                  <MdGrading />
                </span>
                <span className={styles.navItemText}>모든 주문 조회</span>
              </button>
            </li>
            <li className={styles.navItem}>
              <button className={styles.navItemBox} onClick={ingrediant} title="요리 등록">
                <span className={styles.navItemIcon}>
                  <MdFastfood />
                </span>
                <span className={styles.navItemText}>요리 등록</span>
              </button>
            </li>
            <li className={styles.navItem}>
              <button className={styles.navItemBox} onClick={hubRegister} title="가게 등록">
                <span className={styles.navItemIcon}>
                  <MdAddShoppingCart />
                </span>
                <span className={styles.navItemText}>가게 등록</span>
              </button>
            </li>
            <li className={styles.navItem}>
              <button className={styles.navItemBox} onClick={riderList} title="배달원 관리">
                <span className={styles.navItemIcon}>
                  <MdDeliveryDining />
                </span>
                <span className={styles.navItemText}>배달원 관리</span>
              </button>
            </li>
            <li className={styles.navItem}>
              <button className={styles.navItemBox} onClick={hubList} title="가게 정보 조회">
                <span className={styles.navItemIcon}>
                  <GiShop />
                </span>
                <span className={styles.navItemText}>가게 정보 조회</span>
              </button>
            </li>
          </ul>
        </div>
        <div className={styles.navBottom}>
          <ul className={styles.navItems}>
            <li className={styles.navItem}>
              <button
                className={styles.navItemBox}
                type="button"
                aria-expanded={sidebarExpanded}
                onClick={toggleSidebar}
              >
                <span className={styles.navItemIcon}>
                  <MdChevronLeft />
                </span>
                <span className={styles.navItemText}>{sidebarExpanded ? '접기' : '펼치기'}</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* 원래 메인 컨텐츠 */}
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
