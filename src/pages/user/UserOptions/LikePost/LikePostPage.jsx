import React, { useEffect, useState } from 'react';
import axiosInstance from '@/services/axios-config';
import styles from './LikePostPage.module.scss';
import { useNavigate } from 'react-router-dom';
import useToast from '@/common/hooks/useToast';

function LikePostPage() {
  const [likePosts, setLikePosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showSuccess, showNegative, showInfo } = useToast();

  useEffect(() => {
    fetchLikedPosts();
  }, []);

  const fetchLikedPosts = async () => {
    try {
      const res = await axiosInstance.get('/post-service/post/post-like?page=0&size=10');
      setLikePosts(res.data.content);
    } catch (err) {
      setError('좋아요한 게시글을 불러오는 데 실패했습니다.');
    }
  };

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const handlePostClick = postId => {
    navigate(`/user/post/${postId}`);
  };

  const handleUnlike = async (e, id) => {
    e.stopPropagation(); // 카드 클릭 막기
    try {
      await axiosInstance.delete('/user-service/user/user-unlike', {
        data: { postId: Number(id) }, // ← 여기가 핵심
      });
      setLikePosts(prev => prev.filter(post => post.postId !== id)); // ← post.postId로 비교
    } catch (err) {
      showNegative('좋아요 취소에 실패했습니다.');
    }
  };

  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>내가 좋아요한 게시글</h2>
      <div className={styles.list}>
        {likePosts.length === 0 ? (
          <p className={styles.empty}>좋아요한 게시글이 없습니다.</p>
        ) : (
          likePosts.map(post => (
            <div
              key={post.postId}
              className={styles.card}
              onClick={() => handlePostClick(post.postId)}
            >
              <img src={post.thumbnail} alt="썸네일" className={styles.thumbnail} />
              <div className={styles.info}>
                <h3>{post.title}</h3>
                <p>요리명: {post.cookName}</p>
                <p>작성자: {post.nickName}</p>
                <p>좋아요: {post.likeCount}</p>
                <p>작성일: {formatDate(post.updatedAt)}</p>
              </div>
              <button className={styles.unlikeButton} onClick={e => handleUnlike(e, post.postId)}>
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LikePostPage;
