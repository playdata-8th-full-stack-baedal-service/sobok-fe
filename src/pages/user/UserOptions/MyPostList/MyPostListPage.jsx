import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/axios-config';
import styles from './MyPostListPage.module.scss';

const MyPostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 9,
    totalPages: 0,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPosts(pageInfo.page);
  }, [pageInfo.page]);

  // 사용자 게시글 불러오기
  const fetchMyPosts = async page => {
    try {
      const res = await axiosInstance.get(
        `/post-service/post/user-post?page=${page}&size=${pageInfo.size}`
      );
      const { content, totalPages } = res.data.data;
      setPosts(content);
      setPageInfo(prev => ({ ...prev, totalPages }));
    } catch (err) {
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleCardClick = postId => {
    navigate(`/user/post/${postId}`);
  };

  const handlePrev = () => {
    if (pageInfo.page > 0) {
      setPageInfo(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNext = () => {
    if (pageInfo.page < pageInfo.totalPages - 1) {
      setPageInfo(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>내가 작성한 게시글</h2>

      {posts.length === 0 ? (
        <p className={styles.empty}>작성한 게시글이 없습니다.</p>
      ) : (
        <div className={styles.grid}>
          {posts.map(post => (
            <div
              key={post.postId}
              className={styles.card}
              onClick={() => handleCardClick(post.postId)}
            >
              <img
                src={post.thumbnail || '/default-thumbnail.jpg'}
                alt="썸네일"
                className={styles.thumbnail}
              />

              <div className={styles.centerContent}>
                <div className={styles.titleBox}>
                  <h3>{post.title}</h3>
                  <p>
                    <strong>요리 이름</strong>: {post.cookName}
                  </p>
                </div>
              </div>

              <div className={styles.info}>
                <p>
                  <strong>작성자</strong>: {post.nickName}
                </p>
                <p>
                  <strong>좋아요</strong>: {post.likeCount}
                </p>
                <p className={styles.date}>
                  <strong>작성일</strong>: {new Date(post.updatedAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {pageInfo.totalPages > 1 && (
        <div className={styles.pagination}>
          <button onClick={handlePrev} disabled={pageInfo.page === 0}>
            이전
          </button>
          <span>
            {pageInfo.page + 1} / {pageInfo.totalPages}
          </span>
          <button onClick={handleNext} disabled={pageInfo.page >= pageInfo.totalPages - 1}>
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPostListPage;
