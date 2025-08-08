import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useToast from '@/common/hooks/useToast';

function SocialLoginListener() {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { showNegative } = useToast();
  const { showInfo } = useToast();

  useEffect(() => {
    const handleMessage = event => {
      if (event.origin !== 'http://localhost:8000' && event.origin !== 'https://api.sobok.shop') {
        console.warn('출처 불일치: ', window.location.origin);
        return;
      }

      const data = event.data;
      console.log('메시지 수신:', data);

      if (data.type === 'OAUTH_SUCCESS') {
        console.log('로그인 성공:', data);
        showSuccess('로그인 되었습니다.');
        localStorage.setItem('ACCESS_TOKEN', data.accessToken);
        localStorage.setItem('REFRESH_TOKEN', data.refreshToken);
        localStorage.setItem('USER_ROLE', data.role);
        localStorage.setItem('USER_ID', data.id);
        localStorage.setItem('RECOVERY_TARGET', data.recoveryTarget);
        console.log('수신 데이터:', event.data);
        console.log('ID 값:', event.data.id);

        // 역할에 따라 다른 경로로 이동
        switch (data.role) {
          case 'USER':
            navigate('/main');
            break;
          case 'ADMIN':
            navigate('/admin');
            break;
          case 'RIDER':
            navigate('/rider');
            break;
          case 'HUB':
            navigate('/hub');
            break;
          default:
            navigate('/');
        }
      }

      if (data.type === 'NEW_USER_SIGNUP') {
        console.log('🆕 신규 사용자, 회원가입 유도:', data);

        navigate('/auth/signup/social-usersignup', {
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

  return null;
}

export default SocialLoginListener;
