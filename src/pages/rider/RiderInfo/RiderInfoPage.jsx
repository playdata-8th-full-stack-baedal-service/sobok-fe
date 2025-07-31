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
    riderListFetch();
  }, []);

  const handleOpenModal = () => {
    dispatch(openModal('USER_INFO_PASSWORD_CHANGE'));
  };

  return (
    <div className={style.card}>
      <div className={style.carddetails}>
        <p className={style.texttitle}>Rider Profile</p>
        <p className={style.textbody}>이름 {riderList.name}</p>
        <p className={style.textbody}>아이디  {riderList.loginId}</p>
        <p className={style.textbody}>전화번호  {riderList.phone}</p>
        <p className={style.textbody}>면허번호  {riderList.permissionNumber}</p>
      </div>
      <button className={style.cardbutton} onClick={handleOpenModal}>
        비밀번호 변경
      </button>
    </div>
  );
}

export default RiderInfoPage;
