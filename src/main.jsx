import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import App from './App';
import store from './store/store';
import './common/style/style.scss';
import UserSignUp from './app/user/UserSignUp';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <UserSignUp />
  </Provider>
);
