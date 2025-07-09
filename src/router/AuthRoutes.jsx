import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SignIn from '../pages/auth/SignIn/SignInPage';
import SignUpOption from '../pages/auth/SignUpOption/SignUpOptionPage';
import SignUpComplete from '../pages/auth/SignUpComplete/SignUpCompletePage';
import UserHeader from '../layout/headers/userHeader/UserHeader';
import UserSignUp from '../pages/auth/SignUp/UserSignUp/UserSignUp';
import RiderSignUp from '../pages/auth/SignUp/RiderSignUp/RiderSignUp';

function AuthRoutes() {
  return (
    <>
      <UserHeader />
      <Routes>
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUpOption />} />
        <Route path="signup/complete" element={<SignUpComplete />} />
        <Route path="signup/usersignup" element={<UserSignUp />} />
        <Route path="signup/ridersignup" element={<RiderSignUp />} />
      </Routes>
    </>
  );
}

export default AuthRoutes;
