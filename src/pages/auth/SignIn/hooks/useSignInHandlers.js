import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../../store/authSlice';
import { openModal } from '../../../../store/modalSlice';
import useToast from '@/common/hooks/useToast';

export default function useSignInHandlers({ id, password, setError, setPassword, idInputRef }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  const handleSignIn = async () => {
    setError('');
    try {
      const result = await dispatch(loginUser({ id, password }));

      if (loginUser.fulfilled.match(result)) {
        const { accessToken, role, userId, recoveryTarget } = result.payload;

        // recoveryTarget이 있으면 복구 모달 띄우기 (비밀번호도 props로 전달)
        if (recoveryTarget) {
          dispatch(openModal({ 
            type: 'USER_RESTORE', 
            props: { id: Number(userId), password } 
          }));
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
        showSuccess('로그인 되었습니다.');
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
