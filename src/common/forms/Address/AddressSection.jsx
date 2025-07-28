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

  useEffect(() => {
    if (!roadFull && addrDetail) {
      onAddressChange('addrDetail', '');
    }
  }, [roadFull, addrDetail, onAddressChange]);

  return (
    <div className={styles.addressContainer}>
      <Input label="주소" required>
        <div className={styles.inputButtonGroup}>
          <input
            type="text"
            name="roadFull"
            value={roadFull}
            placeholder="주소검색 버튼을 클릭해주세요"
            readOnly
          />
          <Button
            type="button"
            variant="BASIC"
            onClick={openDaumPostcode}
            className={styles.addrbutton}
          >
            주소검색
          </Button>
        </div>
      </Input>

      <Input
        label="상세주소"
        name="addrDetail"
        type="text"
        value={addrDetail}
        onChange={e => onAddressChange('addrDetail', e.target.value)}
        placeholder={roadFull ? '상세주소를 입력하세요' : '먼저 도로명 주소를 검색해주세요'}
        disabled={!roadFull}
        className={styles.detailInput}
      />
    </div>
  );
}

export default AddressSection;
