import React from 'react';
import { CheckoutPage } from '../../Pay/toss/Checkout';
import Button from '../../../auth/SignUp/UserSignUp/components/common/Button';

function MainPage() {

  return (
    <div>
      <h2>메인페이지 입니다.</h2>
      <h1> 결제 수단 </h1>
      <CheckoutPage />
    </div>
  );
}

export default MainPage;
