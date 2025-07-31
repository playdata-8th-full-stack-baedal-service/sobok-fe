import React from 'react';
import styles from './CapybaraLoader.module.scss';

function CapybaraLoader() {
  return (
    <div className={styles.capybaraLoader}>
      <div className={styles.capybara}>
        <div className={styles.capyHead}>
          <div className={styles.capyEar}>
            <div className={styles.capyEar2} />
          </div>
          <div className={styles.capyEar} />
          <div className={styles.capyMouth}>
            <div className={styles.capyLips} />
            <div className={styles.capyLips} />
          </div>
          <div className={styles.capyEye} />
          <div className={styles.capyEye} />
        </div>
        <div className={styles.capyLeg} />
        <div className={styles.capyLeg2} />
        <div className={styles.capyLeg2} />
        <div className={styles.capy} />
      </div>
      <div className={styles.loader}>
        <div className={styles.loaderLine} />
      </div>
    </div>
  );
}

export default CapybaraLoader;
