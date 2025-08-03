import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../../../services/axios-config';
import style from './HubListPage.module.scss';

function HubListPage() {
  const [hubList, setHubList] = useState([
    { shopName: '이름', roadFull: '주소', ownerName: '점주', phone: '번호' },
  ]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);

  const fetchShops = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await axiosInstance.get('/shop-service/shop/all');

      if (res.data.success && res.data.data.length > 0) {
        setHubList(prev => [...prev, ...res.data.data]);
        setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onIntersect = ([entry]) => {
    if (entry.isIntersecting && hasMore) {
      fetchShops();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect);
    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore]);

  useEffect(() => {
    fetchShops(); // 첫 렌더링에서도 한 번 호출
  }, []);

  return (
    <div className={style.container}>
      <div className={style.titleandbutton}>
        <h2>가게 목록</h2>
        {hubList.length === 0 ? (
          <p>가게 정보를 불러오는 중 ~</p>
        ) : (
          <div className={style.listWrapper}>
            {hubList.map((hub, index) => (
              <div key={hub.id} className={style.card}>
                <div className={style.indexSection}>{index === 0 ? '' : index}</div>
                <div className={style.nameSection}>{hub.shopName}</div>
                <div className={style.addrSection}>{hub.roadFull}</div>
                <div className={style.ownerSection}>{hub.ownerName}</div>
                <div className={style.phoneSection}>{hub.phone}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {loading && <p>로딩 중...</p>}
      {hasMore && <div ref={observerRef} style={{ height: '1px' }} />}
    </div>
  );
}

export default HubListPage;
