import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '@/services/axios-config';
import useToast from '@/common/hooks/useToast';

export default function FailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess, showNegative, showInfo } = useToast();

  useEffect(() => {
    const orderId = searchParams.get('orderId'); // Toss 결제 실패 URL에 반드시 orderId가 포함되어야 함

    const handleFail = async () => {
      try {
        if (!orderId) {
          showNegative('유효하지 않은 접근입니다.');
          navigate('/user/cart');
          return;
        }

        await axiosInstance.delete(`/payment-service/payment/fail-payment?orderId=${orderId}`);

        showNegative('결제에 실패했습니다. 장바구니로 돌아갑니다.');
        navigate('/user/cart');
      } catch (err) {
        console.error(err);
        showNegative('결제 실패 처리 중 오류가 발생했습니다. 장바구니로 이동합니다.');
        navigate('/user/cart');
      }
    };

    handleFail();
  }, [navigate, searchParams]);

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 실패</h2>
      </div>
    </div>
  );
}
