import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SignInPage from '../pages/auth/SignIn/SignInPage';
import FindIDPage from '../pages/auth/FindID/FindIDPage';
import FindPWPage from '../pages/auth/FindPW/FindPWPage';
import SignUpOption from '../pages/auth/SignUpOption/SignUpOptionPage';
import SignUpComplete from '../pages/auth/SignUpComplete/SignUpCompletePage';
import PersonalInfoCertifi from '../pages/auth/PersonalInfoCertifi/PersonalInfoCerifiPage';

import UserHeader from '../layout/headers/userHeader/UserHeader';
import UserSignUp from '../pages/auth/SignUp/UserSignUp/UserSignUp';
import RiderSignUp from '../pages/auth/SignUp/RiderSignUp/RiderSignUp';

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
        <Route path="signup/usersignup" element={<UserSignUp />} />
        <Route path="signup/ridersignup" element={<RiderSignUp />} />
      </Routes>
    </>
  );
}

export default AuthRoutes;
