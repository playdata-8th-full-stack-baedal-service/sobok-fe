import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
      }
    } catch (error) {
      console.error('API 에러:', error);
    }
  };

  useEffect(() => {
    riderListFetch()
  },[]);

  const handleOpenModal = () => {
    dispatch(openModal('USER_INFO_PASSWORD_CHANGE'));
  };

  return (
    <div className={style.RiderInfoPage}>
      <div className={style.RiderInfoTitle}>
        <h2 className={style.ridercontainertitle}>개인 정보</h2>
        <button className={style.riderbutton} onClick={handleOpenModal}>
          비밀번호 변경
        </button>
      </div>
      <div className={style.ridercontatiner}>
        <div>
          <label htmlFor="name">이름</label>
          <input type="text" id="name" value={riderList.name} readOnly />
        </div>
        <div>
          <label htmlFor="loginId">아이디</label>
          <input type="text" id="loginId" value={riderList.loginId || ''} readOnly />
        </div>
        <div>
          <label htmlFor="phoneNumber">전화번호</label>
          <input type="text" id="phoneNumber" value={riderList.phone || ''} readOnly />
        </div>
        <div>
          <label htmlFor="permissionNumber">면허번호</label>
          <input type="text" id="permissionNumber" value={riderList.permissionNumber || ''} readOnly />
        </div>
      </div>
    </div>
  );
}

export default RiderInfoPage;