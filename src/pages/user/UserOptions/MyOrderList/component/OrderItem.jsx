import React from 'react';
import PropTypes from 'prop-types';
import styles from './OrderItem.module.scss';
import Button from '../../../../../common/components/Button';
import { useNavigate } from 'react-router-dom';

const OrderItem = ({ item }) => {
  const navigate = useNavigate();

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
        <Button type="button" variant="BASIC" className="flexible" onClick={handleWritePost}>
          나의 요리 공유하기
        </Button>
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
