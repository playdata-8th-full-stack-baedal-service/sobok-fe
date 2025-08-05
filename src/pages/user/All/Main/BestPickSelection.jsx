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
      console.log('[BestPickSelection] API 호출 시작...');
      const res = await axiosInstance.get('post-service/post/post-list', {
        params: {
          page: 0,
          size: 5,
          sortBy: 'LIKE',
        },
      });
      console.log('[BestPickSelection] API 응답 데이터:', res.data);

      if (res.data.success && res.data.data.content) {
        setBestPick(res.data.data.content);
        console.log('[BestPickSelection] 상태 저장됨:', res.data.data.content);
      } else {
        console.warn('[BestPickSelection] 응답에 content 없음');
      }
    } catch (err) {
      console.error('[BestPickSelection] API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestPick();
  }, []);

  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % bestPick.length);
    }, 3000);
  };

  useEffect(() => {
    if (bestPick.length > 1) {
      console.log('[BestPickSelection] 자동 슬라이드 시작');
      startAutoSlide();
    }
    return () => {
      console.log('[BestPickSelection] 자동 슬라이드 정리');
      clearInterval(intervalRef.current);
    };
  }, [bestPick.length]);

  const handleClick = postId => {
    console.log('[BestPickSelection] handleClick 호출됨 - postId:', postId);
    navigate(`/post/${postId}`);
  };

  const handleSlideClick = (index, postId) => {
    console.log('[BestPickSelection] 슬라이드 클릭됨:', {
      index,
      postId,
      post: bestPick[index],
    });

    if (activeSlide === index) {
      handleClick(postId);
    } else {
      setActiveSlide(index);
      startAutoSlide();
    }
  };

  const handleKeyDown = (e, postId, index) => {
    console.log('[BestPickSelection] 키보드 입력 감지:', e.key, {
      index,
      postId,
      post: bestPick[index],
    });

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
                console.log('[BestPickSelection] 이미지 로드 오류:', e.target.src);
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

      {bestPick.length > 1 && (
        <div className={styles.slideNavigation}>
          {bestPick.map((_, index) => (
            <button
              key={index}
              className={`${styles.navDot} ${activeSlide === index ? styles.activeDot : ''}`}
              onClick={() => {
                console.log('[BestPickSelection] 네비게이션 점 클릭:', { index, post: bestPick[index] });
                setActiveSlide(index);
              }}
              aria-label={`${index + 1}번째 슬라이드로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BestPickSelection;
