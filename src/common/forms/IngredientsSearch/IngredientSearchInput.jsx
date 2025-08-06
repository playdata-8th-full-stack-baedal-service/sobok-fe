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
}) => {
  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteractedOutside, setHasInteractedOutside] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const { searchResults, loading } = useIngredientSearch(keyword);
  const safeResults = searchResults || [];

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setHasInteractedOutside(true); // 드롭다운 닫힐 때 페이지 리셋용
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 외부 클릭 후 페이지 리셋
  useEffect(() => {
    if (hasInteractedOutside) {
      setTimeout(() => {
        setHasInteractedOutside(false);
      }, 100); // 짧은 딜레이 후 상태 초기화
    }
  }, [hasInteractedOutside]);

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
        onFocus={() => {
          setIsOpen(true);
          if (!keyword) {
            dispatch(fetchAdditionalIngredients(''));
          }
        }}
        className={styles.searchbar}
      />

      {loading && isOpen && <div className={styles.dropdownmenu}>검색 중...</div>}

      {isOpen && safeResults.length > 0 && (
        <div className={styles.dropdownContainer}>
          <div
            className={`${styles.scrollWrapper} ${safeResults.length > 6 ? styles.scrollable : ''}`}
          >
            {showAddButton && (
              <div
                className={styles.dropdownmenuadd}
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddIngredient && onAddIngredient(keyword);
                  setKeyword('');
                  setIsOpen(false);
                  setTimeout(() => setIsOpen(true), 100);
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
                  setIsOpen(false);
                  setTimeout(() => setIsOpen(true), 100);
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
