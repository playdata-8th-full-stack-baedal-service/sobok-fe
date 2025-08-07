import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useIngredientSearch } from '../../hooks/useIngredientSearch';
import { fetchAdditionalIngredients } from '@/store/productSlice';
import styles from './IngredientSearchInput.module.scss';

const IngredientSearchInput = ({
  placeholder = '검색어를 입력하세요.',
  onSelect,
  showAddButton = false,
  onAddIngredient,
  forceOpen = false,
  closeOnSelect = false, // 관리자 페이지에서만 true로 사용
}) => {
  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [hasInteractedOutside, setHasInteractedOutside] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const { searchResults, loading } = useIngredientSearch(keyword);
  const safeResults = searchResults || [];

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = event => {
      if (forceOpen) return;
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setHasInteractedOutside(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [forceOpen]);

  // 외부 클릭 후 상태 초기화
  useEffect(() => {
    if (hasInteractedOutside) {
      setTimeout(() => {
        setHasInteractedOutside(false);
      }, 100);
    }
  }, [hasInteractedOutside]);

  // forceOpen이 변경될 때 항상 열림
  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  return (
    <div className={styles.searchContainer} ref={dropdownRef}>
      <input
        ref={inputRef}
        type="search"
        value={keyword}
        placeholder={placeholder}
        onChange={e => {
          setKeyword(e.target.value);
          setIsOpen(true);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
        onFocus={() => {
          setIsOpen(true);
          if (!keyword) {
            dispatch(fetchAdditionalIngredients(''));
          }
        }}
        className={styles.searchbar}
      />

      {loading && isOpen && <div className={styles.dropdownmenu}>검색 중...</div>}

      {(isOpen || forceOpen) && (safeResults.length > 0 || showAddButton) && (
        <div className={styles.dropdownContainer}>
          <div
            className={`${styles.scrollWrapper} ${safeResults.length > 6 ? styles.scrollable : ''}`}
          >
            {showAddButton && keyword && !safeResults.some(item => item.ingreName === keyword) && (
              <div
                className={styles.dropdownmenuadd}
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddIngredient && onAddIngredient(keyword);
                  setKeyword('');
                  if (closeOnSelect) {
                    setIsOpen(false);
                  } else {
                    setTimeout(() => setIsOpen(true), 100);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                식재료 추가 +
              </div>
            )}

            {safeResults.map(item => (
              <div
                key={item.id}
                className={styles.dropdownmenu}
                style={{ cursor: 'pointer' }}
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect({
                    ...item,
                    quantity: item.unit,
                  });
                  setKeyword('');
                  if (closeOnSelect) {
                    setIsOpen(false);
                    inputRef.current?.blur();
                  } else if (!forceOpen) {
                    setIsOpen(false);
                    setTimeout(() => setIsOpen(true), 100);
                  }
                }}
              >
                {item.ingreName}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientSearchInput;
