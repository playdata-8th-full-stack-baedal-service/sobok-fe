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
  const [visibleCount, setVisibleCount] = useState(4); // 처음 4개만 보여줌

  const isSelectionInProgress = useRef(false);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery('');
  }, [resetSignal]);

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

  // 드롭다운 닫을 때 visibleCount 초기화
  useEffect(() => {
    if (!viewDropDown) {
      setVisibleCount(4);
    }
  }, [viewDropDown]);

  useEffect(() => {
    if (isSelectionInProgress.current) {
      isSelectionInProgress.current = false;
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length > 0) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const response = await axiosInstance.get(
            `/cook-service/ingredient/keyword-search?keyword=${query}`
          );
          if (response.data.success && Array.isArray(response.data.data)) {
            setResult(response.data.data);
            setVisibleCount(4); // 새로운 검색 시 초기화
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
      }, 300);
    } else {
      setViewDropDown(false);
      setResult([]);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleInputClick = () => {
    if (query.length > 0 && result.length > 0) {
      setViewDropDown(true);
    }
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

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 4);
  };

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
                {result.slice(0, visibleCount).map(item => (
                  <div
                    key={item.id}
                    onMouseDown={e => handleDropdownClick(item, e)}
                    className={style.dropdownmenu}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.ingreName}
                  </div>
                ))}
                {result.length > visibleCount && (
                  <div
                    className={style.dropdownmenumore}
                    onMouseDown={e => {
                      e.preventDefault();
                      e.stopPropagation(); // ✅ 외부 클릭으로 닫히지 않도록
                      handleShowMore();
                    }}
                  >
                    더보기 +
                  </div>
                )}
                <div
                  className={style.dropdownmenuadd}
                  onMouseDown={e => {
                    e.preventDefault();
                    e.stopPropagation(); // ✅ 닫힘 방지
                    handleAddIngredient();
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  식재료 추가 +
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchInput;
