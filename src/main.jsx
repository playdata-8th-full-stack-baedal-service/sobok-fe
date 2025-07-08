import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import App from './App';
import store from './store/store';
import './common/styles/style.scss';
import { BrowserRouter } from 'react-router-dom';
import UserInfoPage from './pages/user/UserInfo/UserInfoPage';
import HubRegisterPage from './pages/admin/HubRegister/HubRegisterPage';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <App/>
    </Provider>
  </BrowserRouter>
);
