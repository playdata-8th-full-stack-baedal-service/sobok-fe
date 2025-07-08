import React, { useState, useEffect } from 'react';
import axiosInstance from '@/services/axios-config';
import styles from '../UserInfoPage.module.scss';

function AddrList({ addresses, onAddressUpdate, onAddressesChange }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [detailAddress, setDetailAddress] = useState('');
  const [targetAddressId, setTargetAddressId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // 스크립트가 이미 로드되어 있는지 확인
    if (document.querySelector('script[src*="postcode.v2.js"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => {
      console.log('Daum Postcode script loaded');
    };
    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시에만 스크립트 제거
      const existingScript = document.querySelector('script[src*="postcode.v2.js"]');
      if (existingScript && document.head.contains(existingScript)) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // 주소 검색 팝업 열기
  const openAddressSearch = (addressId) => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // addressId가 null이면 새 주소 추가, 있으면 기존 주소 수정
    if (addressId) {
      // 기존 주소 수정: 현재 주소의 상세주소 가져오기
      const currentAddress = addresses.find(addr => addr.id === addressId);
      setDetailAddress(currentAddress?.addrDetail || '');
    } else {
      // 새 주소 추가: 상세주소 초기화
      setDetailAddress('');
    }

    new window.daum.Postcode({
      oncomplete: function(data) {
        // 주소 선택 완료 시 호출되는 콜백
        const fullAddress = {
          roadFull: data.roadAddress || data.jibunAddress, // 도로명 주소 또는 지번 주소
          zonecode: data.zonecode, // 우편번호
          buildingName: data.buildingName || '', // 건물명
          sido: data.sido, // 시도
          sigungu: data.sigungu, // 시군구
          roadname: data.roadname, // 도로명
          bname: data.bname, // 법정동/법정리
          query: data.query // 검색어
        };

        // 선택된 주소 정보 저장
        setSelectedAddress(fullAddress);
        setTargetAddressId(addressId);
        // 확인 모달 표시
        setShowConfirmModal(true);
      },
      onresize: function(size) {
        // 팝업 크기 조절 시 호출 (필요시 사용)
      },
      onclose: function(state) {
        // 팝업 닫기 시 호출
        if (state === 'FORCE_CLOSE') {
          console.log('사용자가 팝업을 강제로 닫았습니다.');
        } else if (state === 'COMPLETE_CLOSE') {
          console.log('주소 선택 완료 후 팝업이 닫혔습니다.');
        }
      },
      // 팝업 설정
      width: '100%',
      height: '100%',
      maxSuggestItems: 5,
      theme: {
        bgColor: '#FFFFFF',
        searchBgColor: '#0B65C8',
        contentBgColor: '#FFFFFF',
        pageBgColor: '#FAFAFA',
        textColor: '#333333',
        queryTextColor: '#FFFFFF',
        postcodeTextColor: '#FA4256',
        emphTextColor: '#008BD3',
        outlineColor: '#E0E0E0'
      }
    }).open();
  };

  // 주소 추가/변경 확인 및 API 호출
  const handleConfirmChange = async () => {
    if (!selectedAddress) return;

    setIsUpdating(true);

    try {
      let response;
      
      if (targetAddressId) {
        // 기존 주소 수정
        response = await axiosInstance.patch('/user-service/user/editAddress', {
          addressId: targetAddressId,
          roadFull: selectedAddress.roadFull,
          addrDetail: detailAddress.trim() || '' // 상세주소 포함
        });
        console.log('주소 수정 응답:', response.data);
        
      } else {
        // 새 주소 추가
        response = await axiosInstance.post('/user-service/user/addAddress', {
          roadFull: selectedAddress.roadFull,
          addrDetail: detailAddress.trim() || '' // 상세주소 포함
        });
        console.log('주소 추가 응답:', response.data);
      }

      if (response.data.success && response.data.status === 200) {
        // 성공 시 부모 컴포넌트에 업데이트 알림
        if (targetAddressId) {
          // 기존 주소 수정
          if (onAddressUpdate) {
            onAddressUpdate(targetAddressId, {
              roadFull: selectedAddress.roadFull,
              addrDetail: detailAddress.trim() || '',
              zonecode: selectedAddress.zonecode
            });
          }
        }
        
        // 주소 추가든 수정이든 전체 주소 목록을 새로고침
        if (onAddressesChange) {
          await onAddressesChange();
        }

        // 성공 메시지 표시
        const successMessage = targetAddressId 
          ? '주소가 성공적으로 변경되었습니다.'
          : '주소가 성공적으로 추가되었습니다.';
        alert(response.data.message || successMessage);
        
        // 상태 초기화
        setShowConfirmModal(false);
        setSelectedAddress(null);
        setTargetAddressId(null);
        setDetailAddress('');

      } else {
        const errorMessage = targetAddressId 
          ? '주소 변경에 실패했습니다.'
          : '주소 추가에 실패했습니다.';
        alert(response.data.message || errorMessage);
      }

    } catch (error) {
      console.error('주소 처리 오류:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        const errorMessage = targetAddressId 
          ? '주소 변경 중 오류가 발생했습니다. 다시 시도해주세요.'
          : '주소 추가 중 오류가 발생했습니다. 다시 시도해주세요.';
        alert(errorMessage);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // 주소 변경 취소
  const handleCancelChange = () => {
    setShowConfirmModal(false);
    setSelectedAddress(null);
    setTargetAddressId(null);
    setDetailAddress('');
  };

  // 주소 삭제
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('정말로 이 주소를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/user-service/user/deleteAddress/${addressId}`);
      
      if (response.data.success && response.data.status === 200) {
        alert('주소가 성공적으로 삭제되었습니다.');
        
        // 부모 컴포넌트에 주소 목록 업데이트 알림
        if (onAddressesChange) {
          await onAddressesChange();
        }
      } else {
        alert(response.data.message || '주소 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('주소 삭제 오류:', error);
      alert('주소 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.addressSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>배송지 관리</h2>
        <button 
          className={styles.addAddressBtn}
          onClick={() => openAddressSearch(null)}
        >
          주소 추가
        </button>
      </div>

      {/* 주소 목록 */}
      <div className={styles.addressList}>
        {addresses && addresses.length > 0 ? (
          addresses.map((address) => (
            <div key={address.id} className={styles.addressItem}>
              <div className={styles.addressInfo}>
                <div className={styles.addressTitle}>
                  {address.title || '배송지'}
                  {address.isDefault && <span className={styles.defaultTag}>기본</span>}
                </div>
                <div className={styles.addressDetail}>
                  <p className={styles.roadAddress}>
                    {address.roadFull}
                  </p>
                  {address.addrDetail && (
                    <p className={styles.detailAddress}>{address.addrDetail}</p>
                  )}
                </div>
              </div>
              <div className={styles.addressActions}>
                <button
                  className={styles.editBtn}
                  onClick={() => openAddressSearch(address.id)}
                >
                  수정
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noAddress}>
            <p>등록된 주소가 없습니다.</p>
            <button 
              className={styles.addFirstAddressBtn}
              onClick={() => openAddressSearch(null)}
            >
              주소 추가하기
            </button>
          </div>
        )}
      </div>

      {/* 주소 변경 확인 모달 */}
      {showConfirmModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{targetAddressId ? '주소 변경 확인' : '주소 추가 확인'}</h3>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.selectedAddressInfo}>
                <h4>선택된 주소:</h4>
                <p className={styles.selectedAddress}>
                  [{selectedAddress?.zonecode}] {selectedAddress?.roadFull}
                </p>
                
                <div className={styles.detailAddressInput}>
                  <label htmlFor="detailAddress">상세주소</label>
                  <input
                    id="detailAddress"
                    type="text"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    placeholder="상세주소를 입력하세요 (선택사항)"
                    className={styles.detailInput}
                  />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.confirmBtn}
                onClick={handleConfirmChange}
                disabled={isUpdating}
              >
                {isUpdating ? (targetAddressId ? '변경 중...' : '추가 중...') : (targetAddressId ? '확인' : '추가')}
              </button>
              <button
                className={styles.cancelBtn}
                onClick={handleCancelChange}
                disabled={isUpdating}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddrList;