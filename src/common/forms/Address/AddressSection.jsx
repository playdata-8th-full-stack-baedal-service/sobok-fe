import React, { useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from './AddressSection.module.scss';

function AddressSection({ roadFull, addrDetail, onAddressChange }) {
  const openDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete(data) {
        const addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        let extra = '';
        if (data.userSelectedType === 'R') {
          if (data.bname && /[\uAC00-\uD7A3]+[동|로|가]$/g.test(data.bname)) extra += data.bname;
          if (data.buildingName && data.apartment === 'Y')
            extra += extra ? `, ${data.buildingName}` : data.buildingName;
          if (extra) extra = ` (${extra})`;
        }
        onAddressChange('roadFull', addr + extra);
        document.querySelector('input[name="addrDetail"]')?.focus();
      },
    }).open();
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  return (
    <Input label="주소 (선택)" className={styles.addressGroup}>
      <div className={styles.addressSearch}>
        <input type="text" value={roadFull} placeholder="주소검색 버튼을 클릭해주세요" readOnly />
        <Button type="button" variant="BASIC" onClick={openDaumPostcode} className={styles.addrbutton}>
          주소검색
        </Button>
      </div>
      <input
        type="text"
        name="addDetail"
        value={addrDetail}
        onChange={e => onAddressChange('addDetail', e.target.value)}
        placeholder="상세주소를 입력하세요"
        className={styles.detailInput}
      />
    </Input>
  );
}

export default AddressSection;
