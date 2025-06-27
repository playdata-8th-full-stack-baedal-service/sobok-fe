import { Routes, Route } from 'react-router-dom';
// public 페이지
import MainPage from '../app/user/MainPage';
import ProductPage from '../app/user/ProductPage';
import SearchPage from '../app/user/SearchPage';
import CategoryPage from '../app/user/CategoryPage';
import PostListPage from '../app/user/PostListPage';
import PostDetailPage from '../app/user/PostDetailPage';
// private 페이지 (로그인 필요)
import NewPostPage from '../app/user/private/NewPostPage';
import CartPage from '../app/user/CartPage';
import CartModal from '../app/user/private/CartModal';
import PayPage from '../app/user/private/PayPage';
import UserInfoPage from '../app/user/private/UserInfoPage';
import MyPostListPage from '../app/user/private/MyPostListPage';
import MyOrderListPage from '../app/user/private/MyOrderListPage';
import MyOrderDetailPage from '../app/user/private/MyOrderDetailPage';
import BookmarkRecipePage from '../app/user/private/BookmarkRecipePage';
import LikePostPage from '../app/user/private/LikePostPage';

import PrivateRoute from '../router/PrivateRoute';

function UserRoutes() {
  return (
    <Routes>
      {/* 비회원도 접근 가능한 페이지 */}
      <Route path="main" element={<MainPage />} />
      <Route path="product" element={<ProductPage />} />
      <Route path="search" element={<SearchPage />} />
      <Route path="category" element={<CategoryPage />} />
      <Route path="post-list" element={<PostListPage />} />
      <Route path="post/:id" element={<PostDetailPage />} />

      {/* 로그인해야 접근 가능한 페이지 */}
      <Route
        path="new-post"
        element={
          <PrivateRoute>
            <NewPostPage />
          </PrivateRoute>
        }
      />
      <Route
        path="cart"
        element={
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        }
      />
      <Route
        path="cart-modal"
        element={
          <PrivateRoute>
            <CartModal />
          </PrivateRoute>
        }
      />
      <Route
        path="pay"
        element={
          <PrivateRoute>
            <PayPage />
          </PrivateRoute>
        }
      />
      <Route
        path="info"
        element={
          <PrivateRoute>
            <UserInfoPage />
          </PrivateRoute>
        }
      />
      <Route
        path="my-posts"
        element={
          <PrivateRoute>
            <MyPostListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="orders"
        element={
          <PrivateRoute>
            <MyOrderListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="order/:id"
        element={
          <PrivateRoute>
            <MyOrderDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="bookmarks"
        element={
          <PrivateRoute>
            <BookmarkRecipePage />
          </PrivateRoute>
        }
      />
      <Route
        path="likes"
        element={
          <PrivateRoute>
            <LikePostPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default UserRoutes;
