/**
 * 오늘 날짜 기반의 고유 주문 ID를 생성합니다.
 * @returns {string} yyyymmddx{숫자}{랜덤문자6개} 형태의 문자열
 * @example generateRandomString() // "20250709x5aB3cD"
 */
const generateRandomString = () => {
  // 오늘 날짜를 yyyymmdd 형태로 생성
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateString = `${year}${month}${day}`;

  // 랜덤 숫자 1개 (0-9)
  const randomNumber = Math.floor(Math.random() * 10);

  // 6자리 랜덤 문자열
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomChars = '';
  for (let i = 0; i < 6; i += 1) {
    randomChars += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${dateString}x${randomNumber}${randomChars}`;
};

export default generateRandomString;
