import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainPage.module.scss';
import axiosInstance from '../../../../services/axios-config';

function BestPickSelection() {
  const [bestPick, setBestPick] = useState([]);
  const navigate = useNavigate();

  const fetchBestPick = async () => {
    try {
      const res = await axiosInstance.get('post-service/post/post-list', {
        params: {
          page: 0,
          size: 1,
          sortBy: 'LIKE',
        },
      });
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

  const handleClick = () => {
    if (bestPick[0]) {
      navigate(`/user/post/${bestPick[0].postId}`);
    }
  };

  return (
    <div className={styles.bestPickSelection}>
      <p>베스트 Pick</p>
      {bestPick[0] && (
        <div
          style={{ display: 'inline-block', cursor: 'pointer' }}
          onClick={handleClick}
          tabIndex={0}
          role="button"
          aria-label={`${bestPick[0].title} 게시글로 이동`}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') handleClick();
          }}
        >
          <img src={bestPick[0].thumbnail} alt={bestPick[0].title} style={{ display: 'block' }} />
        </div>
      )}
    </div>
  );
}

export default BestPickSelection;
