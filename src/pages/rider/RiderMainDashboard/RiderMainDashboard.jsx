import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RiderMainDashboard.module.scss';

function RiderMainDashboard() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: '배달 요청 조회',
      description: '새로운 배달 요청을 확인하고 수락할 수 있습니다',
      route: '/rider/request-list',
      iconClass: styles.iconBlue,
      icon: (
        <svg width="24" height="24" aria-hidden="true" fill="currentColor">
          <path d="M12,2h0A11.958,11.958,0,0,0,3.517,5.513l0,0,0,0A11.961,11.961,0,0,0,0,13.989v.021a11.948,11.948,0,0,0,2.742,7.626A1,1,0,0,0,3.514,22H20.485a1,1,0,0,0,.771-.364A12,12,0,0,0,12,2Zm8,18H4A9.936,9.936,0,0,1,2.05,15H5a1,1,0,0,0,0-2H2.05A9.955,9.955,0,0,1,4.257,7.672l.672.671A1,1,0,0,0,6.343,6.929l-.672-.672A9.954,9.954,0,0,1,11,4.05V7a1,1,0,0,0,2,0V4.05a9.948,9.948,0,0,1,5.328,2.207l-.671.672a1,1,0,0,0,1.414,1.414l.671-.672A9.947,9.947,0,0,1,21.95,13H19a1,1,0,0,0,0,2h2.95A9.932,9.932,0,0,1,20,20Z" />
          <polygon points="14.999 10.343 9.343 13.172 12.171 16 14.999 10.343" />
        </svg>
      ),
    },
    {
      title: '수락한 요청 조회',
      description: '수락한 배달 요청의 상태와 진행사항을 확인할 수 있습니다',
      route: '/rider/accepted-list',
      iconClass: styles.iconGreen,
      icon: (
        <svg width="24" height="24" aria-hidden="true" stroke="currentColor">
          <path
            fill="none"
            strokeWidth="2"
            d="M4.99787498,8.99999999 L4.99787498,0.999999992 L19.4999998,0.999999992 L22.9999998,4.50000005 L23,23 L4,23 M18,1 L18,6 L23,6 M3,19 L8,14 L12,18 L18.5,11.5 M19,17.0003099 L19,11 L13,11"
          />
        </svg>
      ),
    },
    {
      title: '배달 기록 조회',
      description: '완료된 배달의 기록과 통계를 확인할 수 있습니다',
      route: '/rider/history',
      iconClass: styles.iconPurple,
      icon: (
        <svg width="24" height="24" aria-hidden="true" fill="currentColor">
          <path d="M20.3,3.65H17.269c-.088-.681-.152-1.186-.152-1.186a1.006,1.006,0,0,0-1-.877H13.007V1A1,1,0,0,0,11,1v.588H7.882a1.006,1.006,0,0,0-1,.877L6.736,3.65H3.7a1,1,0,0,0-1,1V23a1,1,0,0,0,1,1H20.3a1,1,0,0,0,1.005-1V4.649A1,1,0,0,0,20.3,3.65ZM8.769,3.591h6.462L15.559,6.2H8.441ZM19.3,22.006H4.708V5.653H6.486L6.31,7.074a.936.936,0,0,0,1,1.122h9.4a1,1,0,0,0,1-1c0-.035-.084-.711-.191-1.544H19.3V22.006Z" />
        </svg>
      ),
    },
    {
      title: '개인정보 조회',
      description: '개인정보 및 계정 설정을 관리할 수 있습니다',
      route: '/rider/info',
      iconClass: styles.iconOrange,
      icon: (
        <svg width="24" height="24" aria-hidden="true" fill="currentColor">
          <path d="M23.635,10.056,23.23,8.921l-9.2,3.284-.2.527a1.948,1.948,0,0,1-.689.932,1.982,1.982,0,0,1-3.162-1.621,2.318,2.318,0,0,1,.568-1.5l.243-.325V0L9.324.327A11.759,11.759,0,0,0,2.8,4.34,11.989,11.989,0,1,0,24,12A7.175,7.175,0,0,0,23.635,10.056Zm-4.905,8.8a9.478,9.478,0,0,1-6.771,2.8A9.553,9.553,0,0,1,4.622,5.962a9.774,9.774,0,0,1,3.77-2.757V9.489a4.664,4.664,0,0,0-.811,2.594,4.353,4.353,0,0,0,1.3,3.122A4.462,4.462,0,0,0,12,16.5a4.33,4.33,0,0,0,2.6-.851,4.159,4.159,0,0,0,1.3-1.5l5.676-2.027A9.664,9.964,0,0,1,18.73,18.854Z" />
          <path d="M14.23,9.57l7.905-2.8a.427.427,0,0,0,.2-.69l-.081-.162A12.036,12.036,0,0,0,13.865.246a.64.64,0,0,0-.724.544.605.605,0,0,0-.006.1V8.84a.769.769,0,0,0,1.1.73Z" />
        </svg>
      ),
    },
  ];

  const handleMenuClick = route => {
    console.log('Navigating to:', route); // 디버깅용 로그
    navigate(route);
  };

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.header}>
        <div className={styles.logoBox}>
          <img src="./soboklogo.png" width="300" height="300" aria-label="SOBOK 로고" />
        </div>
        <h1>SOBOK 라이더 대시보드</h1>
        <p>원하는 메뉴를 선택하여 배달 업무를 시작하세요. 모든 기능을 한눈에 확인할 수 있습니다.</p>
      </div>

      <div className={styles.grid}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() => handleMenuClick(item.route)}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleMenuClick(item.route);
              }
            }}
            role="button"
            aria-label={`${item.title} 메뉴로 이동`}
          >
            <div className={`${styles.iconBox} ${item.iconClass}`}>{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button
              className={styles.startBtn}
              onClick={e => {
                e.stopPropagation();
                handleMenuClick(item.route);
              }}
            >
              시작하기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RiderMainDashboard;
