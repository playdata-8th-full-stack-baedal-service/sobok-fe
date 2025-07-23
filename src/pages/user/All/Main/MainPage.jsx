import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import PostListPage from '../../Post/PostList/PostListPage';
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

  return (
    <div className={styles.MainPage}>
      <SearchSelection searchState={searchState} setSearchState={setSearchState} />
      {searchState.showResults && (
        <div ref={searchState.resultsRef} className={styles.searchResults}>
          {searchState.results.length === 0 ? (
            <div>검색결과가 없습니다.</div>
          ) : (
            searchState.results.map(cook => (
              <div key={cook.id}>
                <img src={cook.thumbnail} />
                <p>{cook.title}</p>
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
