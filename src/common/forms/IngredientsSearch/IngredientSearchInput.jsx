import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const { searchResults, loading } = useIngredientSearch(keyword);

  const safeResults = searchResults || [];
  const totalPages = Math.ceil(safeResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentResults = safeResults.slice(startIndex, startIndex + itemsPerPage);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePrev = e => {
    e.preventDefault();
    e.stopPropagation();
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = e => {
    e.preventDefault();
    e.stopPropagation();
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div className={styles.searchContainer} ref={dropdownRef}>
      <input
        ref={inputRef}
        type="search"
        value={keyword}
        placeholder={placeholder}
        onChange={e => {
          setKeyword(e.target.value);
          setCurrentPage(1);
          setIsOpen(true);
        }}
        onFocus={() => {
          setIsOpen(true);
          if (!keyword) {
            dispatch(fetchAdditionalIngredients('')); // 전체 조회는 검색어 없을 때만
          }
        }}
        className={styles.searchbar}
      />

      {loading && isOpen && <div className={styles.dropdownmenu}>검색 중...</div>}

      {isOpen && safeResults.length > 0 && (
        <div className={styles.dropdownContainer}>
          <div className={styles.SearchDropDown}>
            {showAddButton && (
              <div
                className={styles.dropdownmenuadd}
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddIngredient && onAddIngredient(keyword);
                  setKeyword('');
                  setIsOpen(false);
                }}
                style={{ cursor: 'pointer' }}
              >
                식재료 추가 +
              </div>
            )}

            {currentResults.map(item => (
              <div
                key={item.id}
                className={styles.dropdownmenu}
                style={{ cursor: 'pointer' }}
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  // unit만큼 다시 담기도록 수정
                  onSelect({
                    ...item,
                    quantity: item.unit,
                  });
                  setKeyword(''); // 검색창 비우기
                  setIsOpen(false); // 드롭다운 닫기
                }}
              >
                {item.ingreName}
              </div>
            ))}

            {totalPages > 1 && (
              <div className={styles.paginationControls}>
                <button type="button" onMouseDown={handlePrev} disabled={currentPage === 1}>
                  이전
                </button>
                <span>
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onMouseDown={handleNext}
                  disabled={currentPage === totalPages}
                >
                  다음
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientSearchInput;
