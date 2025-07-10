import React from 'react';
import Button from '../../components/Button';
import styles from './CompleteTemplate.module.scss';
import { CircleCheck } from 'lucide-react';

function CompleteTemplate({ message, buttons }) {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <CircleCheck className={styles.icon} />
        <div className={styles.text}>{message}</div>
        <div className={styles.buttonGroup}>
          {buttons.map((btn, idx) => (
            <Button
              key={idx}
              text={btn.text}
              type="button"
              variant="MAINPAGE"
              className="complete"
              onClick={btn.onClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompleteTemplate;
