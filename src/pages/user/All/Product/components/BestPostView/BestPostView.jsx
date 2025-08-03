import React from 'react';
import styles from './BestPostView.module.scss';
import { Heart } from 'lucide-react';

const BestPostView = ({ posts, onClick }) => {
  if (!posts) return <p className={styles.loadingMessage}>불러오는 중...</p>;
  if (posts.length === 0) return <p className={styles.emptyMessage}>등록된 게시글이 없습니다.</p>;

  return (
    <section className={styles.bestPostSection}>
      <h2 className={styles.sectionTitle}>레시피 Best 3</h2>
      <div className={styles.postListWrapper}>
        <div className={styles.postList}>
          {posts.map(post => (
            <div key={post.postId} className={styles.postCard} onClick={() => onClick(post.postId)}>
              <img src={post.thumbnail} alt={post.title} className={styles.thumbnail} />
              <div className={styles.postInfo}>
                <span className={styles.title}>{post.title}</span>
                <div className={styles.likes}>
                  <Heart size={16} fill="red" color="red" />
                  <span>{post.likeCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestPostView;
