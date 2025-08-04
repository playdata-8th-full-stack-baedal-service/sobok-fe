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
  const [isComposing, setIsComposing] = useState(false);
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

  // 검색어 변경 시 타이머 설정
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (isComposing) return;

    if (query.length > 0) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const response = await axiosInstance.get(
            `/cook-service/ingredient/keyword-search?keyword=${query}`
          );
          if (response.data.success && Array.isArray(response.data.data)) {
            setResult(response.data.data);
            setViewDropDown(true);
          } else {
            setResult([]);
            setViewDropDown(true);
          }
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
  }, [query, isComposing]);

  const handleInputClick = () => {
    if (query.length > 0) {
      setViewDropDown(true);
    }
  };

  const handleInputChange = e => {
    setQuery(e.target.value);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault(); // form submit 방지
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
        },
      })
    );
    setViewDropDown(false);
  };

  // ✅ 클릭 시 바로 선택 실행
  const handleDropdownClick = (item, e) => {
    e.preventDefault();
    handleSelect(item); // IME 조합 상태여도 강제 실행
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
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
      />
      <div className={style.searchIcon}>
        <Search size={15} color="#000000" />
      </div>
      {viewDropDown && query.length > 0 && (
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
