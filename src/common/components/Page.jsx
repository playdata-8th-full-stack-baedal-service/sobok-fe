import React from 'react';
import styles from './Page.module.scss';

const Page = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Page;
