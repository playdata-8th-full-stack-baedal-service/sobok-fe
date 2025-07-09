import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SocialLoginListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = event => {
      if (event.origin !== 'http://localhost:8000') {
        console.warn('출처 불일치: ', event.origin);
        return;
      }

      const data = event.data;
      console.log('메시지 수신:', data);

      if (data.type === 'OAUTH_SUCCESS') {
        console.log('로그인 성공:', data);
        // 예: JWT 토큰 저장
        localStorage.setItem('accessToken', data.token);
        // 홈 또는 마이페이지로 이동
        navigate('/mypage');
      }

      if (data.type === 'NEW_USER_SIGNUP') {
        console.log('🆕 신규 사용자, 회원가입 유도:', data);

        // 회원가입 페이지로 이동하면서 카카오 정보를 쿼리로 전달
        const queryParams = new URLSearchParams({
          provider: data.provider,
          oauthId: data.oauthId,
          nickname: data.nickname,
          email: data.email,
        }).toString();

        // navigate(`/auth/signup/usersignup?${queryParams}`);
        navigate('/auth/signup/kakao-usersignup', {
          state: {
            provider: data.provider,
            oauthId: data.oauthId,
            nickname: data.nickname,
            email: data.email,
          },
        });
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  return null; // 화면 출력 없음
}

export default SocialLoginListener;
