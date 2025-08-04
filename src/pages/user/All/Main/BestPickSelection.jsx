import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainPage.module.scss';
import axiosInstance from '../../../../services/axios-config';

function BestPickSelection() {
  const [bestPick, setBestPick] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const fetchBestPick = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('post-service/post/post-list', {
        params: {
          page: 0,
          size: 5,
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

  // 자동 슬라이드 시작 함수
  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % bestPick.length);
    }, 3000);
  };

  // 컴포넌트 마운트 시 슬라이드 시작
  useEffect(() => {
    if (bestPick.length > 1) {
      startAutoSlide();
    }
    return () => clearInterval(intervalRef.current);
  }, [bestPick.length]);

  const handleClick = postId => {
    navigate(`/post/${postId}`);
  };

  const handleSlideClick = (index, postId) => {
    if (activeSlide === index) {
      // 이미 활성화된 슬라이드를 클릭하면 라우터로 이동
      handleClick(postId);
    } else {
      // 비활성 슬라이드를 클릭하면 활성화만 시킴
      setActiveSlide(index);
      startAutoSlide();
    }
  };

  const handleKeyDown = (e, postId, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (activeSlide === index) {
        handleClick(postId);
      } else {
        setActiveSlide(index);
      }
    }
  };

  if (loading) {
    return <div className={styles.bestPickSelection}>로딩 중...</div>;
  }

  if (bestPick.length === 0) {
    return <div className={styles.bestPickSelection}>베스트 픽 게시물이 없습니다.</div>;
  }

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  return (
    <div className={styles.bestPickSelection}>
      <p className={styles.bestPicktitle}>게시물 베스트 Pick</p>

      <div className={styles.customSliderContainer}>
        {bestPick.map((post, index) => (
          <div
            key={post.postId}
            className={`${styles.customSlide} ${activeSlide === index ? styles.active : ''}`}
            onClick={() => handleSlideClick(index, post.postId)}
            tabIndex={0}
            role="button"
            aria-label={`${post.title} 게시글로 이동`}
            onKeyDown={e => handleKeyDown(e, post.postId, index)}
          >
            <img
              src={post.thumbnail}
              alt={post.title}
              onError={e => {
                console.log('Image load error:', e.target.src);
                e.target.style.display = 'none';
              }}
              className={styles.slideImage}
            />
            <div className={styles.slideInfoSection}>
              <p className={styles.slideTitle}>{post.title}</p>
              <p className={styles.slideAuthor}>{post.nickName}</p>
              <div className={styles.subinfo}>
                <p>
                  좋아요 수 : <span className={styles.liketext}>{post.likeCount}</span>
                </p>
                <p>작성일시: {formatDate(post.updatedAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 네비게이션 점들 */}
      {bestPick.length > 1 && (
        <div className={styles.slideNavigation}>
          {bestPick.map((_, index) => (
            <button
              key={index}
              className={`${styles.navDot} ${activeSlide === index ? styles.activeDot : ''}`}
              onClick={() => setActiveSlide(index)}
              aria-label={`${index + 1}번째 슬라이드로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BestPickSelection;
