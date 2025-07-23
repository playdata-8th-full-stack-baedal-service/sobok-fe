import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './NewPostPage.module.scss';
import Button from '@/common/components/Button';
import { API_BASE_URL } from '@/services/host-config';
import { useLocation, useNavigate } from 'react-router-dom';
import TiptapEditor from '@/common/forms/Post/TiptapEditor';
import { useDispatch } from 'react-redux';
import { registerPost } from '@/store/postSlice';
import useToast from '@/common/hooks/useToast';

function NewPostPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { showSuccess, showNegative, showInfo } = useToast();

  const paymentId = location.state?.paymentId;
  const cookId = location.state?.cookId;
  const cookName = location.state?.cookName;

  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!paymentId || !cookId) {
      showNegative('잘못된 접근입니다.');
      navigate(-1);
    }

    const handleBeforeUnload = e => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [paymentId, cookId, navigate]);

  // 이미지 업로드 + 서버에 저장
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
    return imageUrl;
  };

  // 게시글 등록 요청
  const handleSubmit = async () => {
    if (!title || !content || content === '<p></p>') {
      showNegative('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setIsUploading(true);

      // 본문 내 이미지 src 추출
      const extractImagesFromContent = html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const imgs = Array.from(doc.querySelectorAll('img')).map((img, i) => ({
          imageUrl: img.getAttribute('src'),
          index: i + 1,
        }));
        return imgs;
      };

      const images = extractImagesFromContent(content);

      console.log(paymentId, cookId, title, content, images);
      const resultAction = await dispatch(
        registerPost({
          paymentId,
          cookId,
          title,
          content,
          imageList: images,
        })
      );

      if (registerPost.fulfilled.match(resultAction)) {
        const { postId } = resultAction.payload;
        showSuccess('게시글이 등록되었습니다.');
        navigate(`/user/post/${postId}`, { replace: true });
      } else {
        throw new Error(resultAction.payload || '등록 실패');
      }
    } catch (err) {
      showNegative(err.message || '게시글 업로드에 실패했습니다.');
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

      <Button onClick={handleSubmit} variant="BASIC" disabled={isUploading}>
        {isUploading ? '업로드 중...' : '등록하기'}
      </Button>
    </div>
  );
}

export default NewPostPage;
