import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../common/components/Button';
import styles from './MainPage.module.scss';

function MainPage() {
  const navigate = useNavigate();

  const allOrder = () => {
    navigate('/admin/all-order');
  };

  const hubRegister = () => {
    navigate('/admin/hub-register');
  };

  const ingrediant = () => {
    navigate('/admin/ingredient');
  };

  const riderList = () => {
    navigate('/admin/rider-list');
  };

  const hubList = () => {
    navigate('/admin/hub-list');
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.header}>관리자 페이지 입니다.</div>
        <div className={styles.buttonGroup}>
          <div className={styles.firstLine}>
            <Button
              text="모든 주문 조회"
              type="button"
              variant="MAINPAGE"
              className="adminMain"
              onClick={allOrder}
            />
            <Button
              text="요리 등록"
              type="button"
              variant="MAINPAGE"
              className="adminMain"
              onClick={ingrediant}
            />
            <Button
              text="가게 등록"
              type="button"
              variant="MAINPAGE"
              className="adminMain"
              onClick={hubRegister}
            />
          </div>
          <div className={styles.secondLine}>
            <Button
              text="배달원 관리"
              type="button"
              variant="MAINPAGE"
              className="adminMain"
              onClick={riderList}
            />
            <Button
              text="가게 정보 조회"
              type="button"
              variant="MAINPAGE"
              className="adminMain"
              onClick={hubList}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
