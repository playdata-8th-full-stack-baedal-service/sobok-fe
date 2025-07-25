import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules'; // Added missing imports
import styles from './MainPage.module.scss';
import axiosInstance from '../../../../services/axios-config';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function BestPickSelection() {
  const [bestPick, setBestPick] = useState([]);
  const navigate = useNavigate();

  const fetchBestPick = async () => {
    try {
      const res = await axiosInstance.get('post-service/post/post-list', {
        params: {
          page: 0,
          size: 3,
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

  const handleClick = postId => {
    navigate(`/user/post/${postId}`);
  };

  return (
    <div className={styles.bestPickSelection}>
      <p className={styles.bestPicktitle}>게시물 베스트 Pick</p>
      <Swiper
        spaceBetween={30}
        navigation
        pagination={{ clickable: true }}
        loop={bestPick.length > 1}
        autoplay={{ delay: 3000, disableOnInteraction: false }} // Fixed typo: autopaly -> autoplay
        modules={[Navigation, Pagination, Autoplay]}
        className={styles.mySwiper}
      >
        {bestPick.map((post, ind) => (
          <SwiperSlide
            key={post.postId}
            onClick={() => handleClick(post.postId)}
            tabIndex={ind}
            role="button"
            aria-label={`${post.title} 게시글로 이동`}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') handleClick(post.postId);
            }}
          >
            <img src={post.thumbnail} />
            <div className={styles.infosection}>
              <p>{post.title}</p>
              <p>{post.nickName}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default BestPickSelection;
