import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendSMSCode, verifySMSCode, resetSMSAuth } from '@/store/smsAuthSlice';
import { checkLoginId, clearLoginIdCheck } from '@/store/authSlice';
import styled from './HubRegisterPage.module.scss';
import axiosInstance from '../../../services/axios-config';
// import DuplicateCheckInput from '@/common/components/DuplicateCheckInput';
import ShopNameDuplicateCheckInput from './ShopNameDuplicateCheckInput';

function HubRegisterPage() {
  const dispatch = useDispatch();
  const { isVerified, isCodeSent, error: smsError, loading } = useSelector(state => state.smsAuth);

  // authSlice에서 아이디 중복확인 관련 상태 가져오기
  const {
    loginIdCheckMessage,
    loginIdCheckError,
    loading: authLoading,
  } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    shopName: '',
    ownerName: '',
    phone: '',
    roadFull: '',
  });

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // 아이디 중복확인 상태 관리
  const [loginIdCheck, setLoginIdCheck] = useState({
    isChecked: false,
    isAvailable: false,
  });

  const [shopNameCheck, setShopNameCheck] = useState({
    isChecked: false,
    isAvailable: false,
    loading: false,
    error: null,
  });

  // 주소 중복확인 상태 관리 추가
  const [shopAddressCheck, setShopAddressCheck] = useState({
    isChecked: false,
    isAvailable: false,
    loading: false,
    error: null,
  });

  // 비밀번호 검증 상태 관리
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    isMatching: false,
    showValidation: false,
    showMatchValidation: false,
  });

  // 비밀번호 유효성 검사 함수
  const validatePassword = password => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;
    return passwordRegex.test(password);
  };

  // 비밀번호 입력 처리
  const handlePasswordChange = e => {
    const newPassword = e.target.value;
    setFormData(prev => ({
      ...prev,
      password: newPassword,
    }));

    // 비밀번호 유효성 검사
    const isValid = validatePassword(newPassword);
    const isMatching = newPassword === passwordConfirm;

    setPasswordValidation({
      isValid,
      isMatching,
      showValidation: newPassword.length > 0,
      showMatchValidation: passwordConfirm.length > 0,
    });
  };

  // 비밀번호 확인 입력 처리
  const handlePasswordConfirmChange = e => {
    const newPasswordConfirm = e.target.value;
    setPasswordConfirm(newPasswordConfirm);

    // 비밀번호 일치 확인
    const isMatching = formData.password === newPasswordConfirm;

    setPasswordValidation(prev => ({
      ...prev,
      isMatching,
      showMatchValidation: newPasswordConfirm.length > 0,
    }));
  };

  // 아이디 중복확인 결과 처리
  useEffect(() => {
    if (loginIdCheckMessage) {
      setLoginIdCheck({
        isChecked: true,
        isAvailable: true,
      });
      alert(loginIdCheckMessage);
    }

    if (loginIdCheckError) {
      setLoginIdCheck({
        isChecked: true,
        isAvailable: false,
      });
      alert(loginIdCheckError);
    }
  }, [loginIdCheckMessage, loginIdCheckError]);

  // 다음 주소검색 API 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // 아이디 입력값이 변경되면 중복확인 상태 초기화
    if (name === 'loginId') {
      setLoginIdCheck({
        isChecked: false,
        isAvailable: false,
      });
      dispatch(clearLoginIdCheck()); // Redux 상태도 초기화
    }

    if (name === 'shopName') {
      setShopNameCheck({
        isChecked: false,
        isAvailable: false,
        loading: false,
        error: null,
      });
    }

    // 주소 입력값이 변경되면 중복확인 상태 초기화
    if (name === 'roadFull') {
      setShopAddressCheck({
        isChecked: false,
        isAvailable: false,
        loading: false,
        error: null,
      });
    }
  };

  // 아이디 중복확인 함수
  const handleCheckLoginId = () => {
    if (!formData.loginId.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }

    // 아이디 형식 검증 (영문자, 숫자만 허용, 4-20자)
    const loginIdRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!loginIdRegex.test(formData.loginId)) {
      alert('아이디는 영문자와 숫자만 사용하여 4~20자로 입력해주세요.');
      return;
    }

    dispatch(checkLoginId(formData.loginId));
  };

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

  const handleCheckShopName = async () => {
    if (!formData.shopName.trim()) {
      alert('지점 이름을 입력하세요.');
      return;
    }

    setShopNameCheck(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      // axiosInstance를 사용하여 CORS 설정 적용
      const response = await axiosInstance.get('/auth-service/auth/check-shopName', {
        params: {
          shopName: formData.shopName,
        },
      });

      console.log('API 응답:', response.data); // 디버깅용 로그

      // API 응답이 성공인 경우
      if (response.data.success === true && response.data.status === 200) {
        setShopNameCheck({
          isChecked: true,
          isAvailable: true,
          loading: false,
          error: null,
        });
        alert(response.data.message || '사용 가능한 지점명입니다.');
      } else {
        // API 응답이 실패인 경우
        setShopNameCheck({
          isChecked: true,
          isAvailable: false,
          loading: false,
          error: response.data.message || '이미 사용중인 지점명입니다.',
        });
        alert(response.data.message || '이미 사용중인 지점명입니다.');
      }
    } catch (error) {
      console.error('지점명 중복 확인 오류:', error);

      // 서버에서 400, 409 등의 에러 응답을 보낸 경우
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || '이미 사용중인 지점명입니다.';
        setShopNameCheck({
          isChecked: true,
          isAvailable: false,
          loading: false,
          error: errorMessage,
        });
        alert(errorMessage);
      } else {
        // 네트워크 오류 등의 경우
        setShopNameCheck({
          isChecked: true,
          isAvailable: false,
          loading: false,
          error: '중복 확인 중 오류가 발생했습니다.',
        });
        alert('중복 확인 중 오류가 발생했습니다.');
      }
    }
  };

  // 주소 중복확인 함수 추가
  const handleCheckShopAddress = async () => {
    if (!formData.roadFull.trim()) {
      alert('주소를 입력해주세요.');
      return;
    }

    setShopAddressCheck(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await axiosInstance.get('/auth-service/auth/check-shopAddress', {
        params: {
          shopAddress: formData.roadFull,
        },
      });

      console.log('주소 중복 확인 API 응답:', response.data);

      // API 응답이 성공인 경우
      if (response.data.success === true && response.data.status === 200) {
        setShopAddressCheck({
          isChecked: true,
          isAvailable: true,
          loading: false,
          error: null,
        });
        alert(response.data.message || '사용 가능한 주소입니다.');
      } else {
        // API 응답이 실패인 경우
        setShopAddressCheck({
          isChecked: true,
          isAvailable: false,
          loading: false,
          error: response.data.message || '이미 사용중인 주소입니다.',
        });
        alert(response.data.message || '이미 사용중인 주소입니다.');
      }
    } catch (error) {
      console.error('주소 중복 확인 오류:', error);

      // 서버에서 400, 409 등의 에러 응답을 보낸 경우
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || '이미 사용중인 주소입니다.';
        setShopAddressCheck({
          isChecked: true,
          isAvailable: false,
          loading: false,
          error: errorMessage,
        });
        alert(errorMessage);
      } else {
        // 네트워크 오류 등의 경우
        setShopAddressCheck({
          isChecked: true,
          isAvailable: false,
          loading: false,
          error: '주소 중복 확인 중 오류가 발생했습니다.',
        });
        alert('주소 중복 확인 중 오류가 발생했습니다.');
      }
    }
  };

  // 다음 주소검색 팝업 열기
  const handleAddressSearch = () => {
    if (!window.daum) {
      alert('주소검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete(data) {
        // 선택된 주소 타입에 따라 주소 설정
        let addr = '';
        let extraAddr = '';

        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === 'R') {
          // 도로명 주소를 선택한 경우
          addr = data.roadAddress;
        } else {
          // 지번 주소를 선택한 경우(J)
          addr = data.jibunAddress;
        }

        // 사용자가 선택한 주소가 도로명 타입일 때 참고항목을 조합한다.
        if (data.userSelectedType === 'R') {
          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddr += extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if (extraAddr !== '') {
            extraAddr = ` (${extraAddr})`;
          }
        }

        // 최종 주소 설정
        const fullAddress = addr + extraAddr;

        setFormData(prev => ({
          ...prev,
          roadFull: fullAddress,
        }));

        // 주소가 변경되었으므로 중복확인 상태 초기화
        setShopAddressCheck({
          isChecked: false,
          isAvailable: false,
          loading: false,
          error: null,
        });
      },
      // 팝업 크기 설정
      width: '100%',
      height: '100%',
      // 검색 결과 항목 개수 설정
      maxSuggestItems: 5,
    }).open();
  };

  const validateForm = () => {
    if (
      !formData.loginId ||
      !formData.ownerName ||
      !formData.password ||
      !formData.phone ||
      !formData.roadFull ||
      !formData.shopName
    ) {
      alert('필수 항목을 모두 입력해주세요.');
      return false;
    }

    if (!passwordValidation.isValid) {
      alert('비밀번호는 대소문자, 숫자, 특수문자를 포함하여 8~16자로 입력해주세요.');
      return false;
    }

    if (!passwordValidation.isMatching) {
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }

    if (!isVerified) {
      alert('전화번호 인증을 완료해주세요.');
      return false;
    }

    // 아이디 중복확인 체크
    if (!loginIdCheck.isChecked || !loginIdCheck.isAvailable) {
      alert('아이디 중복 확인을 완료해주세요.');
      return false;
    }

    if (!shopNameCheck.isChecked || !shopNameCheck.isAvailable) {
      alert('지점 이름 중복 확인을 완료해주세요.');
      return false;
    }

    // 주소 중복확인 체크 추가
    if (!shopAddressCheck.isChecked || !shopAddressCheck.isAvailable) {
      alert('주소 중복 확인을 완료해주세요.');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      loginId: '',
      password: '',
      shopName: '',
      ownerName: '',
      phone: '',
      roadFull: '',
    });
    setPasswordConfirm('');
    setVerificationCode('');
    setLoginIdCheck({
      isChecked: false,
      isAvailable: false,
    });
    setShopNameCheck({
      isChecked: false,
      isAvailable: false,
      loading: false,
      error: null,
    });
    setShopAddressCheck({
      isChecked: false,
      isAvailable: false,
      loading: false,
      error: null,
    });
    setPasswordValidation({
      isValid: false,
      isMatching: false,
      showValidation: false,
      showMatchValidation: false,
    });
    dispatch(resetSMSAuth());
    dispatch(clearLoginIdCheck());
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);

    try {
      const response = await axiosInstance.post('/auth-service/auth/shop', {
        loginId: formData.loginId,
        password: formData.password,
        shopName: formData.shopName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        roadFull: formData.roadFull,
      });

      if (response.data.success) {
        alert(
          `가게 회원가입 성공!\n가게명: ${response.data.data.shopName}\nID: ${response.data.data.id}`
        );
        resetForm();
      } else {
        alert(response.data.message || '가게 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('가게 등록 오류:', error);
      alert(error.response?.data?.message || '가게 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className={styled.HubRegisterPage}>
      <h2 className={styled.hubregistertitle}>가게 등록</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="loginId">
            아이디 <span>*</span>
          </label>
          <div className={styled.loginIdinput}>
            <input
              type="text"
              name="loginId"
              id="loginId"
              value={formData.loginId}
              onChange={handleInputChange}
              placeholder="영문자, 숫자 4~20자"
            />
            <button
              type="button"
              onClick={handleCheckLoginId}
              disabled={authLoading || !formData.loginId.trim()}
            >
              {authLoading ? '확인 중...' : '중복 확인'}
            </button>
          </div>
          {loginIdCheck.isChecked && loginIdCheck.isAvailable && (
            <p className={styled.corretshopname}>✓ 사용 가능한 아이디입니다!</p>
          )}
          {loginIdCheck.isChecked && !loginIdCheck.isAvailable && (
            <p className={styled.notshopname}>이미 사용중인 아이디입니다.</p>
          )}
        </div>

        {/* 지점명 중복확인 인풋+버튼+상태 메시지 */}
        <ShopNameDuplicateCheckInput
          value={formData.shopName}
          onChange={e => {
            handleInputChange(e);
            setShopNameCheck({
              isChecked: false,
              isAvailable: false,
              loading: false,
              error: null,
            });
          }}
          onCheck={handleCheckShopName}
          loading={shopNameCheck.loading}
          isChecked={shopNameCheck.isChecked}
          isAvailable={shopNameCheck.isAvailable}
          error={shopNameCheck.error}
        />

        <div>
          <label htmlFor="ownerName">
            대표자 이름 <span>*</span>
          </label>
          <input
            type="text"
            name="ownerName"
            id="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="password">
            비밀번호 <span>*</span>
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handlePasswordChange}
            placeholder="대소문자, 숫자, 특수문자 포함 8~16자"
          />
          {passwordValidation.showValidation && (
            <div style={{ marginTop: '5px' }}>
              <p
                style={{
                  color: passwordValidation.isValid ? 'green' : 'red',
                  fontSize: '14px',
                }}
              >
                {passwordValidation.isValid
                  ? '✓ 사용 가능한 비밀번호입니다!'
                  : '✗ 대소문자, 숫자, 특수문자(@$!%*?&)를 포함하여 8~16자로 입력해주세요.'}
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="passwordConfirm">
            비밀번호 확인 <span>*</span>
          </label>
          <input
            type="password"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
            placeholder="비밀번호를 다시 입력해주세요"
          />
          {passwordValidation.showMatchValidation && (
            <div style={{ marginTop: '5px' }}>
              <p
                style={{
                  color: passwordValidation.isMatching ? 'green' : 'red',
                  fontSize: '14px',
                }}
              >
                {passwordValidation.isMatching
                  ? '✓ 비밀번호가 일치합니다!'
                  : '✗ 비밀번호가 일치하지 않습니다.'}
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="phone">
            전화 번호 <span>*</span>
          </label>
          <div className={styled.phoneinput}>
            <input
              type="text"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isVerified}
            />
            <button type="button" onClick={handleSendSMS} disabled={loading || isVerified}>
              {loading ? '전송 중...' : isCodeSent ? '재전송' : '인증하기'}
            </button>
          </div>
          {isCodeSent && !isVerified && (
            <p style={{ color: 'green', fontSize: '14px', marginTop: '5px' }}>
              인증번호가 전송되었습니다.
            </p>
          )}
        </div>

        {isCodeSent && !isVerified && (
          <div>
            <label htmlFor="phonevalid">
              인증 번호 <span>*</span>
            </label>
            <div className={styled.phoneinput}>
              <input
                type="text"
                id="phonevalid"
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value)}
                placeholder="인증번호를 입력하세요"
              />
              <button type="button" onClick={handleVerifySMS} disabled={loading}>
                {loading ? '확인 중...' : '확인'}
              </button>
            </div>
          </div>
        )}

        {isVerified && (
          <div style={{ color: 'green', fontSize: '14px', marginTop: '5px' }}>
            ✓ 인증이 완료되었습니다.
          </div>
        )}

        {smsError && (
          <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{smsError}</div>
        )}

        <div>
          <label htmlFor="roadFull">
            지점 주소 <span>*</span>
          </label>
          <div className={styled.addrinput}>
            <input
              type="text"
              name="roadFull"
              id="roadFull"
              value={formData.roadFull}
              onChange={handleInputChange}
              placeholder="주소검색 버튼을 클릭해주세요"
            />
            <button type="button" onClick={handleAddressSearch}>
              주소 검색
            </button>
          </div>
          {/* 주소 중복 확인 버튼 및 상태 표시 추가 */}
          {formData.roadFull && (
            <div className={styled.addrinput} style={{ marginTop: '10px' }}>
              <input type="text" value={formData.roadFull} placeholder="선택된 주소" readOnly />
              <button
                type="button"
                onClick={handleCheckShopAddress}
                disabled={shopAddressCheck.loading || !formData.roadFull.trim()}
              >
                {shopAddressCheck.loading ? '처리 중...' : '중복 확인'}
              </button>
            </div>
          )}
          {shopAddressCheck.isChecked && shopAddressCheck.isAvailable && (
            <p className={styled.corretshopname}>✓ 사용 가능한 주소입니다!</p>
          )}
          {shopAddressCheck.error && <p className={styled.notshopname}>{shopAddressCheck.error}</p>}
        </div>

        <button type="submit" className={styled.submitButton} disabled={submitLoading}>
          {submitLoading ? '등록 중...' : '가게 등록'}
        </button>
      </form>
    </div>
  );
}

export default HubRegisterPage;
