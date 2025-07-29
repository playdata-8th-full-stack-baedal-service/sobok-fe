import React from 'react';
import styles from './RiderMainDashboard.module.scss';

const RiderMainDashboard = ({ onNavigate }) => {
  const menuItems = [
    {
      title: '배달 요청 조회',
      description: '새로운 배달 요청을 확인하고 수락할 수 있습니다',
      route: '/rider/request-list',
      iconClass: styles.iconBlue,
    },
    {
      title: '수락한 요청 조회',
      description: '수락한 배달 요청의 상태와 진행사항을 확인할 수 있습니다',
      route: '/rider/accepted-list',
      iconClass: styles.iconGreen,
    },
    {
      title: '배달 기록 조회',
      description: '완료된 배달의 기록과 통계를 확인할 수 있습니다',
      route: '/rider/history',
      iconClass: styles.iconPurple,
    },
    {
      title: '개인정보 조회',
      description: '개인정보 및 계정 설정을 관리할 수 있습니다',
      route: '/rider/info',
      iconClass: styles.iconOrange,
    }
  ];

  const handleMenuClick = (route) => {
    if (onNavigate) onNavigate(route);
  };

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.header}>
        <div className={styles.logoBox}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M9,11.969V5c0-1.657,1.343-3,3-3s3,1.343,3,3v1.003"/>
            <path d="M15,12.002v6.998c0,1.657-1.343,3-3,3s-3-1.343-3-3v-1.015"/>
            <path d="M12,15H4.992c-1.652,0-2.992-1.343-2.992-3s1.34-3,2.992-3h1.002"/>
            <path d="M12,9h6.994c1.66,0,3.006,1.343,3.006,3s-1.346,3-3.006,3h-.961"/>
          </svg>
        </div>
        <h1>SOBOK 라이더 대시보드</h1>
        <p>원하는 메뉴를 선택하여 배달 업무를 시작하세요. 모든 기능을 한눈에 확인할 수 있습니다.</p>
      </div>

      <div className={styles.grid}>
        {menuItems.map((item, index) => (
          <div key={index} className={styles.card} onClick={() => handleMenuClick(item.route)}>
            <div className={`${styles.iconBox} ${item.iconClass}`}>
              {/* 아이콘은 여기에 SVG 추가 가능 */}
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button className={styles.startBtn}>시작하기</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiderMainDashboard;
