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
  closeOnSelect = false,
}) => {
  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [highlightIndex, setHighlightIndex] = useState(-1); // 화살표 이동 인덱스
  const [hasInteractedOutside, setHasInteractedOutside] = useState(false);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [forceOpen]);

  useEffect(() => {
    if (hasInteractedOutside) {
      const t = setTimeout(() => setHasInteractedOutside(false), 100);
      return () => clearTimeout(t);
    }
  }, [hasInteractedOutside]);

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  // 신규: 등록 이벤트 수신
  useEffect(() => {
    const onRegistered = e => {
      const ing = e.detail;
      if (!ing) return;

      setKeyword('');
      setIsOpen(true);
      setHighlightIndex(-1);

      onSelect?.({
        ...ing,
        quantity: ing.unit,
      });

      dispatch(fetchAdditionalIngredients(''));

      requestAnimationFrame(() => {
        if (scrollRef.current) {
          const top = scrollRef.current.scrollTop || 0;
          scrollRef.current.scrollTop = top;
        }
      });

      inputRef.current?.focus();
    };

    window.addEventListener('INGREDIENT_REGISTERED', onRegistered);
    return () => window.removeEventListener('INGREDIENT_REGISTERED', onRegistered);
  }, [dispatch, onSelect]);

  const handleSelect = item => {
    onSelect({
      ...item,
      quantity: item.unit,
    });

    if (closeOnSelect) {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleKeyDown = e => {
    if (!isOpen || (!safeResults.length && !showAddButton)) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => {
        const total = safeResults.length + (showAddButton && keyword ? 1 : 0);
        return (prev + 1) % total;
      });
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => {
        const total = safeResults.length + (showAddButton && keyword ? 1 : 0);
        return (prev - 1 + total) % total;
      });
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex === -1) return;

      if (showAddButton && keyword && highlightIndex === 0) {
        onAddIngredient && onAddIngredient(keyword);
      } else {
        const indexOffset = showAddButton && keyword ? 1 : 0;
        const selectedItem = safeResults[highlightIndex - indexOffset];
        if (selectedItem) handleSelect(selectedItem);
      }
    }
  };

  // 추가: 하이라이트 항목 가시 영역으로 자동 스크롤
  useEffect(() => {
    if (!isOpen || highlightIndex < 0) return;
    const container = scrollRef.current;
    if (!container) return;
    const el = container.querySelector(`[data-index="${highlightIndex}"]`);
    if (!el) return;

    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;
    const viewTop = container.scrollTop;
    const viewBottom = viewTop + container.clientHeight;

    if (elTop < viewTop) {
      container.scrollTop = elTop;
    } else if (elBottom > viewBottom) {
      container.scrollTop = elBottom - container.clientHeight;
    }
  }, [highlightIndex, isOpen]);

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
          setHighlightIndex(-1);
        }}
        onKeyDown={handleKeyDown}
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
            {showAddButton && keyword && !safeResults.some(item => item.ingreName === keyword) && (
              <div
                className={`${styles.dropdownmenuadd} ${
                  highlightIndex === 0 ? styles.highlighted : ''
                }`}
                data-index={0}
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddIngredient && onAddIngredient(keyword);
                }}
              >
                식재료 추가 +
              </div>
            )}

            {safeResults.map((item, idx) => {
              const indexOffset = showAddButton && keyword ? 1 : 0;
              const mappedIndex = idx + indexOffset;
              const isHighlighted = highlightIndex === mappedIndex;
              return (
                <div
                  key={item.id}
                  className={`${styles.dropdownmenu} ${isHighlighted ? styles.highlighted : ''}`}
                  data-index={mappedIndex}
                  onMouseDown={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(item);
                  }}
                >
                  {item.ingreName}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientSearchInput;
