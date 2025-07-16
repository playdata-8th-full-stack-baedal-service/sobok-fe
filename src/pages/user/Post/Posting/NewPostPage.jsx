import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './NewPostPage.module.scss';
import Button from '@/common/components/Button';
import { API_BASE_URL } from '@/services/host-config';
import { useLocation, useNavigate } from 'react-router-dom';

function NewPostPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentId = location.state?.paymentId;

  const [postId, setPostId] = useState(null);
  const [cookName, setCookName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // 업로드 중 상태

  // 새로고침 또는 탭 닫기 방지
  useEffect(() => {
    const handleBeforeUnload = e => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!paymentId) {
      alert('잘못된 접근입니다.');
      navigate(-1);
      return;
    }

    const fetchPostData = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/post-service/post/register`, {
          paymentId: paymentId,
        });
        setPostId(response.data.postId);
        setCookName(response.data.cookName);
      } catch (error) {
        console.error('게시글 등록 정보 불러오기 실패:', error);
        alert('게시글 정보를 불러올 수 없습니다.');
      }
    };

    fetchPostData();
  }, [paymentId, navigate]);

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    const total = imageFiles.length + files.length;

    if (total > 8) {
      alert('최대 8장의 사진만 업로드할 수 있습니다.');
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setImageFiles(prev => [...prev, ...files]);
  };

  const handleImageDelete = index => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const getTempToken = async () => {
    const response = await axios.get(`${API_BASE_URL}/auth-service/auth/temp-token`);
    return response.data.data;
  };

  const uploadToS3 = async (file, tempToken) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axios.put(
      `${API_BASE_URL}/api-service/api/upload-image/post`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${tempToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setIsUploading(true);

      const tempToken = await getTempToken();
      const uploadedUrls = await Promise.all(imageFiles.map(file => uploadToS3(file, tempToken)));

      const images = uploadedUrls.map((url, idx) => ({
        imageUrl: url,
        index: idx + 1,
      }));

      const body = {
        title,
        content,
        paymentId,
        images,
      };

      await axios.post(`${API_BASE_URL}/post-service/post/save`, body);
      alert('게시글이 등록되었습니다.');

      navigate('/user/my-posts');
    } catch (error) {
      console.error('게시글 업로드 실패:', error);
      alert('게시글 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles['post-wrap']}>
      <h2 className={styles['cook-name']}>요리 이름: {cookName}</h2>

      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className={styles['title-input']}
      />

      <textarea
        placeholder="내용을 입력하세요"
        value={content}
        onChange={e => setContent(e.target.value)}
        className={styles['content-input']}
      />

      <div className={styles['image-upload-section']}>
        <label className={styles['image-upload-label']}>
          사진 첨부하기 (최대 8장)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: 'none' }}
            disabled={isUploading}
          />
        </label>

        <div className={styles['preview-container']}>
          {imagePreviews.map((url, index) => (
            <div key={index} className={styles['preview-box']}>
              <img src={url} alt={`preview-${index}`} />
              <button
                type="button"
                className={styles['delete-button']}
                onClick={() => handleImageDelete(index)}
                disabled={isUploading}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit} variant="BASIC" disabled={isUploading}>
        {isUploading ? '업로드 중...' : '게시글 등록'}
      </Button>
    </div>
  );
}

export default NewPostPage;
