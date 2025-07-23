import React, { useRef, useEffect, useState } from 'react';
import styles from './MainPage.module.scss';
import axiosInstance from '../../../../services/axios-config';

function SearchSelection({ setSearchState }) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    setSearchState(prev => ({
      ...prev,
      showResults,
      results,
      resultsRef,
    }));
  }, [showResults, results]);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = event => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get('/cook-service/cook/search-cook', {
        params: {
          keyword,
          pageNo: 1,
          numOfRows: 10,
        },
      });
      if (res.data.success) {
        setResults(res.data.data);
      } else {
        setResults([]);
      }
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
      setShowResults(true);
    }
  };

  const handleInputChange = e => setKeyword(e.target.value);

  const handleKeyDown = e => {
    if (e.key === 'Enter') fetchSearch();
  };

  return (
    <div className={styles.searchbarcontatiner}>
      <div className={styles.searchbarcontainer}>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className={styles.searchbarinput}
          value={keyword}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={fetchSearch}
          disabled={loading}
          className={styles.searchbarbutton}
        >
          {loading ? '검색 중...' : '검색'}
        </button>
      </div>
      {/* {showResults && (
        <div ref={resultsRef} className={styles.searchResults}>
          {results.length === 0 ? (
            <div>검색결과가 없습니다.</div>
          ) : (
            results.map(cook => (
              <div key={cook.id}>
                <img src={cook.thumbnail} alt={cook.name} />
                <p>{cook.name}</p>
              </div>
            ))
          )}
        </div>
      )} */}
    </div>
  );
}

export default SearchSelection;
