import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../../../services/axios-config';
import { openModal } from '@/store/modalSlice';
import style from '../RecipeRegistPage.module.scss';

function SearchInput({
  placeholder = '검색어를 입력하세요.',
  onIngredientAdded,
  onIngredientSelect,
}) {
  const [viewDropDown, setViewDropDown] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const dispatch = useDispatch();

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
          const response = await axiosInstance.get('/ingredient/keyword-search', {
            params: { keyword: query },
          });
          if (response.data.success && Array.isArray(response.data.data)) {
            setResult(response.data.data);
            console.log(response.data.data);
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

  const handleInputClick = () => {
    if (query.length > 0) {
      setViewDropDown(!viewDropDown);
    }
  };

  const handleInputChange = e => {
    const { value } = e.target;
    setQuery(value);
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
          onClose: signal => {
            if (signal === 'refresh' && onIngredientAdded) {
              onIngredientAdded(); // 부모 컴포넌트에 새로고침 신호 전달
            }
          },
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
        value={query}
        className={style.searchbar}
        type="text"
        placeholder={placeholder}
      />
      <div className={style.searchIcon}>
        <Search size={20} color="#666" />
      </div>
      {viewDropDown && query.length > 0 && (
        <div className={style.dropdownContainer}>
          <div className={style.SearchDropDown}>
            {isSearching ? (
              <div className={style.dropdownmenu}>검색 중...</div>
            ) : result && result.length > 0 ? (
              <>
                {result.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={style.dropdownmenu}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.ingreName} - {item.price}원 ({item.origin})
                  </div>
                ))}
                <div
                  className={style.dropdownmenu}
                  onClick={handleAddIngredient}
                  style={{ cursor: 'pointer' }}
                >
                  + 식재료 추가
                </div>
              </>
            ) : (
              <div
                className={style.dropdownmenu}
                onClick={handleAddIngredient}
                style={{ cursor: 'pointer' }}
              >
                + 식재료 추가
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchInput;
