import styles from './HamsterLoader.module.scss';

const HamsterLoader = () => {
  return (
    <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className={styles.wheelAndHamster}>
      <div className={styles.wheel}></div>
      <div className={styles.hamster}>
        <div className={styles.hamsterBody}>
          <div className={styles.hamsterHead}>
            <div className={styles.hamsterEar}></div>
            <div className={styles.hamsterEye}></div>
            <div className={styles.hamsterNose}></div>
          </div>
          <div className={styles.limbFr}></div>
          <div className={styles.limbFl}></div>
          <div className={styles.limbBr}></div>
          <div className={styles.limbBl}></div>
          <div className={styles.hamsterTail}></div>
        </div>
      </div>
      <div className={styles.spoke}></div>
    </div>
  );
};

export default HamsterLoader;
