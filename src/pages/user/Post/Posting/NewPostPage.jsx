import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '@/services/axios-config';
import styles from './NewPostPage.module.scss';
import Button from '@/common/components/Button';
import { API_BASE_URL } from '@/services/host-config';
import { useLocation, useNavigate } from 'react-router-dom';
import TiptapEditor from '@/common/forms/Post/TiptapEditor';

function NewPostPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentId = location.state?.paymentId;
  const cookId = location.state?.cookId;
  const cookName = location.state?.cookName;

  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [imageList, setImageList] = useState([]); // 게시글 이미지들
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!paymentId || !cookId) {
      alert('잘못된 접근입니다.');
      navigate(-1);
    }

    const handleBeforeUnload = e => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [paymentId, cookId, navigate]);

  // 이미지 업로드 + imageList에 저장
  const uploadToS3 = async file => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await axios.put(`${API_BASE_URL}/api-service/api/upload-image/post`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    const imageUrl = res.data.data;
    // index는 1부터 시작하여 순차 부여
    setImageList(prev => [...prev, { imageUrl, index: prev.length + 1 }]);
    return imageUrl;
  };

  // 게시글 등록 요청
  const handleSubmit = async () => {
    if (!title || !content || content === '<p></p>') {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setIsUploading(true);
      const body = {
        paymentId,
        posts: [
          {
            title,
            content,
            cookId,
            images: imageList,
          },
        ],
      };

      const res = await axiosInstance.post(`/post-service/post/register`, body);
      const posts = res.data?.posts;
      if (posts && posts.length > 0 && posts[0].postId) {
        alert('게시글이 등록되었습니다.');
        navigate(`/user/post/${posts[0].postId}`, { replace: true });
      } else {
        throw new Error('등록 응답이 올바르지 않습니다.');
      }
    } catch (err) {
      if (err.response?.status === 404) alert('결제 정보가 존재하지 않습니다.');
      else if (err.response?.status === 500) alert('서버 통신 오류가 발생했습니다.');
      else alert('게시글 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles['post-wrap']}>
      <h2 className={styles['cook-name']}>요리 이름: {cookName}</h2>
      <div className={styles['title-group']}>
        <label htmlFor="post-title" className={styles['title-label']}>
          제목:
        </label>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={styles['title-input']}
        />
      </div>
      <TiptapEditor content={content} setContent={setContent} uploadImageToServer={uploadToS3} />

      <Button onClick={handleSubmit} variant="BASIC" className="flexible" disabled={isUploading}>
        {isUploading ? '업로드 중...' : '게시글 등록'}
      </Button>
    </div>
  );
}

export default NewPostPage;
