import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './MainPage.module.scss';
import axiosInstance from '../../../../services/axios-config';

function SearchSelection({ setSearchState }) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef(null);
  const debounceTimer = useRef(null);
  const navigate = useNavigate();

  // Clear debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Memoize fetchSearch to prevent unnecessary re-renders
  const fetchSearch = useCallback(async (searchWord = keyword) => {
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
      console.error('Search error:', e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  // Debounced search when keyword changes
  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      setSearchState(prev => ({
        ...prev,
        showResults: false,
        results: [],
        currentKeyword: '',
        resultsRef,
      }));
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchSearch(keyword);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [keyword, fetchSearch, setSearchState]);

  // Update parent state when results change
  useEffect(() => {
    setSearchState(prev => ({
      ...prev,
      showResults: !!keyword.trim(),
      results,
      currentKeyword: keyword.trim(),
      resultsRef,
    }));
  }, [results, keyword, setSearchState]);

  // Handle enter key press - 검색 페이지로 이동
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && keyword.trim()) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      // 검색 페이지로 이동
      navigate(`/user/search?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  }, [keyword, navigate]);

  // Handle search button click - 검색 페이지로 이동
  const handleButtonClick = useCallback(() => {
    if (keyword.trim()) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      // 검색 페이지로 이동
      navigate(`/user/search?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  }, [keyword, navigate]);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setSearchState(prev => ({
          ...prev,
          showResults: false,
          results: [],
          currentKeyword: prev.currentKeyword,
          resultsRef,
        }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setSearchState]);

  const handleInputChange = useCallback((e) => {
    setKeyword(e.target.value);
  }, []);

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
          onFocus={() => fetchSearch()}
        />
        <button
          type="button"
          disabled={loading || !keyword.trim()} // 키워드가 없으면 버튼 비활성화
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