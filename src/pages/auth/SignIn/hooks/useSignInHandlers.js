import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../../store/authSlice';
import { setToken } from '../../../../common/utils/token';

export default function useSignInHandlers({ id, password, setError, setPassword, idInputRef }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setError('');
    try {
      const result = await dispatch(loginUser({ id, password }));

      if (loginUser.fulfilled.match(result)) {
        const { accessToken, role, userId, recoveryTarget } = result.payload;

        // 토큰 저장
        setToken(accessToken);

        // 필요한 경우 recoveryTarget도 활용 가능
        if (recoveryTarget) {
          setError('복구 대상 계정입니다. 복구 절차를 진행해주세요.');
          return;
        }

        // role에 따라 라우팅
        switch (role) {
          case 'ADMIN':
            navigate('/admin/');
            break;
          case 'RIDER':
            navigate('/rider/');
            break;
          case 'HUB':
            navigate('/hub/');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(result.payload || '로그인에 실패했습니다.');
        setPassword('');
        idInputRef.current?.select();
      }
    } catch {
      setError('로그인에 실패했습니다.');
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') handleSignIn();
  };

  return { handleSignIn, handleKeyDown };
}
