import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SignInPage from '../common/page/SignInPage';
import FindIDPage from '../common/page/FindIDPage';
import FindPWPage from '../common/page/FindPWPage';
import SignUpOption from '../common/page/SignUpOptionPage';
import SignUpComplete from '../common/page/SignUpCompletePage';
import PersonalInfoCertifi from '../common/page/PersonalInfoCerifiPage';

import UserHeader from '../common/headerfooter/UserHeader';

function AuthRoutes() {
  return (
    <>
      <UserHeader />
      <Routes>
        <Route path="signin" element={<SignInPage />} />
        <Route path="find-id" element={<FindIDPage />} />
        <Route path="find-password" element={<FindPWPage />} />
        <Route path="signup" element={<SignUpOption />} />
        <Route path="signup/complete" element={<SignUpComplete />} />
        <Route path="signup/personal" element={<PersonalInfoCertifi />} />
      </Routes>
    </>
  );
}

export default AuthRoutes;
