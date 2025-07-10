import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../common/components/Button';
import styles from './MainPage.module.scss';

function MainPage() {
  const navigate = useNavigate();

  const RequestListPage = () => {
    navigate('/rider/request-list');
  };

  const AcceptedListPage = () => {
    navigate('/rider/accepted-list');
  };

  const DelivaryHistoryPage = () => {
    navigate('/rider/history');
  };

  const RiderInfoPage = () => {
    navigate('/rider/info');
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.buttonGroup}>
          <Button
            text="배달 요청 조회"
            type="button"
            variant="MAINPAGE"
            className="riderMain"
            onClick={RequestListPage}
          />
          <Button
            text="수락한 요청 조회"
            type="button"
            variant="MAINPAGE"
            className="riderMain"
            onClick={AcceptedListPage}
          />
          <Button
            text="배달 기록 조회"
            type="button"
            variant="MAINPAGE"
            className="riderMain"
            onClick={DelivaryHistoryPage}
          />
          <Button
            text="개인 정보 조회"
            type="button"
            variant="MAINPAGE"
            className="riderMain"
            onClick={RiderInfoPage}
          />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
