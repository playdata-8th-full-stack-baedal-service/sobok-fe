import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import axiosInstance from '@/services/axios-config';
import styles from './NewPostPage.module.scss';
import Button from '@/common/components/Button';
import { API_BASE_URL } from '@/services/host-config';
import { useLocation, useNavigate } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

function NewPostPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentId = location.state?.paymentId;
  const cookId = location.state?.cookId;
  const cookName = location.state?.cookName;

  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const editorRef = useRef();

  // 잘못된 접근 방지
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

  // S3 이미지 업로드
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

  // 게시글 등록 요청
  const handleSubmit = async () => {
    const editorInstance = editorRef.current.getInstance();
    const contentHTML = editorInstance.getHTML();

    if (!title || !contentHTML || contentHTML === '<p><br></p>') {
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
            content: contentHTML,
            cookId,
            images: imageList,
          },
        ],
      };

      const res = await axiosInstance.post(`/post-service/post/register`, body);

      const posts = res.data?.posts;
      if (posts && posts.length > 0 && posts[0].postId) {
        const postId = posts[0].postId;
        alert('게시글이 등록되었습니다.');
        navigate(`/user/post/${postId}`, { replace: true });
      } else {
        throw new Error('등록 응답이 올바르지 않습니다.');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        alert('결제 정보가 존재하지 않습니다.');
      } else if (err.response?.status === 500) {
        alert('서버 통신 오류가 발생했습니다.');
      } else {
        console.error('업로드 실패:', err);
        alert('게시글 업로드에 실패했습니다.');
      }
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

      <Editor
        ref={editorRef}
        previewStyle="vertical"
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        hooks={{
          addImageBlobHook: async (blob, callback) => {
            try {
              const imageUrl = await uploadToS3(blob);

              const newImage = {
                imageUrl,
                index: imageList.length + 1,
              };

              setImageList(prev => [...prev, newImage]);
              callback(imageUrl, 'image');
            } catch (err) {
              alert('이미지 업로드에 실패했습니다.');
              console.error('이미지 업로드 오류:', err);
            }
          },
        }}
      />

      <Button onClick={handleSubmit} variant="BASIC" disabled={isUploading}>
        {isUploading ? '업로드 중...' : '게시글 등록'}
      </Button>
    </div>
  );
}

export default NewPostPage;
