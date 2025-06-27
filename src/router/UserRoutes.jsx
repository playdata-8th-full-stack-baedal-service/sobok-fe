import { Routes, Route } from 'react-router-dom';
import UserHeader from '../common/headerfooter/UserHeader';
import RoleRoute from './RoleRoute';

// public 페이지
import MainPage from '../app/user/MainPage';
import ProductPage from '../app/user/ProductPage';
import SearchPage from '../app/user/SearchPage';
import CategoryPage from '../app/user/CategoryPage';
import PostListPage from '../app/user/PostListPage';
import PostDetailPage from '../app/user/PostDetailPage';

// private 페이지 (USER 권한 필요)
import NewPostPage from '../app/user/private/NewPostPage';
import CartPage from '../app/user/private/CartPage';
import CartModal from '../app/user/private/CartModal';
import PayPage from '../app/user/private/PayPage';
import UserInfoPage from '../app/user/private/UserInfoPage';
import MyPostListPage from '../app/user/private/MyPostListPage';
import MyOrderListPage from '../app/user/private/MyOrderListPage';
import MyOrderDetailPage from '../app/user/private/MyOrderDetailPage';
import BookmarkRecipePage from '../app/user/private/BookmarkRecipePage';
import LikePostPage from '../app/user/private/LikePostPage';

function UserRoutes() {
  return (
    <>
      <UserHeader />
      <Routes>
        {/* 비회원도 접근 가능한 페이지 */}
        <Route path="main" element={<MainPage />} />
        <Route path="product" element={<ProductPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="category" element={<CategoryPage />} />
        <Route path="post-list" element={<PostListPage />} />
        <Route path="post/:id" element={<PostDetailPage />} />

        {/* USER 권한 있어야 접근 가능한 페이지 */}
        <Route
          path="new-post"
          element={
            <RoleRoute role="USER">
              <NewPostPage />
            </RoleRoute>
          }
        />
        <Route
          path="cart"
          element={
            <RoleRoute role="USER">
              <CartPage />
            </RoleRoute>
          }
        />
        <Route
          path="cart-modal"
          element={
            <RoleRoute role="USER">
              <CartModal />
            </RoleRoute>
          }
        />
        <Route
          path="pay"
          element={
            <RoleRoute role="USER">
              <PayPage />
            </RoleRoute>
          }
        />
        <Route
          path="info"
          element={
            <RoleRoute role="USER">
              <UserInfoPage />
            </RoleRoute>
          }
        />
        <Route
          path="my-posts"
          element={
            <RoleRoute role="USER">
              <MyPostListPage />
            </RoleRoute>
          }
        />
        <Route
          path="orders"
          element={
            <RoleRoute role="USER">
              <MyOrderListPage />
            </RoleRoute>
          }
        />
        <Route
          path="order/:id"
          element={
            <RoleRoute role="USER">
              <MyOrderDetailPage />
            </RoleRoute>
          }
        />
        <Route
          path="bookmarks"
          element={
            <RoleRoute role="USER">
              <BookmarkRecipePage />
            </RoleRoute>
          }
        />
        <Route
          path="likes"
          element={
            <RoleRoute role="USER">
              <LikePostPage />
            </RoleRoute>
          }
        />
      </Routes>
    </>
  );
}

export default UserRoutes;
