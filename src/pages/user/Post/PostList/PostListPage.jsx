import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import { useNavigate } from 'react-router-dom';
import styles from './PostListPage.module.scss';
import axiosInstance from '../../../../services/axios-config';

function PostListPage() {
  const [postList, setPostList] = useState([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(''); // 최신순이 기본값
  const SIZE = 16;
  const navigate = useNavigate();

  // 4x4 고정 Masonry 컬럼 (반응형 최소 2컬럼)
  const breakpointColumnsObj = {
    default: 4,
    1200: 4,
    900: 3,
    600: 2,
    0: 1,
  };

  useEffect(() => {
    setPage(0);
    fetchPostList(0, sortBy);
    // eslint-disable-next-line
  }, [sortBy]);

  const fetchPostList = async (pageNum, forceSortBy = sortBy) => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        size: SIZE,
        ...(forceSortBy && { sortBy: forceSortBy }),
      };

      const response = await axiosInstance.get('post-service/post/post-list', { params });
      let { content } = response.data.data;

      // 좋아요순일 때, 0개인 게시글은 최신순으로 뒤에 정렬
      if (forceSortBy === 'LIKE' && content.length > 0) {
        const likedPosts = content.filter(post => post.likeCount > 0);
        const zeroLikePosts = content
          .filter(post => post.likeCount === 0)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 최신순
        content = [...likedPosts, ...zeroLikePosts];
      }

      // 기존의 "모두 0이거나 모두 동일하면 최신순" 로직은 유지
      if (
        forceSortBy === 'LIKE' &&
        (content.length === 0 ||
          content.every(post => post.likeCount === 0) ||
          content.every(post => post.likeCount === content[0]?.likeCount))
      ) {
        if (forceSortBy !== null) {
          await fetchPostList(pageNum, null);
        }
        return;
      }

      setPostList(prev => (pageNum === 0 ? content : [...prev, ...content]));
      setPage(response.data.page);
      setLastPage(response.data.last);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!lastPage) {
      fetchPostList(page + 1);
    }
  };

  const handleSortChange = e => {
    const selected = e.target.value;
    setSortBy(selected === 'LIKE' ? 'LIKE' : null);
  };

  // 카드 클릭 시 상세 페이지 이동
  const handleCardClick = postId => {
    navigate(`/user/post/${postId}`);
  };

  // 접근성: 엔터/스페이스로도 이동
  const handleCardKeyDown = (e, postId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleCardClick(postId);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.sortBar}>
        <label htmlFor="sortSelect">정렬: </label>
        <select id="sortSelect" onChange={handleSortChange} value={sortBy || ''}>
          <option value="">최신순</option>
          <option value="LIKE">좋아요순</option>
        </select>
      </div>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.masonryGrid}
        columnClassName={styles.masonryColumn}
      >
        {postList.map(post => (
          <div
            key={post.postId}
            className={styles.card}
            tabIndex={0}
            role="button"
            onClick={() => handleCardClick(post.postId)}
            onKeyDown={e => handleCardKeyDown(e, post.postId)}
            style={{ cursor: 'pointer', outline: 'none' }}
            aria-label={`${post.title} 상세페이지로 이동`}
          >
            <img src={post.thumbnail} alt={post.title} />
            <div className={styles.info}>
              <h3>{post.title}</h3>
              <p>{post.cookName}</p>
              <span>{post.likeCount}</span>
            </div>
          </div>
        ))}
      </Masonry>

      {!lastPage && (
        <button type="button" onClick={handleLoadMore} className={styles.loadMoreBtn}>
          {loading ? '로딩중...' : '더보기'}
        </button>
      )}
    </div>
  );
}

export default PostListPage;
