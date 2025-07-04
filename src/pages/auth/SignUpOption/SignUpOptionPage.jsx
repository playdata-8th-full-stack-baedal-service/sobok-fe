import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import signsupoption from './SignUpOptionPage.module.scss';

function SignUpOptionPage() {
  const nav = useNavigate();

  return (
    <div className={signsupoption.SignUpOption}>
      <div className={signsupoption.SignupTitle}>
        <p>가입하시려는 회원의 유형을 선택해주세요.</p>
      </div>
      <div className={signsupoption.OptionBlock}>
        <div onClick={() => nav('/auth/signup/usersignup')}>
          <img src="#" />
          <p>사용자 회원가입</p>
        </div>
        <div onClick={() => nav('/auth/signup/ridersignup')}>
          <img src="#" />
          <p>배달원 회원가입</p>
        </div>
      </div>
    </div>
  );
}

export default SignUpOptionPage;
