import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendSMSCode, verifySMSCode } from '../../store/smsAuthSlice'; // <- SMS 인증 관련 slice import
import { signUpUser, clearSignUpSuccess } from '../../store/authSlice';
import './UserSignUp.scss';

function UserSignUp() {
  const dispatch = useDispatch();
  const ref = useRef();

  const { loading, error, signUpSuccess } = useSelector(state => state.auth);
  const { isVerified, isCodeSent, error: smsError } = useSelector(state => state.smsAuth);

  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    nickname: '',
    phone: '',
    photo: '/photodefault.svg',
    roadFull: '',
    addrDetail: '',
  });

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [emailLocal, setEmailLocal] = useState('');
  const [emailDomain, setEmailDomain] = useState('gmail.com');
  const [customDomain, setCustomDomain] = useState('');
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const domainOptions = [
    'gmail.com',
    'naver.com',
    'daum.net',
    'yahoo.com',
    'hotmail.com',
    '직접입력',
  ];

  const isPasswordMatch = formData.password === passwordConfirm;
  const showPasswordMisMatch = passwordConfirm && !isPasswordMatch;

  const getFullEmail = () => {
    const domain = isCustomDomain ? customDomain : emailDomain;
    return emailLocal && domain ? `${emailLocal}@${domain}` : '';
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDomainChange = e => {
    const selected = e.target.value;
    if (selected === '직접입력') {
      setIsCustomDomain(true);
      setEmailDomain('');
    } else {
      setIsCustomDomain(false);
      setEmailDomain(selected);
      setCustomDomain('');
    }
  };

  const openDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete(data) {
        const addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        let extra = '';
        if (data.userSelectedType === 'R') {
          if (data.bname && /[동|로|가]$/g.test(data.bname)) extra += data.bname;
          if (data.buildingName && data.apartment === 'Y')
            extra += extra ? `, ${data.buildingName}` : data.buildingName;
          if (extra) extra = ` (${extra})`;
        }
        setFormData(prev => ({ ...prev, roadFull: addr + extra }));
        document.querySelector('input[name="addrDetail"]')?.focus();
      },
    }).open();
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  const handleSendSMS = () => {
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('전화번호는 하이픈 없이 11자리 숫자로 입력해주세요.');
      return;
    }
    dispatch(sendSMSCode(formData.phone));
  };

  const handleVerifySMS = () => {
    if (!verificationCode.trim()) {
      alert('인증번호를 입력해주세요.');
      return;
    }
    dispatch(
      verifySMSCode({
        phoneNumber: formData.phone,
        inputCode: verificationCode.trim(),
      })
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.loginId || !formData.password || !formData.nickname || !formData.phone) {
      alert('필수 항목을 모두 입력해주세요.');
      ref.current?.focus();
      return;
    }

    if (!isPasswordMatch) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      alert('비밀번호는 대소문자, 숫자, 특수문자를 포함하여 8~16자로 입력해주세요.');
      return;
    }

    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('전화번호는 하이픈 없이 11자리 숫자로 입력해주세요.');
      return;
    }

    if (!isVerified) {
      alert('휴대폰 인증을 완료해주세요.');
      return;
    }

    const completeFormData = {
      ...formData,
      email: getFullEmail() || null,
      roadFull: formData.roadFull.trim() === '' ? null : formData.roadFull,
      addrDetail: formData.addrDetail.trim() === '' ? null : formData.addrDetail,
    };

    try {
      await dispatch(signUpUser(completeFormData)).unwrap();
      alert('회원가입 요청 완료');
    } catch (err) {
      console.error('회원가입 실패:', err);
      alert(err || '회원가입에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (signUpSuccess) {
      alert('회원가입이 성공적으로 완료되었습니다.');
      setFormData({
        loginId: '',
        password: '',
        nickname: '',
        phone: '',
        photo: '/photodefault.svg',
        roadFull: '',
        addrDetail: '',
      });
      setPasswordConfirm('');
      setEmailLocal('');
      setEmailDomain('gmail.com');
      setCustomDomain('');
      setIsCustomDomain(false);
      setVerificationCode('');
      dispatch(clearSignUpSuccess());
    }
  }, [signUpSuccess, dispatch]);

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h2>회원가입</h2>
      </div>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="container-top">
          <div>
            <input type="file" accept="image/*" />
          </div>
          <div>
            <div className="form-group">
              <label htmlFor="loginId">
                아이디 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="loginId"
                name="loginId"
                value={formData.loginId}
                onChange={handleInputChange}
                ref={ref}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nickname">
                닉네임 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">
            비밀번호 <span className="required">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="passwordConfirm">
            비밀번호 확인 <span className="required">*</span>
          </label>
          <input
            type="password"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={e => setPasswordConfirm(e.target.value)}
            className={showPasswordMisMatch ? 'input-error' : ''}
            required
          />
          {showPasswordMisMatch && <p className="message error">비밀번호가 일치하지 않습니다.</p>}
          {isPasswordMatch && passwordConfirm && (
            <p className="message success">비밀번호가 일치합니다.</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            전화번호 <span className="required">*</span>
          </label>
          <div className="phoneflex">
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="01012345678"
              required
            />
            <button type="button" onClick={handleSendSMS} disabled={isCodeSent}>
              {isCodeSent ? '전송됨' : '인증하기'}
            </button>
          </div>
          {smsError && <p className="message error">{smsError}</p>}
        </div>

        {isCodeSent && (
          <div className="form-group">
            <label htmlFor="phonevalid">인증 번호</label>
            <div className="phoneflex">
              <input
                type="text"
                id="phonevalid"
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value)}
              />
              <button type="button" onClick={handleVerifySMS}>
                확인
              </button>
            </div>
            {isVerified && <p className="message success">인증이 완료되었습니다.</p>}
          </div>
        )}

        <div className="form-group">
          <label>이메일 (선택)</label>
          <div className="email-inputs">
            <input
              type="text"
              value={emailLocal}
              onChange={e => setEmailLocal(e.target.value)}
              placeholder="이메일"
            />
            <span>@</span>
            <select value={isCustomDomain ? '직접입력' : emailDomain} onChange={handleDomainChange}>
              {domainOptions.map(domain => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
          {isCustomDomain && (
            <input
              type="text"
              value={customDomain}
              onChange={e => setCustomDomain(e.target.value)}
              placeholder="도메인을 입력하세요 (예: company.com)"
              className="custom-domain-input"
            />
          )}
          {getFullEmail() && <p className="email-preview">완성된 이메일: {getFullEmail()}</p>}
        </div>

        <div className="form-group address-group">
          <label>주소 (선택)</label>
          <div className="address-search">
            <input
              type="text"
              value={formData.roadFull}
              placeholder="주소검색 버튼을 클릭해주세요"
              readOnly
            />
            <button type="button" onClick={openDaumPostcode}>
              주소검색
            </button>
          </div>
          <input
            type="text"
            name="addrDetail"
            value={formData.addrDetail}
            onChange={handleInputChange}
            placeholder="상세주소를 입력하세요"
          />
        </div>

        <div className="form-group">
          <button type="submit" disabled={loading}>
            {loading ? '처리중...' : '회원가입'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}

export default UserSignUp;
