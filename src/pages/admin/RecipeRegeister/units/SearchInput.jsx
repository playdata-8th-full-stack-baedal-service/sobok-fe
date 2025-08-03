import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { openModal } from '@/store/modalSlice';
import style from '../RecipeRegistPage.module.scss';
import { API_BASE_URL } from '@/services/host-config';
import axiosInstance from '../../../../services/axios-config';
// import axiosInstance from '../../../../services/axios-config';

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
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const dispatch = useDispatch();

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

    if (query.length > 0) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await axiosInstance.get(
            `/cook-service/ingredient/keyword-search?keyword=${query}`
          );
          console.log('API 응답:', response.data); // 디버깅용
          if (response.data.success && Array.isArray(response.data.data)) {
            setResult(response.data.data);
            setViewDropDown(true);
            console.log('검색결과(배열):', response.data.data); // 디버깅용
          } else {
            setResult([]);
            setViewDropDown(true);
            console.log('검색결과 없음 또는 data null'); // 디버깅용
          }
        } catch (err) {
          console.error(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
          setResult([]);
          setViewDropDown(true);
        } finally {
          setIsSearching(false);
        }
      }, 500);
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

  // 렌더링 직전 상태 확인
  console.log('렌더링 직전 result:', result, 'viewDropDown:', viewDropDown, 'query:', query);

  const handleInputClick = () => {
    if (query.length > 0) {
      setViewDropDown(!viewDropDown);
    }
  };

  const handleInputChange = e => {
    const { value } = e.target;
    setQuery(value);
  };

  // 엔터 키 이벤트 핸들러 추가
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault(); // form submit 방지
    }
  };

  const handleSelect = item => {
    setQuery(item.ingreName);
    setViewDropDown(false);
    if (onIngredientSelect) {
      onIngredientSelect(item);
    }
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

  return (
    <div className={style.searchContainer} ref={dropdownRef}>
      <input
        onClick={handleInputClick}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputClick}
        value={query}
        className={style.searchbar}
        type="text"
        placeholder={placeholder}
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
                {result &&
                  result.length > 0 &&
                  result.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={style.dropdownmenu}
                      style={{ cursor: 'pointer' }}
                    >
                      {item.ingreName}
                    </div>
                  ))}
                <div
                  className={style.dropdownmenuadd}
                  onClick={handleAddIngredient}
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