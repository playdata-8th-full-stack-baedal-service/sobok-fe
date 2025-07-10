import React from 'react';
import { useNavigate } from 'react-router-dom';
import CompleteTemplate from '../../../../common/forms/Complete/CompleteTemplate';

function PayCompletePage() {
  const navigate = useNavigate();

  return (
    <CompleteTemplate
      message="결제가 완료되었습니다."
      buttons={[
        { text: '홈화면 가기', onClick: () => navigate('/') },
        { text: '내 주문 내역', onClick: () => navigate('/user/orders') },
      ]}
    />
  );
}

export default PayCompletePage;
