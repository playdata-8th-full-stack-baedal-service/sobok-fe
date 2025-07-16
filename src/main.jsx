import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import App from './App';
import store from './store/store';
import './common/styles/style.scss';
import { BrowserRouter } from 'react-router-dom';
import RiderInfoPage from './pages/rider/RiderInfo/RiderInfoPage';
import HubInfoPage from './pages/hub/HubInfo/HubInfoPage';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
