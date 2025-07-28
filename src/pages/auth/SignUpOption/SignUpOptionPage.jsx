import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Smile, Truck } from 'lucide-react';
import signsupoption from './SignUpOptionPage.module.scss';

function SignUpOptionPage() {
  const nav = useNavigate();

  return (
    <div className={signsupoption.SignUpOption}>
      <div className={signsupoption.SignupTitle}>
        <p>가입하시려는 회원의 유형을 선택해주세요.</p>
      </div>
      <div className={signsupoption.OptionBlock}>
        <div onClick={() => nav('/auth/signup/usersignup')} className={signsupoption.cardone}>
          <p className={signsupoption.txt}>
            <Smile size={40} /> 사용자 회원가입
          </p>
        </div>
        <div onClick={() => nav('/auth/signup/ridersignup')} className={signsupoption.cardtwo}>
          <p className={signsupoption.txt}>
            <Truck size={40} /> 배달원 회원가입
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpOptionPage;
