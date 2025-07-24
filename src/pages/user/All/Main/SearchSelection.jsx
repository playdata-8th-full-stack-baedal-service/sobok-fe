import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './MainPage.module.scss';
import axiosInstance from '../../../../services/axios-config';

function SearchSelection({ setSearchState }) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef(null);
  const debounceTimer = useRef(null);

  // fetchSearch에서는 setResults만!
  const fetchSearch = async (searchWord = keyword) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/cook-service/cook/search-cook', {
        params: {
          keyword: searchWord,
          pageNo: 1,
          numOfRows: 5,
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
    }
  };

  // keyword가 바뀔 때마다 자동 검색 (디바운스 적용)
  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      setSearchState(prev => ({
        ...prev,
        showResults: false,
        results: [],
        currentKeyword: '', // 🔥 키워드 초기화
        resultsRef,
      }));
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchSearch(keyword);
    }, 300);

    return () => clearTimeout(debounceTimer.current);
    // eslint-disable-next-line
  }, [keyword]);

  // results가 바뀔 때마다 setSearchState로 부모에 전달
  useEffect(() => {
    setSearchState(prev => ({
      ...prev,
      showResults: !!keyword.trim(),
      results,
      currentKeyword: keyword.trim(), // 🔥 현재 키워드 저장
      resultsRef,
    }));
    // eslint-disable-next-line
  }, [results, keyword]);

  // 엔터키/버튼 클릭 시 즉시 검색
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      fetchSearch();
    }
  };

  const handleButtonClick = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    fetchSearch();
  };

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = event => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setSearchState(prev => ({
          ...prev,
          showResults: false,
          results: [],
          currentKeyword: prev.currentKeyword, // 🔥 키워드는 유지
          resultsRef,
        }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      return undefined;
    };
    // eslint-disable-next-line
  }, []);

  const handleInputChange = e => setKeyword(e.target.value);

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
          disabled={loading}
          className={styles.searchbarbutton}
          onClick={handleButtonClick}
        >
          {loading ? '검색 중...' : '검색'}
        </button>
      </div>
    </div>
  );
}

SearchSelection.propTypes = {
  setSearchState: PropTypes.func.isRequired,
};

export default SearchSelection;