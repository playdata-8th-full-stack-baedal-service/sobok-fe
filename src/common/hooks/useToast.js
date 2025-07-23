import { toast } from 'react-toastify';

const useToast = () => {

  // 성공시
  const showSuccess = (message) => {
    toast.success(message, {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: false,
    });
  };

  // 에러메세지
  const showError = (message) => {
    toast.error(message, {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: false,
    });
  };

  // 정보성
  const showInfo = (message) => {
    toast.info(message, {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: false,
    });
  };

  return { showSuccess, showError, showInfo };
};

export default useToast;
