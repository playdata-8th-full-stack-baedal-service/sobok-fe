import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import styles from './PostListPage.module.scss';
import axiosInstance from '../../../../services/axios-config';
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function PostListPage() {
  const [postList, setPostList] = useState([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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
    if (pageNum === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

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
      setLoadingMore(false);
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
    navigate(`/post/${postId}`);
  };

  // 접근성: 엔터/스페이스로도 이동
  const handleCardKeyDown = (e, postId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleCardClick(postId);
    }
  };

  // 스켈레톤 카드 렌더링
  const renderSkeletonCards = () => {
    return Array.from({ length: SIZE }, (_, index) => (
      <div key={`skeleton-${index}`} className={styles.card}>
        <Skeleton height={200} />
        <div className={styles.info}>
          <Skeleton height={24} style={{ marginBottom: '8px' }} />
          <Skeleton height={16} width="70%" style={{ marginBottom: '4px' }} />
          <Skeleton height={16} width="50%" style={{ marginBottom: '4px' }} />
          <Skeleton height={14} width="60%" style={{ marginBottom: '8px' }} />
          <Skeleton height={16} width="35%" />
        </div>
      </div>
    ));
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

      <SkeletonTheme baseColor="#f0f0f0" highlightColor="#f8f8f8">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={styles.masonryGrid}
          columnClassName={styles.masonryColumn}
        >
          {loading
            ? renderSkeletonCards()
            : postList.map(post => (
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
                    <p>{post.nickName}</p>
                    <p className={styles.date}>
                      <strong>작성일</strong>:{' '}
                      {new Date(post.updatedAt).toLocaleDateString('ko-KR')}
                    </p>
                    <span>
                      <Heart size={16} fill="red" color="red" /> {post.likeCount}
                    </span>
                  </div>
                </div>
              ))}
        </Masonry>
      </SkeletonTheme>

      {!loading && postList.length === 0 && <p className={styles.emptyText}>게시물이 없습니다.</p>}

      {postList.length >= SIZE && !lastPage && (
        <button
          type="button"
          onClick={handleLoadMore}
          className={styles.loadMoreBtn}
          disabled={loadingMore}
        >
          {loadingMore ? <Skeleton width={60} height={20} /> : '더보기'}
        </button>
      )}
    </div>
  );
}

export default PostListPage;
