import { toast } from 'react-toastify';

const useToast = () => {

  // 성공시
  const showSuccess = (message) => {
    toast.dismiss(); // 이전 토스트 제거
    toast.success(message, {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: true,
    });
  };

  // 에러메세지
  const showNegative = (message) => {
    toast.dismiss(); // 이전 토스트 제거
    toast.error(message, {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: true,
    });
  };

  // 정보성
  const showInfo = (message) => {
    toast.dismiss(); // 이전 토스트 제거
    toast.info(message, {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: true,
    });
  };

  return { showSuccess, showNegative, showInfo };
};

export default useToast;
