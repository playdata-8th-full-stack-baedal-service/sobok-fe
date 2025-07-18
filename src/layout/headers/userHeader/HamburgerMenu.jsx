import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './HamburgerMenu.module.scss';

function MenuTest() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const nav = useNavigate();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const closeSiderBar = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setShouldRender(false);
      setIsClosing(false);
    }, 300);
  };

  const openSiderBar = () => {
    setIsOpen(true);
    setShouldRender(true);
    setIsClosing(false);
  };

  useEffect(() => {
    const handleClickOutside = e => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        closeSiderBar();
      }
    };

    if (isOpen && !isClosing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isClosing]);

  const handleToggle = () => {
    if (isOpen) {
      closeSiderBar();
    } else {
      openSiderBar();
    }
  };

  const handleCategoryClick = category => {
    nav(`/user/category?category=${category}`);
    if (window.location.pathname.includes('/user/category')) {
      window.location.reload();
    }
    closeSiderBar(); // 페이드 아웃 애니메이션과 함께 닫기
  };

  return (
    <>
      <button ref={buttonRef} onClick={handleToggle} className={styles.menuButton}>
        <div className={styles.container}>
          <div
            className={`${styles.iconContainer} ${styles.menuIcon} ${isOpen ? styles.rotateOut : ''}`}
          >
            <Menu size={24} />
          </div>
          <div
            className={`${styles.iconContainer} ${styles.closeIcon} ${isOpen ? styles.rotateIn : ''}`}
          >
            <X size={24} style={{ stroke: 'black' }} />
          </div>
        </div>
      </button>
      {shouldRender && (
        <div ref={menuRef} className={`${styles.card} ${isClosing ? styles.fadeOut : ''}`}>
          <span>음식 카테고리</span>
          <span>선택</span>
          <div className={styles.card__container}>
            <p className={styles.element} onClick={() => handleCategoryClick('KOREAN')}>
              한식
            </p>
            <p className={styles.element} onClick={() => handleCategoryClick('JAPANESE')}>
              일식
            </p>
            <p className={styles.element} onClick={() => handleCategoryClick('CHINESE')}>
              중식
            </p>
            <p className={styles.element} onClick={() => handleCategoryClick('WESTERN')}>
              양식
            </p>
            <p className={styles.element} onClick={() => handleCategoryClick('SNACK')}>
              간식
            </p>
            <p className={styles.element} onClick={() => handleCategoryClick('LATE_NIGHT')}>
              야식
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default MenuTest;
