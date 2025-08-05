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
  const [localValidationErrors, setLocalValidationErrors] = useState({
    loginId: '',
    shopName: '',
    ownerName: '',
  });

  const loginIdTimer = useRef(null);
  const shopNameTimer = useRef(null);
  const shopAddressTimer = useRef(null);

  // 입력값 유효성 검사 함수들
  const validateLoginId = (value) => {
    const loginIdPattern = /^[a-zA-Z0-9]+$/;
    if (!value.trim()) return '';
    if (value.length < 4) {
      return '아이디는 4자 이상 입력해주세요.';
    }
    if (value.length > 20) {
      return '아이디는 20자 이하로 입력해주세요.';
    }
    if (!loginIdPattern.test(value)) {
      return '아이디는 영문과 숫자만 입력 가능합니다.';
    }
    return '';
  };

  const validateShopName = (value) => {
    if (!value.trim()) return '';
    
    // 한글 자음/모음만 있는지 체크 (완성된 한글이 아닌 경우)
    const incompleteKoreanPattern = /[ㄱ-ㅎㅏ-ㅣ]/;
    if (incompleteKoreanPattern.test(value)) {
      return '지점명에 불완전한 한글(자음/모음)은 사용할 수 없습니다.';
    }
    
    // 의미 있는 문자만 포함하는지 체크 (완성된 한글, 영문, 숫자, 공백, 일부 특수문자만 허용)
    const validPattern = /^[가-힣a-zA-Z0-9\s\-_.()]+$/;
    if (!validPattern.test(value)) {
      return '지점명에 올바르지 않은 문자가 포함되어 있습니다.';
    }
    
    return '';
  };

  const validateOwnerName = (value) => {
    if (!value.trim()) return '';
    
    // 한글 자음/모음만 있는지 체크
    const incompleteKoreanPattern = /[ㄱ-ㅎㅏ-ㅣ]/;
    if (incompleteKoreanPattern.test(value)) {
      return '이름에 불완전한 한글(자음/모음)은 사용할 수 없습니다.';
    }
    
    // 이름은 완성된 한글, 영문만 허용 (공백, 숫자, 특수문자 제외)
    const validNamePattern = /^[가-힣a-zA-Z]+$/;
    if (!validNamePattern.test(value)) {
      return '이름은 한글 또는 영문만 입력 가능합니다 (공백 불가).';
    }
    
    return '';
  };

  // 폼 클리어
  useEffect(() => {
    dispatch(clearAllChecks());
    dispatch(clearSMSAuth());
  }, [dispatch]);

  // 자동 아이디 중복검사
  useEffect(() => {
    if (loginIdTimer.current) clearTimeout(loginIdTimer.current);
    
    // 로컬 유효성 검사 먼저 수행
    const validationError = validateLoginId(form.loginId);
    setLocalValidationErrors(prev => ({ ...prev, loginId: validationError }));
    
    if (!form.loginId.trim() || validationError) {
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
    
    // 로컬 유효성 검사 먼저 수행
    const validationError = validateShopName(form.shopName);
    setLocalValidationErrors(prev => ({ ...prev, shopName: validationError }));
    
    if (!form.shopName.trim() || validationError) {
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

  // 대표자 이름 유효성 검사
  useEffect(() => {
    const validationError = validateOwnerName(form.ownerName);
    setLocalValidationErrors(prev => ({ ...prev, ownerName: validationError }));
  }, [form.ownerName]);

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

    // 필수 항목 체크
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

    // 로컬 유효성 검사 에러 체크
    if (localValidationErrors.loginId || localValidationErrors.shopName || localValidationErrors.ownerName) {
      showNegative('입력 형식을 확인해주세요.');
      return false;
    }

    // 서버 중복 검사 에러 체크
    if (loginIdCheckError || shopNameCheckError || shopAddressCheckError) {
      showNegative('중복 확인 오류를 해결해주세요.');
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
        setLocalValidationErrors({
          loginId: '',
          shopName: '',
          ownerName: '',
        });
        dispatch(clearSMSAuth());
        dispatch(clearAllChecks());
      } else {
        showNegative(response.data.message || '가게 등록에 실패했습니다.');
      }
    } catch (error) {
      showNegative(error.response?.data?.message || '가게 등록 중 오류 발생');
    }
  };

  // 에러 메시지 우선순위: 로컬 유효성 검사 > 서버 응답
  const getLoginIdError = () => localValidationErrors.loginId || loginIdCheckError;
  const getShopNameError = () => localValidationErrors.shopName || shopNameCheckError;
  const getOwnerNameError = () => localValidationErrors.ownerName;

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
          error={getLoginIdError()}
          success={!getLoginIdError() ? loginIdCheckMessage : ''}
        />
        <Input
          label="지점명"
          required
          type="text"
          name="shopName"
          value={form.shopName}
          onChange={handleChange}
          error={getShopNameError()}
          success={!getShopNameError() ? shopNameCheckMessage : ''}
        />
        <Input
          label="대표자 이름"
          required
          type="text"
          name="ownerName"
          value={form.ownerName}
          onChange={handleChange}
          error={getOwnerNameError()}
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