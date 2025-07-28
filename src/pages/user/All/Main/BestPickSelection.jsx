import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import styles from './MainPage.module.scss';
import axiosInstance from '../../../../services/axios-config';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function BestPickSelection() {
  const [bestPick, setBestPick] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBestPick = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('post-service/post/post-list', {
        params: {
          page: 0,
          size: 3,
          sortBy: 'LIKE',
        },
      });

     

      if (res.data.success && res.data.data.content) {
        setBestPick(res.data.data.content);
        
      }
    } catch (err) {
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestPick();
  }, []);

  const handleClick = postId => {
    navigate(`/user/post/${postId}`);
  };

  if (loading) {
    return <div className={styles.bestPickSelection}>로딩 중...</div>;
  }

  return (
    <div className={styles.bestPickSelection}>
      <p className={styles.bestPicktitle}>게시물 베스트 Pick</p>

      <Swiper
        spaceBetween={30}
        slidesPerView={1} 
        navigation
        pagination={{ clickable: true }}
        loop={bestPick.length > 1}
        autoplay={bestPick.length > 1 ? { delay: 3000, disableOnInteraction: false } : false}
        modules={[Navigation, Pagination, Autoplay]}
        className={styles.mySwiper}
        breakpoints={{
          
          768: {
            slidesPerView: 1,
          },
          1024: {
            slidesPerView: 1,
          },
        }}
      >
        {bestPick.map((post, ind) => (
          <SwiperSlide
            key={post.postId}
            onClick={() => handleClick(post.postId)}
            tabIndex={ind}
            role="button"
            aria-label={`${post.title} 게시글로 이동`}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick(post.postId);
              }
            }}
          >
            <img 
              src={post.thumbnail} 
              onError={(e) => {
                console.log('Image load error:', e.target.src);
                e.target.style.display = 'none';
              }}
              className={styles.bestimg}
            />
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