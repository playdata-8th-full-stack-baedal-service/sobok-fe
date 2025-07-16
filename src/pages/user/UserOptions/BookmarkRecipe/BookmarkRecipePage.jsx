import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../services/axios-config';
import CookGrid from '../../All/component/CookGrid';
import styles from './BookmarkRecipePage.module.scss';
import Button from '../../../../common/components/Button';

function BookmarkRecipePage() {
  const [bookmarkList, setBookmarkList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [numOfRows] = useState(12);
  const [isFullLoaded, setIsFullLoaded] = useState([]);

  useEffect(() => {
    async function fetchBookmarkRecipe() {
      const response = await axiosInstance.get('/user-service/user/getBookmark');
      console.log(response.data.data);
      setBookmarkList(response.data.data || []);
      if (response.data.data.length < numOfRows) {
        setIsFullLoaded(true);
      }
    }
    fetchBookmarkRecipe();
  }, [pageNo, numOfRows]);

  return (
    <div className={styles.bookmarkRecipePage}>
      <div className={styles.bookmarkHeader}>
        <h2>북마크한 요리</h2>
      </div>
      <CookGrid items={bookmarkList} />
      {!isFullLoaded && (
        <div className={styles.loadMoreButton}>
          <Button onClick={() => setPageNo(pageNo + 1)}>더보기 +</Button>
        </div>
      )}
    </div>
  );
}

export default BookmarkRecipePage;
