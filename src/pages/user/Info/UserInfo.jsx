import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  editEmail,
  editPhone,
  lookupUser,
  sendAuthCode,
  setIsModified,
} from '../../../store/userInfoSlice';
import UserInfoHeader from './component/UserInfoHeader';
import ProfileImage from './component/ProfileImage';
import EditableField from './component/EditableField';
import AddrList from './component/AddrList';
import { openModal } from '../../../store/modalSlice';

function UserInfo() {
  const { userInfo, errorMessage, isModified } = useSelector(state => state.userInfo);
  const dispatch = useDispatch();

  const [targetPhone, setTargetPhone] = useState('');

  // 유저 정보 조회
  useEffect(() => {
    // 수정되지 않았다면 재조회 하지 않음
    if (!isModified) return;

    dispatch(lookupUser({ password: 'Password123!' }));
    dispatch(setIsModified(false));
  }, [dispatch, isModified]);

  // 전화번호 수정
  const handlePhoneEdit = phone => {
    setTargetPhone(phone);
    dispatch(sendAuthCode({ phone }));
    if (errorMessage) {
      alert(errorMessage);
      setTargetPhone('');
      dispatch(setIsModified(true));
    }
  };

  // 전화번호 인증
  const handlePhoneConfirm = userInputCode => {
    dispatch(editPhone({ phone: targetPhone, userInputCode }));
    if (errorMessage) {
      alert(errorMessage);
      setTargetPhone('');
      dispatch(setIsModified(true));
    }

    setTargetPhone('');
  };

  // 이메일 수정
  const handleEmailEdit = email => {
    dispatch(editEmail({ email }));
    if (errorMessage) {
      alert(errorMessage);
      dispatch(setIsModified(true));
    }
  };

  const handleWithdrawalClick = () => {
    dispatch(openModal({ type: 'WITHDRAWAL' }));
  };

  return (
    <div>
      <UserInfoHeader />
      <div>
        <h2>개인 정보</h2>
        <ProfileImage />
        <div>
          <EditableField label="닉네임" value={userInfo.nickname} disabled />
          <EditableField label="아이디" value={userInfo.loginId} disabled />
          <EditableField label="전화번호" value={userInfo.phone} onEditClick={handlePhoneEdit} />
          {targetPhone && <EditableField label="인증번호" onEditClick={handlePhoneConfirm} />}
          <EditableField
            label="이메일"
            value={userInfo.email || ''}
            onEditClick={handleEmailEdit}
          />
        </div>
      </div>
      <AddrList />
      <div>
        <button type="button" onClick={handleWithdrawalClick}>
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}

export default UserInfo;
