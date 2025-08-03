/* eslint-disable no-console */
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editUserProfile } from '../../../../store/userInfoSlice';
import styles from '../UserInfo.module.scss';
import Button from '../../../../common/components/Button';
import useToast from '@/common/hooks/useToast';

function ProfileImage() {
  const { showSuccess, showNegative, showInfo } = useToast();

  const { userInfo } = useSelector(state => state.userInfo);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const formData = new FormData();

  // 버튼 대신 누르면 파일 선택 창 띄우기
  const onChangePhoto = async () => {
    fileInputRef.current.click();
  };

  // 파일 선택 시 프로필 이미지 수정
  const handleFileChange = async e => {
    const file = e.target.files[0];
    formData.append('image', file);

    const result = await dispatch(editUserProfile({ formData }));
    showSuccess('프로필 사진이 변경되었습니다.');

    console.log(result);
  };

  return (
    <>
      <img src={userInfo?.photo} alt="프로필 사진" />
      <input
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <Button className={styles.changePhotoButton} type="button" onClick={onChangePhoto}>
        사진 변경
      </Button>
    </>
  );
}

export default ProfileImage;
