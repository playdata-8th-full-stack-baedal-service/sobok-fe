const clientHostName = window.location.hostname;

let backEndHostName;

if (clientHostName === 'localhost') {
  backEndHostName = 'http://localhost:8000/';
} else if (clientHostName === 'sobok.shop') {
  backEndHostName = 'http://localhost:8000/';
}

export const API_BASE_URL = backEndHostName;
export const AUTH = '/auth-service/auth';
