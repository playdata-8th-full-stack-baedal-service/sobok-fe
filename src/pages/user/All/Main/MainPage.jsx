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
  });
  const navigate = useNavigate();

  // 접근성: 키보드 엔터/스페이스로도 이동
  const handleResultItemKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      navigate(`/user/product?id=${id}`);
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
            searchState.results.map(cook => (
              <div
                key={cook.id}
                className={styles.searchResultItem}
                onClick={() => navigate(`/user/product?id=${cook.id}`)}
                onKeyDown={e => handleResultItemKeyDown(e, cook.id)}
                tabIndex={0}
                role="button"
                style={{ cursor: 'pointer' }}
                aria-label={`${cook.name} 상세페이지로 이동`}
              >
                <img src={cook.thumbnail} alt={cook.name} />
                <p>{cook.name}</p>
              </div>
            ))
          )}
        </div>
      )}
      <BestPickSelection />
      <CategorySelection />
    </div>
  );
}

export default MainPage;
