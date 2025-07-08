import React, { useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';

function AddressSection({ roadFull, addrDetail, onAddressChange }) {
  const openDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete(data) {
        const addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        let extra = '';
        if (data.userSelectedType === 'R') {
          if (data.bname && /[동|로|가]$/g.test(data.bname)) extra += data.bname;
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
    <Input label="주소 (선택)" className="address-group">
      <div className="address-search">
        <input type="text" value={roadFull} placeholder="주소검색 버튼을 클릭해주세요" readOnly />
        <Button type="button" variant="BASIC" onClick={openDaumPostcode}>
          주소검색
        </Button>
      </div>
      <input
        type="text"
        name="addrDetail"
        value={addrDetail}
        onChange={e => onAddressChange('addrDetail', e.target.value)}
        placeholder="상세주소를 입력하세요"
      />
    </Input>
  );
}

export default AddressSection;
