import React from 'react';
import { useNavigate } from 'react-router-dom';
import CompleteTemplate from '../../../common/forms/Complete/CompleteTemplate';

function SignUpCompletePage() {
  const navigate = useNavigate();

  return (
    <CompleteTemplate
      message="회원가입이 완료되었습니다."
      buttons={[
        { text: '홈화면 가기', onClick: () => navigate('/') },
        { text: '로그인 하기', onClick: () => navigate('/auth/signin') },
      ]}
    />
  );
}

export default SignUpCompletePage;
