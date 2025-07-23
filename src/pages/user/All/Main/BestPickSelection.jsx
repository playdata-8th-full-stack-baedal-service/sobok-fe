import React, { useState, useEffect } from 'react';
import styles from './MainPage.module.scss';
import axiosInstance from '../../../../services/axios-config';

function BestPickSelection() {
  const [bestPick, setBestPick] = useState([]);

  const fetchBestPick = async () => {
    try {
      const res = await axiosInstance.get('post-service/post/post-list', {
        params: {
          page: 0,
          size: 1,
          sortBy: 'LIKE',
        },
      });
      console.log(res.data.data.content);
      if (res.data.success) {
        setBestPick(res.data.data.content);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBestPick();
  }, []);

  return (
    <div className={styles.bestPickSelection}>
      <p>베스트 Pick</p>
      {bestPick[0] && <img src={bestPick[0].thumbnail} alt={bestPick[0].title} />}
    </div>
  );
}

export default BestPickSelection;
