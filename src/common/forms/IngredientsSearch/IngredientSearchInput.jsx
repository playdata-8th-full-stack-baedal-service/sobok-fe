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
  closeOnSelect = false, // 관리자 페이지에서만 true
}) => {
  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [hasInteractedOutside, setHasInteractedOutside] = useState(false);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null); // ▼ 스크롤 보존용

  const dispatch = useDispatch();
  const { searchResults, loading } = useIngredientSearch(keyword);
  const safeResults = searchResults || [];

  // 외부 클릭 감지 (forceOpen이면 무시)
  useEffect(() => {
    const handleClickOutside = event => {
      if (forceOpen) return;
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setHasInteractedOutside(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [forceOpen]);

  // 외부 클릭 후 상태 초기화 플래그 해제
  useEffect(() => {
    if (hasInteractedOutside) {
      const t = setTimeout(() => setHasInteractedOutside(false), 100);
      return () => clearTimeout(t);
    }
  }, [hasInteractedOutside]);

  // forceOpen 변경 시 항상 열림
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
          if (e.key === 'Enter') e.preventDefault();
        }}
        onFocus={() => {
          setIsOpen(true);
          if (!keyword) dispatch(fetchAdditionalIngredients(''));
        }}
        className={styles.searchbar}
      />

      {loading && isOpen && <div className={styles.dropdownmenu}>검색 중...</div>}

      {(isOpen || forceOpen) && (safeResults.length > 0 || showAddButton) && (
        <div className={styles.dropdownContainer}>
          <div
            className={`${styles.scrollWrapper} ${safeResults.length > 6 ? styles.scrollable : ''}`}
            ref={scrollRef}
          >
            {/* 새 이름 추가 버튼 */}
            {showAddButton && keyword && !safeResults.some(item => item.ingreName === keyword) && (
              <div
                className={styles.dropdownmenuadd}
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  const prevTop = scrollRef.current?.scrollTop ?? 0; // ▼ 현재 스크롤 기억
                  onAddIngredient && onAddIngredient(keyword);
                  // 선택 후 닫기: 관리자만
                  if (closeOnSelect) {
                    setIsOpen(false);
                    inputRef.current?.blur();
                  } else {
                    // 사용자: 열어둔 채 유지, 키워드/스크롤 유지
                    requestAnimationFrame(() => {
                      if (scrollRef.current) scrollRef.current.scrollTop = prevTop;
                    });
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                식재료 추가 +
              </div>
            )}

            {/* 검색 결과 목록 */}
            {safeResults.map(item => (
              <div
                key={item.id}
                className={styles.dropdownmenu}
                style={{ cursor: 'pointer' }}
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  const prevTop = scrollRef.current?.scrollTop ?? 0; // ▼ 현재 스크롤 기억

                  onSelect({
                    ...item,
                    quantity: item.unit,
                  });

                  if (closeOnSelect) {
                    // 관리자: 선택 후 닫기
                    setIsOpen(false);
                    inputRef.current?.blur();
                  } else if (!forceOpen) {
                    // 사용자: 열어둔 채로 유지(키워드/스크롤 유지)
                    requestAnimationFrame(() => {
                      if (scrollRef.current) scrollRef.current.scrollTop = prevTop;
                    });
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
