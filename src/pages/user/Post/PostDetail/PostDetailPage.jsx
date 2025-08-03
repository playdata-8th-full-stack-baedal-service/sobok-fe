/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/axios-config';
import styles from './PostDetailPage.module.scss';
import Button from '@/common/components/Button';
import { Heart } from 'lucide-react';
import useToast from '@/common/hooks/useToast';
import commonStyles from '@/common/forms/Post/PostContent.module.scss';
import axios from 'axios';
import { API_BASE_URL } from '../../../../services/host-config';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showNegative, showInfo } = useToast();

  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const currentUserId = localStorage.getItem('USER_ID');

  // // 해당 요리 페이지로 이동
  const handleCookPage = () => {
    navigate(`/product?id=${post.cookId}`);
  };

  // 게시글 수정
  const handleEditPost = () => {
    navigate('/user/edit-post', { state: { post } });
  };

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!window.confirm('정말로 게시글을 삭제하시겠습니까?')) return;

    try {
      await axiosInstance.delete(`/post-service/post/delete/${id}`);
      showSuccess('게시글이 성공적으로 삭제되었습니다.');
      navigate('/user/my-posts');
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) showNegative('해당 게시글에 대한 권한이 없습니다.');
      else if (status === 404) showNegative('게시글이 존재하지 않습니다.');
      else showNegative('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  // 좋아요 / 취소
  const handleLikePost = async () => {
    if (isLiked) {
      try {
        await axiosInstance.delete('/user-service/user/user-unlike', {
          data: { postId: Number(id) },
        });
        setIsLiked(false);
        setPost(prev => ({ ...prev, likeCount: prev.likeCount - 1 }));
        showInfo('좋아요가 취소되었습니다.');
      } catch (err) {
        if (err.response?.status === 404) showNegative('좋아요 정보가 없습니다.');
        else showNegative('좋아요 해제 중 오류가 발생했습니다.');
      }
    } else {
      try {
        await axiosInstance.post('/user-service/user/user-like', { postId: Number(id) });
        setIsLiked(true);
        setPost(prev => ({ ...prev, likeCount: prev.likeCount + 1 }));
        showSuccess('좋아요 되었습니다.');
      } catch (err) {
        const status = err.response?.status;
        if (err.response?.data.status === 400) {
          setIsLiked(true);
          showInfo('이미 좋아요한 게시글입니다.');
        } else if (status === 404) {
          showNegative('게시글이 존재하지 않습니다.');
        } else {
          showNegative('좋아요 등록 중 오류가 발생했습니다.');
        }
      }
    }
  };

  const fetchCheckLike = async () => {
    try {
      if (localStorage.getItem('ACCESS_TOKEN') === null) return;
      const res = await axiosInstance.get(`/user-service/user/check-like?postId=${id}`);
      setIsLiked(res.data.data);
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) showNegative('존재하지 않는 게시글입니다.');
      else showNegative('게시글을 불러오는 중 오류가 발생했습니다.');
    }
  };

  // 게시글 상세 조회
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/post-service/post/detail/${id}`);
        setPost(res.data.data);
      } catch (err) {
        const status = err.response?.status;
        if (status === 404) setError('존재하지 않는 게시글입니다.');
        else setError('게시글을 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchPostDetail();
    fetchCheckLike();
  }, [id]);

  if (error) return <div className={styles.error}>{error}</div>;
  if (!post) return <div className={styles.loading}>로딩 중...</div>;

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  return (
    <div className={styles.container}>
      {/* 상단 영역 */}
      <div className={styles.header}>
        <div className={styles.leftTop}>
          {/* <p>
            <strong>요리 이름</strong> : {post.cookName}
          </p> */}
          <Button type="button" variant="BASIC" className="flexible" onClick={handleCookPage}>
            {post.cookName}
          </Button>
          <p>
            <strong>제목</strong> : {post.title}
          </p>
          <div className={styles.likeSection} onClick={handleLikePost}>
            <span>
              <Heart size={16} fill={isLiked ? 'red' : 'white'} color="red" />
              좋아요 {post.likeCount}
            </span>
          </div>
        </div>
        <div className={styles.rightTop}>
          <p>
            <strong>작성자</strong> : {post.nickname}
          </p>
          <p>
            <strong>작성 날짜</strong> : {formatDate(post.updatedAt)}
          </p>
        </div>
      </div>

      {/* 본문 */}
      <div className={styles.contentSection}>
        <div
          className={commonStyles.postContent}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* 하단 영역 */}
      <div className={styles.bottom}>
        <div className={styles.leftBottom}>
          <strong>주문된 추가 식재료 :</strong>
          {post.additionalIngredients?.length > 0 ? (
            <ul>
              {post.additionalIngredients.map(item => (
                <li key={item.ingredientId}>
                  {item.ingredientName}({item.origin}) {item.quantity}g
                </li>
              ))}
            </ul>
          ) : (
            <span className={styles.noIngredient}>없음</span>
          )}
        </div>

        <div className={styles.rightBottom}>
          {String(post.authId) === String(currentUserId) && (
            <div className={styles.buttonWrapper}>
              <Button type="button" variant="BASIC" onClick={handleEditPost}>
                수정하기
              </Button>
              <Button type="button" variant="BASIC" onClick={handleDeletePost}>
                삭제하기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
