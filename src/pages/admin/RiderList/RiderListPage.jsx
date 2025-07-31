import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../services/axios-config';
import styles from './RiderListPage.module.scss';
import Button from '../../../common/components/Button';

function RiderListPage() {
  const [pendingRiders, setPendingRiders] = useState([]);
  const [allRiders, setAllRiders] = useState([]);
  const [clickedActiveRider, setClickedActiveRider] = useState(false);

  useEffect(() => {
    const fetchRiders = async () => {
      const response = await axiosInstance.get('/delivery-service/delivery/pending-rider');
      console.log(response.data.data);
      setPendingRiders(response.data.data || []);
    };
    fetchRiders();
    setClickedActiveRider(false);
  }, [clickedActiveRider]);

  useEffect(() => {
    const fetchRiders = async () => {
      const response = await axiosInstance.get('/delivery-service/delivery/all');
      setAllRiders(response.data.data);
    };
    fetchRiders();
    setClickedActiveRider(false);
  }, [clickedActiveRider]);

  const handleApprove = async id => {
    try {
      console.log(id);
      await axiosInstance.put(`/auth-service/auth/rider-active?authId=${id}`);
      setClickedActiveRider(true);
    } catch (error) {
      console.error('배달원 활성화 실패:', error);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <h2>배달원 신청 목록</h2>
        {pendingRiders.length === 0 ? (
          <p>신청한 배달원이 없습니다.</p>
        ) : (
          <div className={styles.riderList}>
            {pendingRiders.map((rider, index) => (
              <div key={Math.random()} className={styles.riderRow}>
                <span>{index + 1}</span>
                <span>{rider.name}</span>
                <span>{rider.phone}</span>
                <span>{rider.permissionNumber}</span>
                <span>{rider.loginId}</span>
                <Button type="button" onClick={() => handleApprove(rider.authId)}>
                  활성화
                </Button>
              </div>
            ))}
          </div>
        )}

        <hr />

        <h2>배달원 목록</h2>
        {allRiders.length === 0 ? (
          <p>등록된 배달원이 없습니다.</p>
        ) : (
          <div className={styles.riderList}>
            {allRiders.map((rider, index) => (
              <div key={Math.random()} className={styles.riderRow}>
                <span>{index + 1}</span>
                <span>{rider.name}</span>
                <span>{rider.phone}</span>
                <span>{rider.permissionNumber}</span>
                <span>{rider.loginId}</span>
                <span>{rider.active === 'Y' ? '활성화' : '비활성화'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RiderListPage;
