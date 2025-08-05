import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Search } from 'lucide-react';
import axiosInstance from '@/services/axios-config';
import { openModal } from '@/store/modalSlice';
import style from '../RecipeRegistPage.module.scss';

function SearchInput({
  placeholder = '검색어를 입력하세요.',
  onIngredientAdded,
  onIngredientSelect,
  resetSignal,
}) {
  const [viewDropDown, setViewDropDown] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const isSelectionInProgress = useRef(false);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  // resetSignal 변경 시 검색어 초기화
  useEffect(() => {
    setQuery('');
  }, [resetSignal]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setViewDropDown(false);
      }
    };

    if (viewDropDown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [viewDropDown]);

  // 드롭다운 닫을 때 페이지 초기화
  useEffect(() => {
    if (!viewDropDown) {
      setCurrentPage(1);
    }
  }, [viewDropDown]);

  // 검색 요청
  const fetchIngredients = async (keyword = '') => {
    setIsSearching(true);
    try {
      const response = await axiosInstance.get(
        `/cook-service/ingredient/keyword-search?keyword=${keyword}`
      );
      if (response.data.success && Array.isArray(response.data.data)) {
        setResult(response.data.data);
        setCurrentPage(1);
      } else {
        setResult([]);
      }
      setViewDropDown(true);
    } catch (err) {
      console.error(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
      setResult([]);
      setViewDropDown(true);
    } finally {
      setIsSearching(false);
    }
  };

  // 입력 시 검색
  useEffect(() => {
    if (isSelectionInProgress.current) {
      isSelectionInProgress.current = false;
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length > 0) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchIngredients(query);
      }, 300);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleInputClick = () => {
    fetchIngredients('');
  };

  const handleInputChange = e => {
    setQuery(e.target.value);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleSelect = item => {
    if (onIngredientSelect) {
      onIngredientSelect(item);
    }
    setQuery('');
    setResult([]);
    setViewDropDown(false);
  };

  const handleAddIngredient = () => {
    dispatch(
      openModal({
        type: 'INGREDIENT_REGISTER',
        props: {
          initialIngreName: query,
          onSuccess: async newName => {
            setQuery('');
            setViewDropDown(false);
            try {
              const res = await axiosInstance.get(
                `/cook-service/ingredient/keyword-search?keyword=${newName}`
              );
              if (res.data.success && res.data.data.length > 0) {
                if (onIngredientSelect) {
                  onIngredientSelect(res.data.data[0]);
                }
              }
            } catch (err) {
              console.error('등록 후 재조회 실패:', err);
            }
          },
        },
      })
    );
    setViewDropDown(false);
  };

  const handleDropdownClick = (item, e) => {
    e.preventDefault();
    isSelectionInProgress.current = true;
    handleSelect(item);
  };

  const totalPages = Math.ceil(result.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentResults = result.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={style.searchContainer} ref={dropdownRef}>
      <input
        ref={inputRef}
        onFocus={handleInputClick}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        value={query}
        className={style.searchbar}
        type="text"
        placeholder={placeholder}
      />
      <div className={style.searchIcon}>
        <Search size={15} color="#000000" />
      </div>
      {viewDropDown && (
        <div className={style.dropdownContainer}>
          <div className={style.SearchDropDown}>
            {isSearching ? (
              <div className={style.dropdownmenu}>검색 중...</div>
            ) : (
              <>
                <div
                  className={style.dropdownmenuadd}
                  onMouseDown={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddIngredient();
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  식재료 추가 +
                </div>
                {currentResults.map(item => (
                  <div
                    key={item.id}
                    onMouseDown={e => handleDropdownClick(item, e)}
                    className={style.dropdownmenu}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.ingreName}
                  </div>
                ))}

                {totalPages > 1 && (
                  <div className={style.paginationControls}>
                    <button
                      type="button"
                      onMouseDown={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (currentPage > 1) setCurrentPage(prev => prev - 1);
                      }}
                      disabled={currentPage === 1}
                    >
                      이전
                    </button>
                    <span>
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onMouseDown={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
                      }}
                      disabled={currentPage === totalPages}
                    >
                      다음
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchInput;
