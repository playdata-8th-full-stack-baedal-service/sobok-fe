import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './OrderItem.module.scss';
import Button from '../../../../../common/components/Button';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../../services/axios-config';

const OrderItem = ({ item }) => {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(null);

  useEffect(() => {
    const checkRegistered = async () => {
      try {
        const res = await axiosInstance.get(`/post-service/post/check-registered`, {
          params: {
            paymentId: item.paymentId,
            cookId: item.cookId,
          },
        });
        setIsRegistered(res.data?.data?.registered);
      } catch (err) {
        console.error('등록 여부 확인 실패:', err);
        setIsRegistered(true); // 실패하면 안전하게 버튼 숨김 처리
      }
    };
    checkRegistered();
  }, [item.paymentId, item.cookId]);

  const handleWritePost = () => {
    navigate('/user/new-post', {
      state: {
        paymentId: item.paymentId,
        cookName: item.cookName,
        cookId: item.cookId,
      },
    });
  };

  return (
    <div className={styles.orderItem}>
      <img src={item.thumbnail} alt={item.cookName} />
      <div className={styles.infoArea}>
        <span>{item.cookName}</span>
      </div>
      <div className={styles.buttonWrapper}>
        {isRegistered === false && item.orderState === 'DELIVERY_COMPLETE' && (
          <Button type="button" variant="BASIC" className="flexible" onClick={handleWritePost}>
            나의 요리 공유하기
          </Button>
        )}
      </div>
    </div>
  );
};

OrderItem.propTypes = {
  item: PropTypes.shape({
    cookName: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    paymentId: PropTypes.number.isRequired,
    cookId: PropTypes.number.isRequired,
  }).isRequired,
};

export default OrderItem;
