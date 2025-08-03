import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkLoginId, clearLoginIdCheck } from '@/store/authSlice';
import axiosInstance from '@/services/axios-config';
import useToast from '@/common/hooks/useToast';
import PasswordSection from '@/common/forms/PasswordConfirm/PasswordSection';
import PhoneVerification from '@/common/forms/Phone/PhoneVerification';
import AddressSection from '@/common/forms/Address/AddressSection';
import Input from '@/common/components/Input';
import styles from './HubRegisterPage.module.scss';
import { useNavigate } from 'react-router-dom';
import { clearAllChecks } from '@/store/authSlice';
import { clearSMSAuth } from '@/store/smsAuthSlice';

function HubRegisterPage() {
  const dispatch = useDispatch();
  const { showSuccess, showNegative } = useToast();
  const { loginIdCheckMessage, loginIdCheckError } = useSelector(state => state.auth);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    loginId: '',
    password: '',
    passwordConfirm: '',
    shopName: '',
    ownerName: '',
    phone: '',
    roadFull: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [shopAddressCheckMessage, setShopAddressCheckMessage] = useState('');
  const [shopAddressCheckError, setShopAddressCheckError] = useState('');
  const [shopNameCheckMessage, setShopNameCheckMessage] = useState('');
  const [shopNameCheckError, setShopNameCheckError] = useState('');

  const loginIdTimer = useRef(null);
  const shopNameTimer = useRef(null);
  const shopAddressTimer = useRef(null);

  // 폼 클리어
  useEffect(() => {
    dispatch(clearAllChecks());
    dispatch(clearSMSAuth());
  }, [dispatch]);

  // 자동 아이디 중복검사
  useEffect(() => {
    if (loginIdTimer.current) clearTimeout(loginIdTimer.current);
    if (!form.loginId.trim()) {
      dispatch(clearLoginIdCheck());
      return;
    }
    loginIdTimer.current = setTimeout(() => {
      dispatch(checkLoginId(form.loginId.trim()));
    }, 400);
  }, [form.loginId, dispatch]);

  // 자동 지점명 중복검사
  useEffect(() => {
    if (shopNameTimer.current) clearTimeout(shopNameTimer.current);
    if (!form.shopName.trim()) {
      setShopNameCheckMessage('');
      setShopNameCheckError('');
      return;
    }
    shopNameTimer.current = setTimeout(async () => {
      try {
        const response = await axiosInstance.get('/shop-service/shop/check-shopName', {
          params: { shopName: form.shopName },
        });
        if (response.data.success) {
          setShopNameCheckMessage('사용 가능한 지점명입니다!');
          setShopNameCheckError('');
        } else {
          setShopNameCheckMessage('');
          setShopNameCheckError('이미 사용중인 지점명입니다.');
        }
      } catch (error) {
        setShopNameCheckMessage('');
        setShopNameCheckError(error.response?.data?.message || '중복 확인 오류');
      }
    }, 400);
  }, [form.shopName]);

  // 자동 주소 중복검사
  useEffect(() => {
    if (shopAddressTimer.current) clearTimeout(shopAddressTimer.current);
    if (!form.roadFull.trim()) {
      setShopAddressCheckMessage('');
      setShopAddressCheckError('');
      return;
    }
    shopAddressTimer.current = setTimeout(async () => {
      try {
        const response = await axiosInstance.get('/shop-service/shop/check-shopAddress', {
          params: { shopAddress: form.roadFull },
        });
        if (response.data.success) {
          setShopAddressCheckMessage('사용 가능한 주소입니다!');
          setShopAddressCheckError('');
        } else {
          setShopAddressCheckMessage('');
          setShopAddressCheckError('이미 사용중인 주소입니다.');
        }
      } catch (error) {
        setShopAddressCheckMessage('');
        setShopAddressCheckError(error.response?.data?.message || '주소 중복 확인 오류');
      }
    }, 400);
  }, [form.roadFull]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { loginId, password, passwordConfirm, shopName, ownerName, phone, roadFull } = form;

    if (
      !loginId ||
      !password ||
      !passwordConfirm ||
      !shopName ||
      !ownerName ||
      !phone ||
      !roadFull
    ) {
      showNegative('필수 항목을 모두 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axiosInstance.post('/auth-service/auth/shop-signup', {
        loginId: form.loginId,
        password: form.password,
        shopName: form.shopName,
        ownerName: form.ownerName,
        phone: form.phone,
        roadFull: form.roadFull,
      });
      if (response.data.success) {
        showSuccess(`가게명: ${response.data.data.shopName} 등록 완료`);
        navigate(-1);
        setForm({
          loginId: '',
          password: '',
          passwordConfirm: '',
          shopName: '',
          ownerName: '',
          phone: '',
          roadFull: '',
          addrDetail: '',
        });
        setVerificationCode('');
        dispatch(clearSMSAuth());
        dispatch(clearAllChecks());
      } else {
        showNegative(response.data.message || '가게 등록에 실패했습니다.');
      }
    } catch (error) {
      showNegative(error.response?.data?.message || '가게 등록 중 오류 발생');
    }
  };

  return (
    <div className={styles.HubRegisterPage}>
      <h2>가게 등록</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="아이디"
          required
          type="text"
          name="loginId"
          value={form.loginId}
          onChange={handleChange}
          error={loginIdCheckError}
          success={loginIdCheckMessage}
        />
        <Input
          label="지점명"
          required
          type="text"
          name="shopName"
          value={form.shopName}
          onChange={handleChange}
          error={shopNameCheckError}
          success={shopNameCheckMessage}
        />
        <Input
          label="대표자 이름"
          required
          type="text"
          name="ownerName"
          value={form.ownerName}
          onChange={handleChange}
        />
        <PasswordSection
          password={form.password}
          passwordConfirm={form.passwordConfirm}
          onPasswordChange={handleChange}
          onPasswordConfirmChange={handleChange}
        />
        <PhoneVerification
          phone={form.phone}
          verificationCode={verificationCode}
          onPhoneChange={handleChange}
          onVerificationCodeChange={e => setVerificationCode(e.target.value)}
        />
        <AddressSection
          address={form.roadFull}
          roadFull={form.roadFull}
          addrDetail={form.addrDetail || ''}
          onAddressChange={(field, value) => setForm(prev => ({ ...prev, [field]: value }))}
          showDetail={false}
        />
        <button type="submit" className={styles.submitButton}>
          가게 등록
        </button>
      </form>
    </div>
  );
}

export default HubRegisterPage;
