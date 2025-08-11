import React, { useEffect, useRef } from 'react';
import styles from './BestPostView.module.scss';
import { Heart } from 'lucide-react';

const PostCard = ({ post, onClick }) => {
  const titleRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const titleElement = titleRef.current;
    const containerElement = containerRef.current;
    
    if (titleElement && containerElement) {
      const textWidth = titleElement.scrollWidth;
      const containerWidth = containerElement.clientWidth;
      
      // 제목이 컨테이너보다 길면 overflow 클래스 추가
      if (textWidth > containerWidth) {
        titleElement.classList.add(styles.overflow);
      } else {
        titleElement.classList.remove(styles.overflow);
      }
    }
  }, [post.title]);

  return (
    <div
      className={styles.postCard}
      onClick={() => onClick(post.postId)}
    >
      <img
        src={post.thumbnail}
        alt={post.title}
        className={styles.thumbnail}
      />
      <div className={styles.postInfo}>
        <div className={styles.titleContainer} ref={containerRef}>
          <span className={styles.title} ref={titleRef}>
            {post.title}
          </span>
        </div>
        <div className={styles.likes}>
          <Heart size={16} fill="red" color="red" />
          <span>{post.likeCount}</span>
        </div>
      </div>
    </div>
  );
};

const BestPostView = ({ posts, onClick }) => {
  return (
    <section className={styles.bestPostSection}>
      <h2 className={styles.sectionTitle}>레시피 Best 3</h2>
      <div className={styles.postListWrapper}>
        {!posts ? (
          <p className={styles.loadingMessage}>불러오는 중...</p>
        ) : posts.length === 0 ? (
          <p className={styles.emptyMessage}>등록된 게시글이 없습니다.</p>
        ) : (
          <div className={styles.postList}>
            {posts.map(post => (
              <PostCard
                key={post.postId}
                post={post}
                onClick={onClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestPostView;