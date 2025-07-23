import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './EditPostPage.module.scss';
import Button from '@/common/components/Button';
import TiptapEditor from '@/common/forms/Post/TiptapEditor';
import { API_BASE_URL } from '@/services/host-config';
import useToast from '@/common/hooks/useToast';

const EditPostPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state?.post;
  const { showSuccess, showNegative, showInfo } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cookName, setCookName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!post) {
      showNegative('잘못된 접근입니다.');
      navigate(-1);
      return;
    }

    setTitle(post.title);
    setContent(post.content);
    setCookName(post.cookName);
  }, [post, navigate]);

  const extractImagesFromContent = html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imgs = Array.from(doc.querySelectorAll('img')).map((img, i) => ({
      imageUrl: img.getAttribute('src'),
      index: i + 1,
    }));
    return imgs;
  };

  const uploadImageToServer = async file => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.put(`${API_BASE_URL}/api-service/api/upload-image/post`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data?.data;
    } catch (err) {
      console.error('이미지 업로드 실패', err);
      showNegative('이미지 업로드에 실패했습니다.');
      return '';
    }
  };

  const handleSubmit = async () => {
    if (!title || !content || content === '<p></p>') {
      showNegative('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      const images = extractImagesFromContent(content);

      const body = {
        postId: post.postId,
        title,
        content,
        images,
      };

      const res = await axios.put(`${API_BASE_URL}/post-service/post/update`, body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
        },
      });

      if (res.data?.success) {
        showSuccess('게시글이 수정되었습니다.');
        navigate(`/user/post/${post.postId}`);
      } else {
        showNegative(res.data.message || '게시글 수정 실패');
      }
    } catch (err) {
      if (err.response?.status === 403) showNegative('권한이 없습니다.');
      else if (err.response?.status === 404) showNegative('게시글이 존재하지 않습니다.');
      else showNegative('서버 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles['edit-wrap']}>
      <h2 className={styles['cook-name']}>요리 이름: {cookName}</h2>

      <div className={styles['title-group']}>
        <label htmlFor="post-title" className={styles['title-label']}>
          제목:
        </label>
        <input
          type="text"
          id="post-title"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={styles['title-input']}
        />
      </div>

      <TiptapEditor
        content={content}
        setContent={setContent}
        uploadImageToServer={uploadImageToServer}
      />

      <Button onClick={handleSubmit} variant="BASIC" disabled={isSubmitting}>
        {isSubmitting ? '수정 중...' : '수정 완료'}
      </Button>
    </div>
  );
};

export default EditPostPage;
