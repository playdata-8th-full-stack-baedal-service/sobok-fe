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
        const { accessToken, role } = result.payload;
        setToken(accessToken);  // token

        switch (role) {
          case 'ADMIN': navigate('/admin/'); break;
          case 'RIDER': navigate('/rider/'); break;
          case 'HUB': navigate('/hub/'); break;
          default: navigate('/');
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
