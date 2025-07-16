/* eslint-disable import/prefer-default-export */
export const isPasswordValid = password => {
  return (
    password.length >= 8 &&
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
  );
};
