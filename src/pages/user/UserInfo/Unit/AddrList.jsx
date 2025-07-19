import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openModal, closeModal } from '@/store/modalSlice';
import axiosInstance from '@/services/axios-config';
import styles from '../UserInfoPage.module.scss';
import { Pencil, Trash } from 'lucide-react';

function AddrList({ addresses, onAddressUpdate, onAddressesChange, onAddressDelete }) {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
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
      const existingScript = document.querySelector('script[src*="postcode.v2.js"]');
      if (existingScript && document.head.contains(existingScript)) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // 주소 검색 팝업 열기
  const openAddressSearch = addressId => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    let initialDetailAddress = '';
    if (addressId) {
      const currentAddress = addresses.find(addr => addr.id === addressId);
      initialDetailAddress = currentAddress?.addrDetail || '';
    }
    new window.daum.Postcode({
      oncomplete(data) {
        const fullAddress = {
          roadFull: data.roadAddress || data.jibunAddress,
          zonecode: data.zonecode,
          buildingName: data.buildingName || '',
          sido: data.sido,
          sigungu: data.sigungu,
          roadname: data.roadname,
          bname: data.bname,
          query: data.query,
        };
        dispatch(
          openModal({
            type: 'ADDR_CONFIRM',
            props: {
              targetAddressId: addressId,
              selectedAddress: fullAddress,
              initialDetailAddress,
              isUpdating: false,
              onConfirm: async detailAddress => {
                setIsUpdating(true);
                try {
                  let response;
                  if (addressId) {
                    response = await axiosInstance.patch('/user-service/user/editAddress', {
                      addressId,
                      roadFull: fullAddress.roadFull,
                      addrDetail: detailAddress.trim() || '',
                    });
                  } else {
                    response = await axiosInstance.post('/user-service/user/addAddress', {
                      roadFull: fullAddress.roadFull,
                      addrDetail: detailAddress.trim() || '',
                    });
                  }
                  if (response.data.success && response.data.status === 200) {
                    if (addressId && onAddressUpdate) {
                      onAddressUpdate(addressId, {
                        roadFull: fullAddress.roadFull,
                        addrDetail: detailAddress.trim() || '',
                        zonecode: fullAddress.zonecode,
                      });
                    }
                    if (onAddressesChange) {
                      await onAddressesChange();
                    }
                    alert(
                      response.data.message ||
                        (addressId
                          ? '주소가 성공적으로 변경되었습니다.'
                          : '주소가 성공적으로 추가되었습니다.')
                    );
                    dispatch(closeModal());
                  } else {
                    alert(
                      response.data.message ||
                        (addressId ? '주소 변경에 실패했습니다.' : '주소 추가에 실패했습니다.')
                    );
                  }
                } catch (error) {
                  if (error.response?.data?.message) {
                    alert(error.response.data.message);
                  } else {
                    alert(
                      addressId
                        ? '주소 변경 중 오류가 발생했습니다. 다시 시도해주세요.'
                        : '주소 추가 중 오류가 발생했습니다. 다시 시도해주세요.'
                    );
                  }
                } finally {
                  setIsUpdating(false);
                }
              },
            },
          })
        );
      },
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
        outlineColor: '#E0E0E0',
      },
    }).open();
  };

  // 주소 삭제
  const handleDeleteAddr = async id => {
    // 삭제 확인
    if (!window.confirm('정말로 이 주소를 삭제하시겠습니까?')) {
      return;
    }

    setIsUpdating(true);
    try {
      const response = await axiosInstance.delete(`/user-service/user/deleteAddress/${id}`);

      console.log('삭제 응답:', response.data);

      if (response.data.success) {
        console.log('주소 삭제 성공');
        alert('주소가 성공적으로 삭제되었습니다.');

        // 즉시 로컬 상태 업데이트
        if (onAddressDelete) {
          onAddressDelete(id);
        }
      } else {
        console.log('삭제 실패:', response.data.message);
        alert(response.data.message || '주소 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.log('삭제 실패:', err);
      const errorMessage = err.response?.data?.message || '주소 삭제 중 오류가 발생했습니다.';
      alert(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={styles.addressSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>배송지 관리</h2>
        <button
          type="button"
          className={styles.addAddressBtn}
          onClick={() => openAddressSearch(null)}
        >
          주소 추가
        </button>
      </div>
      <div className={styles.addressList}>
        {addresses && addresses.length > 0 ? (
          addresses.map(address => (
            <div key={address.id} className={styles.addressItem}>
              <div className={styles.addressInfo}>
                <div className={styles.addressTitle}>
                  {address.title || '배송지'}
                  {address.isDefault && <span className={styles.defaultTag}>기본</span>}
                </div>
                <div className={styles.addressDetail}>
                  <p className={styles.roadAddress}>{address.roadFull}</p>
                  {address.addrDetail && (
                    <p className={styles.detailAddress}>{address.addrDetail}</p>
                  )}
                </div>
              </div>
              <div className={styles.addressActions}>
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={() => openAddressSearch(address.id)}
                >
                  <Pencil className={styles.editsvgIcon}/>
                </button>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteAddr(address.id)}
                  disabled={isUpdating}
                >
                  <Trash className={styles.deletesvgIcon}/>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noAddress}>
            <p>등록된 주소가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddrList;
