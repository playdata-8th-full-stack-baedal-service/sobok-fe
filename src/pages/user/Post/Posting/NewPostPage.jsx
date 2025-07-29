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
  const { showSuccess, showNegative } = useToast();

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

  const uploadToS3 = async file => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await axios.put(`${API_BASE_URL}/api-service/api/upload-image/post`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data.data;
  };

  const handleSubmit = async () => {
    if (!title || !content || content === '<p></p>') {
      showNegative('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setIsUploading(true);

      const extractImagesFromContent = html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return Array.from(doc.querySelectorAll('img')).map((img, i) => ({
          imageUrl: img.getAttribute('src'),
          index: i + 1,
        }));
      };

      const images = extractImagesFromContent(content);

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
        navigate(`/post/${postId}`, { replace: true });
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

      {/* 작성 & 미리보기 영역 */}
      <div className={styles['editor-preview-container']}>
        <div className={styles['editor-section']}>
          <TiptapEditor
            content={content}
            setContent={setContent}
            uploadImageToServer={uploadToS3}
          />
        </div>
        <div className={styles['preview-section']}>
          <h3>미리보기</h3>
          <div
            className={styles['preview-content']}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>

      <Button onClick={handleSubmit} variant="BASIC" disabled={isUploading}>
        {isUploading ? '업로드 중...' : '등록하기'}
      </Button>
    </div>
  );
}

export default NewPostPage;
