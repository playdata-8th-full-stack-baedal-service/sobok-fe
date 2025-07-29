import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import style from './RiderInfoPage.module.scss';
import axiosInstance from '../../../services/axios-config';
import ModalWrapper from '../../../common/modals/ModalWrapper';
import RiderPasswordModal from './RiderPasswordModal';
import { openModal } from '../../../store/modalSlice';

function RiderInfoPage() {
  const dispatch = useDispatch();
  const [riderList, setRiderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState('');

  const riderListFetch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/auth-service/auth/get-info');
      if (response.data.success) {
        setRiderList(response.data.data);
        setShowModal(false);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    dispatch(openModal('USER_INFO_PASSWORD_CHANGE'));
  };
  return (
    <div className={style.RiderInfoPage}>
      {showModal && (
        <ModalWrapper title="비밀번호 입력" onClose={handleModalClose} size="sm">
          <RiderPasswordModal
            onSubmit={riderListFetch}
            onClose={handleModalClose}
            loading={loading}
            error={error}
          />
        </ModalWrapper>
      )}
      {!showModal && riderList && (
        <>
          <div className={style.RiderInfoTitle}>
            <h2 className={style.ridercontainertitle}>개인 정보</h2>
            <button className={style.riderbutton} onClick={handleOpenModal}>
              비밀번호 변경
            </button>
          </div>
          <div className={style.ridercontatiner}>
            <div>
              <label htmlFor="loginId">아이디</label>
              <input type="text" id="loginId" value={riderList.loginId} />
            </div>
            <div>
              <label htmlFor="phoneNumber">전화번호</label>
              <input type="text" id="phoneNumber" value={riderList.phone} />
            </div>
            <div>
              <label htmlFor="permissionNumber">면허번호</label>
              <input type="text" id="permissionNumber" value={riderList.permissionNumber} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RiderInfoPage;
