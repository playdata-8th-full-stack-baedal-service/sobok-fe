import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/axios-config';
import styles from './PostDetailPage.module.scss';
import Button from '../../../../common/components/Button';

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태
  const navigate = useNavigate();

  const handleEditPost = () => {
    navigate('/user/edit-post', { state: { post } });
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm('정말로 게시글을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/post-service/post/delete/${id}`);
      alert('게시글이 성공적으로 삭제되었습니다.');
      navigate('/user/my-posts');
    } catch (err) {
      if (err.response?.status === 403) {
        alert('해당 게시글에 대한 권한이 없습니다.');
      } else if (err.response?.status === 404) {
        alert('게시글이 존재하지 않습니다.');
      } else {
        alert('게시글 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 좋아요 등록/해제 핸들러
  const handleLikePost = async () => {
    if (isLiked) {
      try {
        await axiosInstance.delete('/post-service/post/user-unlike', {
          data: { postId: Number(id) },
        });
        setIsLiked(false);
        setPost(prev => ({ ...prev, likeCount: prev.likeCount - 1 }));
      } catch (err) {
        if (err.response?.status === 404) {
          alert('좋아요 정보가 없습니다.');
        } else {
          alert('좋아요 해제 중 오류가 발생했습니다.');
        }
      }
    } else {
      try {
        await axiosInstance.post('/post-service/post/user-like', {
          postId: Number(id),
        });
        setIsLiked(true);
        setPost(prev => ({ ...prev, likeCount: prev.likeCount + 1 }));
      } catch (err) {
        if (err.response?.data.status === 400) {
          alert('이미 좋아요한 게시글입니다.');
          setIsLiked(true); // 이미 좋아요 상태라고 간주
        } else if (err.response?.status === 404) {
          alert('게시글이 존재하지 않습니다.');
        } else {
          alert('좋아요 등록 중 오류가 발생했습니다.');
        }
      }
    }
  };

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const res = await axiosInstance.get(`/post-service/post/detail/${id}`);
        setPost(res.data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('존재하지 않는 게시글입니다.');
        } else {
          setError('게시글을 불러오는 중 오류가 발생했습니다.');
        }
      }
    };

    fetchPostDetail();
  }, [id]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!post) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  console.log('ACCESS_TOKEN:', localStorage.getItem('ACCESS_TOKEN'));
  console.log('좋아요 요청 postId:', id, '→ 변환된:', Number(id));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left}>
          <p>
            <strong>요리 이름</strong> : {post.cookName}
          </p>
          <p>
            <strong>제목</strong> : {post.title}
          </p>
          <button className={styles.button}>주문 조회하기</button>
        </div>
        <div className={styles.right}>
          <p>
            <strong>작성자</strong> : {post.nickname}
          </p>
          <p>
            <strong>작성 날짜</strong> : {formatDate(post.updatedAt)}
          </p>
          <div className={styles.likeSection} onClick={handleLikePost}>
            <img
              src={isLiked ? '/icons/like-filled.svg' : '/icons/like.svg'}
              className={styles.likeIcon}
            />
            <span>좋아요 수 : {post.likeCount}</span>
          </div>
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.textContent}>
          <div className={styles.inner} dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </div>
        <div className={styles.images}>
          {post.images.map((url, idx) => (
            <img key={idx} src={url} alt={`post-img-${idx}`} />
          ))}
        </div>
      </div>

      <div className={styles.ingredients}>
        <h3>기본 재료</h3>
        <ul>
          {post.baseIngredients.map(ing => (
            <li key={ing.id}>
              {ing.ingredientName}&nbsp;&nbsp;{ing.quantity}g ({ing.origin}) / {ing.price}원
            </li>
          ))}
        </ul>

        <h3>추가 재료</h3>
        <ul>
          {post.additionalIngredients.map(ing => (
            <li key={ing.id}>
              {ing.ingredientName}&nbsp;&nbsp;{ing.quantity}g ({ing.origin}) / {ing.price}원
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.buttonSection}>
        <div className={styles.buttonWrapper}>
          <Button type="button" variant="BASIC" className="flexible" onClick={handleEditPost}>
            수정하기
          </Button>
          <Button type="button" variant="BASIC" className="flexible" onClick={handleDeletePost}>
            삭제하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
