import React from 'react';
import { Navigate } from 'react-router-dom';
import signsupoption from './signupoptionPage.module.scss';

function SignUpOptionPage() {

  return (
    <div className={signsupoption.SignUpOption}>
      <div className={signsupoption.SignupTitle}>
        <p>가입하시려는 회원의 유형을 선택해주세요.</p>
      </div>
      <div className={signsupoption.OptionBlock}>
        <div>
          <img src="#" />
          <p>사용자 회원가입</p>
        </div>
        <div>
          <img src="#" />
          <p>배달원 회원가입</p>
        </div>
      </div>
    </div>
  );
}

export default SignUpOptionPage;
