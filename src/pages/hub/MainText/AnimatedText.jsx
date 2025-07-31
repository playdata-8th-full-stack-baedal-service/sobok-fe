import React, { useState, useEffect } from 'react';
import styles from './AnimatedText.module.scss';

function AnimatedText() {
  const [isAnimating, setIsAnimating] = useState(true);

  const spanizeText = text => {
    return text.split('').map((char, index) => (
      <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const spanizeSubText = text => {
    return text.split('').map((char, index) => (
      <span key={index} style={{ animationDelay: `${index * 0.025}s` }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const refreshAnimation = () => {
    setIsAnimating(false);
    // Force reflow
    setTimeout(() => {
      setIsAnimating(true);
    }, 50);
  };

  return (
    <div className={styles.container}>
      <section className={`${styles.mast} ${isAnimating ? styles.animate : ''}`}>
        <header className={styles.mastHeader}>
          <span className={styles.mastIcon}>🛒</span>
          <h1 className={styles.mastTitle}>{spanizeText("SOBOK SHOP PAGE")}</h1>
          <p className={styles.mastText}>
            {spanizeSubText("여기는 가게 전용 페이지입니다.")}
          </p>
        </header>
      </section>

      <button className={styles.btn} onClick={refreshAnimation}>
        <i className="ion-refresh" />
      </button>
    </div>
  );
}

export default AnimatedText;
