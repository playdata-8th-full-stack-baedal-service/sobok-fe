import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import axiosInstance from '../../../../services/axios-config';
import styles from './TossSuccess.module.scss';

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
    // 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
    const requestData = {
      orderId: searchParams.get('orderId'),
      amount: searchParams.get('amount'),
      paymentKey: searchParams.get('paymentKey'),
    };

    async function confirm() {
      const response = await axiosInstance.post('/api-service/api/confirm', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response);
      if (!response.data.success) {
        // 결제 실패 비즈니스 로직을 구현하세요.
        alert('결제 실패! 다시 시도해주세요');
      } else {
        // 결제 성공
        navigate(`/`);
      }
    }
    confirm();
  }, [navigate, searchParams]);

  return (
    <div className={styles.loadingWrapper}>
      <div className={styles.loadingBox}>
        <CircularProgress />
        <p className={styles.loadingText}>결제를 처리 중입니다...</p>
      </div>
    </div>
  );
}
