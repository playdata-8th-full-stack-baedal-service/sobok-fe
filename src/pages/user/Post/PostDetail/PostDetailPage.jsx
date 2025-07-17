import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/services/axios-config';
import styles from './PostDetailPage.module.scss';

const PostDetailPage = () => {
  const { id } = useParams();
  console.log('받아온 postId:', id);
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

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
        </div>
      </div>

      <div className={styles.contentSection}>
        <div
          className={styles.textContent}
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
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
              {ing.name} - {ing.quantity}
              {ing.unit} ({ing.origin}) / {ing.price}원
            </li>
          ))}
        </ul>

        <h3>추가 재료</h3>
        <ul>
          {post.additionalIngredients.map(ing => (
            <li key={ing.id}>
              {ing.name} - {ing.quantity}
              {ing.unit} ({ing.origin}) / {ing.price}원
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.buttonSection}>
        <button onClick={() => console.log('수정 클릭')} className={styles.button}>
          수정하기
        </button>
        <button onClick={() => console.log('삭제 클릭')} className={styles.button}>
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default PostDetailPage;
