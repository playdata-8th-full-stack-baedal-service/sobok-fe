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

  // ✅ 1. '선택 중' 상태를 기억할 깃발(ref)을 만듭니다.
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

  // 실시간 검색을 위한 useEffect
  useEffect(() => {
    // ✅ 2. 검색을 실행하기 전, 깃발이 올라가 있는지 확인합니다.
    if (isSelectionInProgress.current) {
      // 깃발이 올라가 있다면, '선택'이 일어났다는 뜻입니다.
      // 검색을 막고, 다음 검색을 위해 깃발을 다시 내립니다.
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
      }, 300); // 300ms 디바운싱
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
  }, [query]); // 이제 useEffect는 오직 query에만 의존합니다.

  const handleInputClick = () => {
    if (query.length > 0 && result.length > 0) {
      setViewDropDown(true);
    }
  };

  const handleInputChange = e => {
    setQuery(e.target.value);
  };

  const handleKeyDown = e => {
    // Enter 키에 대한 특별한 처리가 필요하다면 여기에 작성합니다.
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleSelect = item => {
    if (onIngredientSelect) {
      onIngredientSelect(item);
    }
    // 선택 후 입력창을 비웁니다. 이로 인해 useEffect가 다시 실행됩니다.
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
            // ✅ 등록 성공 시 실행
            setQuery(''); // 입력창 비우기
            setViewDropDown(false);

            // 전체 목록 다시 조회
            try {
              const res = await axiosInstance.get(
                `/cook-service/ingredient/keyword-search?keyword=${newName}`
              );
              if (res.data.success && res.data.data.length > 0) {
                // 자동 선택
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
    // ✅ 3. 사용자가 드롭다운을 클릭하는 순간, 깃발을 들어 올립니다!
    isSelectionInProgress.current = true;
    handleSelect(item);
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
                {result.map(item => (
                  <div
                    key={item.id}
                    onMouseDown={e => handleDropdownClick(item, e)}
                    className={style.dropdownmenu}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.ingreName}
                  </div>
                ))}
                <div
                  className={style.dropdownmenuadd}
                  onMouseDown={e => {
                    e.preventDefault();
                    handleAddIngredient();
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  + 식재료 추가
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
