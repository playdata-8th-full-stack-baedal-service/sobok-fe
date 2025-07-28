import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Search } from 'lucide-react';
// import PostListPage from '../../Post/PostList/PostListPage';
import styles from './MainPage.module.scss';
import SearchSelection from './SearchSelection';
import BestPickSelection from './BestPickSelection';
import CategorySelection from './CategorySelection';

function MainPage() {
  const [searchState, setSearchState] = useState({
    showResults: false,
    results: [],
    resultsRef: null,
    currentKeyword: '', // 현재 검색 키워드 추가
  });
  const navigate = useNavigate();

  // 접근성: 키보드 엔터/스페이스로도 이동
  const handleResultItemKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      navigate(`/product?id=${id}`);
    }
  };

  // 더보기 클릭 핸들러 - SearchPage로 이동
  const handleMoreClick = () => {
    if (searchState.currentKeyword) {
      navigate(`/search?keyword=${encodeURIComponent(searchState.currentKeyword)}`);
    }
  };

  // 더보기 키보드 이벤트 핸들러
  const handleMoreKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleMoreClick();
    }
  };

  return (
    <div className={styles.MainPage}>
      <SearchSelection searchState={searchState} setSearchState={setSearchState} />
      {searchState.showResults && (
        <div ref={searchState.resultsRef} className={styles.searchResults}>
          {searchState.results.length === 0 ? (
            <div>검색결과가 없습니다.</div>
          ) : (
            <>
              {searchState.results.map(cook => (
                <div
                  key={cook.id}
                  className={styles.searchResultItem}
                  onClick={() => navigate(`/product?id=${cook.id}`)}
                  onKeyDown={e => handleResultItemKeyDown(e, cook.id)}
                  tabIndex={0}
                  role="button"
                  style={{ cursor: 'pointer' }}
                  aria-label={`${cook.name} 상세페이지로 이동`}
                >
                  <p>{cook.name}</p>
                </div>
              ))}
              {/* 더보기 항목 - 검색 결과가 있고 현재 키워드가 있을 때만 표시 */}
              {searchState.currentKeyword && searchState.results.length > 0 && (
                <div
                  className={styles.moreResultsItem}
                  onClick={handleMoreClick}
                  onKeyDown={handleMoreKeyDown}
                  tabIndex={0}
                  role="button"
                  style={{ cursor: 'pointer' }}
                  aria-label={`"${searchState.currentKeyword}" 더 많은 검색 결과 보기`}
                >
                  <p>더보기</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
      <BestPickSelection />
      <hr />
      <CategorySelection />
    </div>
  );
}

export default MainPage;
