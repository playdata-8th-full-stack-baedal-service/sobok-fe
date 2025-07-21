import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import styles from './PostListPage.module.scss';
import axiosInstance from '../../../../services/axios-config';

function PostListPage() {
  const [postList, setPostList] = useState([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('LIKE');
  const SIZE = 12;

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    768: 2,
    500: 1,
  };

  useEffect(() => {
    setPage(0);
    fetchPostList(0, true);
  }, [sortBy]);

  const fetchPostList = async pageNum => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        size: SIZE,
        ...(sortBy && { sortBy }),
      };

      const response = await axiosInstance.get('post-service/post/post-list', { params });
      console.log(response.data.data.content);

      setPostList(prev =>
        pageNum === 0 ? response.data.data.content : [...prev, response.data.data.content]
      );
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

  return (
    <div className={styles.wrap}>
      <div className={styles.sortBar}>
        <label>정렬: </label>
        <select onChange={handleSortChange} value={sortBy || ''}>
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
          <div key={post.postId} className={styles.card}>
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
        <button onClick={handleLoadMore} className={styles.loadMoreBtn}>
            {loading ? '로딩중...' : '더보기'}
        </button>
      )}
    </div>
  );
}

export default PostListPage;
