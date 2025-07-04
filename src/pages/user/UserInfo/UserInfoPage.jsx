import React from 'react';
import infostyled from './UserInfoPage.module.scss';

function UserInfoPage() {
  
  return (
    <div className={infostyled.UserInfoPage}>
      <h2>개인 정보</h2>
      <div className={infostyled.topsection}>
        <div className={infostyled.imagefilesection}>
          <img src="#" />
          <button>사진 변경</button>
        </div>
        <div className={infostyled.infodetailsection}>
          <button>변경</button>
          <p>이메일:</p>
          <p>아이디:</p>
          <p>이메일:</p>
          <p>전화 번호:</p>
        </div>
      </div>
      <div className={infostyled.bottom}>
        <div className={infostyled.addrtitle}>
          <div>주소</div>
        </div>
        <div className={infostyled.addrcontainer}>
          <p>배송 정보</p>
          <div>
          </div>
        </div>
      </div>
      <button>회원 탈퇴</button>
    </div>
  );
}
export default UserInfoPage;
