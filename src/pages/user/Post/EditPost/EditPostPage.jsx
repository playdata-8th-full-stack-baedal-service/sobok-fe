import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import axiosInstance from '@/services/axios-config';
import styles from './EditPostPage.module.scss';
import Button from '@/common/components/Button';

const EditPostPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state?.post;

  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef();

  useEffect(() => {
    if (!post) {
      alert('잘못된 접근입니다.');
      navigate(-1);
      return;
    }

    setTitle(post.title);

    const editor = editorRef.current?.getInstance();
    editor?.setHTML(post.content); // 기존 내용 세팅
  }, [post, navigate]);

  const handleSubmit = async () => {
    const content = editorRef.current.getInstance().getHTML();

    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      const body = {
        postId: post.postId,
        title,
        content,
        images: [], // 이미지 기능 제거됨
      };

      const res = await axiosInstance.put('/post-service/post/update', body);

      if (res.data?.success) {
        alert('게시글이 수정되었습니다.');
        navigate(`/user/post/${post.postId}`);
      } else {
        alert(res.data.message || '게시글 수정 실패');
      }
    } catch (err) {
      if (err.response?.status === 403) {
        alert('권한이 없습니다.');
      } else if (err.response?.status === 404) {
        alert('게시글이 존재하지 않습니다.');
      } else {
        alert('서버 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles['edit-wrap']}>
      <h2>게시글 수정</h2>

      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className={styles['title-input']}
        placeholder="제목을 입력하세요"
      />

      <Editor
        ref={editorRef}
        previewStyle="vertical"
        height="500px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        toolbarItems={[
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task'],
          ['table'],
          ['code', 'codeblock'],
        ]}
      />

      <Button onClick={handleSubmit} variant="BASIC" disabled={isSubmitting}>
        {isSubmitting ? '수정 중...' : '수정 완료'}
      </Button>
    </div>
  );
};

export default EditPostPage;
