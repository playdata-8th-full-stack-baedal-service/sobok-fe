import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSignUpSuccess } from '../../../../store/authSlice';
import './UserSignUp.scss';

function UserSignUp() {
  const dispatch = useDispatch();
  const { loading, error, signUpSuccess } = useSelector(state => state.auth);
  const ref = useRef();

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

  const domainOptions = [
    'gmail.com',
    'naver.com',
    'daum.net',
    'yahoo.com',
    'hotmail.com',
    '직접입력',
  ];

  const isPasswordMatch =
    formData.password && passwordConfirm && formData.password === passwordConfirm;
  const showPasswordMisMatch = passwordConfirm && formData.password !== passwordConfirm;

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
    const selectedDomain = e.target.value;
    if (selectedDomain === '직접입력') {
      setIsCustomDomain(true);
      setEmailDomain('');
    } else {
      setIsCustomDomain(false);
      setEmailDomain(selectedDomain);
      setCustomDomain('');
    }
  };

  // 다음 주소 API 연동
  const openDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.

        let addr = ''; // 주소 변수
        let extraAddr = ''; // 참고항목 변수

        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === 'R') {
          // 사용자가 도로명 주소를 선택했을 경우
          addr = data.roadAddress;
        } else {
          // 사용자가 지번 주소를 선택했을 경우(J)
          addr = data.jibunAddress;
        }

        // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
        if (data.userSelectedType === 'R') {
          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if (extraAddr !== '') {
            extraAddr = ' (' + extraAddr + ')';
          }
        }

        // 최종 주소 설정
        const fullAddress = addr + extraAddr;

        // 폼 데이터에 주소 설정
        setFormData(prev => ({
          ...prev,
          roadFull: fullAddress,
        }));

        // 상세주소 입력 필드로 포커스 이동
        const detailAddressInput = document.querySelector('input[name="addrDetail"]');
        if (detailAddressInput) {
          detailAddressInput.focus();
        }
      },
      width: '500',
      height: '600',
      maxSuggestItems: 5,
    }).open();
  };

  // 다음 우편번호 서비스 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      document.head.removeChild(script);
    };
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.loginId || !formData.password || !formData.nickname || !formData.phone) {
      alert('필수 항목을 모두 입력해주세요.');
      ref.current?.focus();
      return;
    }

    if (formData.password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      alert('비밀번호는 대소문자, 숫자, 특수문자를 포함하여 8~16자로 입력해주세요.');
      return;
    }

    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('전화번호는 하이픈 없이 11자리 숫자로 입력해주세요.');
      return;
    }

    const completeFormData = {
      ...formData,
      email: getFullEmail() || undefined,
    };

    if (completeFormData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(completeFormData.email)) {
        alert('올바른 이메일 형식이 아닙니다.');
        ref.current.focus();
        return;
      }
    }

    try {
      // await dispatch(UserSignUp(completeFormData)).unwrap();
      alert('회원가입 요청 완료 (로직은 연결 필요)');
      console.log('완성된 폼 데이터:', completeFormData);
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert(error || '회원가입에 실패했습니다.');
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
      dispatch(clearSignUpSuccess());
    }
  }, [signUpSuccess, dispatch]);

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h2>회원가입</h2>
      </div>

      <form onSubmit={handleSubmit} className="signup-form">
        {/* 아이디 */}
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

        {/* 닉네임 */}
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
            placeholder="닉네임을 입력하세요"
            required
          />
        </div>

        {/* 비밀번호 */}
        <div className="form-group">
          <label htmlFor="password">
            비밀번호 <span className="required">*</span> (대소문자, 숫자, 특수문자 포함 8~16자)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="form-group">
          <label htmlFor="passwordConfirm">
            비밀번호 확인 <span className="required">*</span>
          </label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={e => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호를 다시 입력하세요"
            className={showPasswordMisMatch ? 'input-error' : ''}
            required
          />
          {showPasswordMisMatch && <p className="message error">비밀번호가 일치하지 않습니다.</p>}
          {isPasswordMatch && <p className="message success">비밀번호가 일치합니다.</p>}
        </div>

        {/* 전화번호 */}
        <div className="form-group">
          <label htmlFor="phone">
            전화번호 <span className="required">*</span> (하이픈 없이 11자리)
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="01012345678"
            required
          />
        </div>

        {/* 이메일 */}
        <div className="form-group email-group">
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

        {/* 주소 */}
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
            placeholder="상세주소를 입력하세요 (예: 3층 302호)"
          />
        </div>

        {/* 제출 */}
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
