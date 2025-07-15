import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import styles from './HamburgerMenu.module.scss';

function MenuTest() {
  const [isOpen, setIsOpen] = useState(false);

  const closeSiderBar = () => setIsOpen(false);
  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.menuButton}>
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
      {isOpen && (
        <ul className={styles.sidebar}>
          <li className={styles.siderbartitle}>한식</li>
          <li className={styles.siderbartitle}>중식</li>
          <li className={styles.siderbartitle}>일식</li>
          <li className={styles.siderbartitle}>양식</li>
          <li className={styles.siderbartitle}>간식</li>
          <li className={styles.siderbartitle}>야식</li>
          <button onClick={closeSiderBar} className={styles.closebutton}>
            닫기
          </button>
        </ul>
      )}
    </>
  );
}

export default MenuTest;
