import React, { useState } from 'react';
import style from './HubInfoPage.module.scss';
import axiosInstance from '../../../services/axios-config';
import PasswordModal from './PasswordModal';
import ModalWrapper from '../../../common/modals/ModalWrapper';

function HubInfoPage() {
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = async shopId => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/auth-service/auth/get-info');
      if (response.data.success) {
        setShopInfo(response.data.data);
      } else {
        setError(response.data.message || '비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setError(err.response?.data?.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={style.HubInfoPage}>
      {shopInfo && (
        <>
          <h2 className={style.HubInfoPagetitle}>가게 정보</h2>
          <div className={style.Hubinfocontainer}>
            <div className={style.inputcontainer}>
              <label htmlFor="name" className={style.hubtitle}>
                지점이름
              </label>
              <input
                type="text"
                id="name"
                disabled
                className={style.hubinput}
                value={shopInfo.shopName}
              />
            </div>
            <div className={style.inputcontainer}>
              <label htmlFor="loginId" className={style.hubtitle}>
                아이디
              </label>
              <input
                type="text"
                id="loginId"
                disabled
                className={style.hubinput}
                value={shopInfo.loginId}
              />
            </div>
            <div className={style.inputcontainer}>
              <label htmlFor="ownerName" className={style.hubtitle}>
                대표자이름
              </label>
              <input
                type="text"
                id="ownerName"
                disabled
                className={style.hubinput}
                value={shopInfo.ownerName}
              />
            </div>
            <div className={style.inputcontainer}>
              <label htmlFor="phoneNumber" className={style.hubtitle}>
                전화번호
              </label>
              <input
                type="text"
                id="phoneNumber"
                disabled
                className={style.hubinput}
                value={shopInfo.phone}
              />
            </div>
            <div className={style.inputcontainer}>
              <label htmlFor="address" className={style.hubtitle}>
                주소
              </label>
              <input
                type="text"
                id="address"
                disabled
                className={style.hubinput}
                value={shopInfo.roadFull}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default HubInfoPage;
