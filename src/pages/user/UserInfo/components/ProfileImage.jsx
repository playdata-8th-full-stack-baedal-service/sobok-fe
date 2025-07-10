import React from 'react';
import { Camera } from 'lucide-react';
import styles from '../UserInfoPage.module.scss';

function ProfileImage({ profileImage, onChangePhoto }) {
  const imageSrc = profileImage || '/photodefault.svg';
  
  return (
    <div className={styles.profileImageSection}>
      <div className={styles.profileImage}>
        <img src={imageSrc} alt="프로필 사진" />
      </div>
      <button type="button" className={styles.changePhotoBtn} onClick={onChangePhoto}>
        사진 변경
      </button>
    </div>
  );
}

export default ProfileImage;
