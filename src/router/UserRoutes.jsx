import { Routes, Route } from 'react-router-dom';
import RoleRoute from './RoleRoute';

// header
import UserHeader from '../layout/headers/userHeader/UserHeader';

// public 페이지
import MainPage from '../pages/user/All/Main/MainPage';
// import ProductPage from '../pages/user/All/Product/ProductPage';
// import SearchPage from '../pages/user/All/Search/SearchPage';
// import CategoryPage from '../pages/user/All/Category/CategoryPage';
// import PostListPage from '../pages/user/Post/PostList/PostListPage';
import PostDetailPage from '../pages/user/Post/PostDetail/PostDetailPage';

// private 페이지 (USER 권한 필요)
import NewPostPage from '../pages/user/Post/Posting/NewPostPage';

// import PayPage from '../pages/user/Pay/PayPage';
import UserInfoPage from '../pages/user/UserInfo/UserInfoPage';
import MyPostListPage from '../pages/user/UserOptions/MyPostList/MyPostListPage';
import MyOrderListPage from '../pages/user/UserOptions/MyOrderList/MyOrderListPage';
// import MyOrderDetailPage from '../pages/user/UserOptions/MyOrderDetail/MyOrderDetailPage';
import BookmarkRecipePage from '../pages/user/UserOptions/BookmarkRecipe/BookmarkRecipePage';
import LikePostPage from '../pages/user/UserOptions/LikePost/LikePostPage';
import SuccessPage from '../pages/user/Pay/toss/TossSuccess';
import UserCartPage from '../pages/user/Cart/CartPage/UserCartPage';
import PayPage from '../pages/user/Pay/PayPage';
import PayCompletePage from '../pages/user/Pay/paycomplete/PayCompletePage';
import ProductPage from '../pages/user/All/Product/ProductPage';
import CategoryPage from '../pages/user/All/Category/CategoryPage';
import SearchPage from '../pages/user/All/Search/SearchPage';
import UserInfo from '../pages/user/Info/UserInfo';

function UserRoutes() {
  return (
    <>
      <UserHeader />
      <Routes>
        {/* 비회원도 접근 가능한 페이지 */}
        <Route path="main" element={<MainPage />} />
        <Route path="" element={<MainPage />} />
        <Route path="product" element={<ProductPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="category" element={<CategoryPage />} />

        {/* <Route path="post-list" element={<PostListPage />} /> */}
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
              <UserCartPage />
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
          path="tossSuccess"
          element={
            <RoleRoute role="USER">
              <SuccessPage />
            </RoleRoute>
          }
        />

        <Route
          path="paycomplete"
          element={
            <RoleRoute role="USER">
              <PayCompletePage />
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
        {/* <Route
          path="order/:id"
          element={
            <RoleRoute role="USER">
              <MyOrderDetailPage />
            </RoleRoute>
          }
        /> */}
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
        <Route
          path="userinfo"
          element={
            <RoleRoute role="USER">
              <UserInfo />
            </RoleRoute>
          }
        />

        <Route path="tossSuccess" element={<SuccessPage />} />
      </Routes>
    </>
  );
}

export default UserRoutes;
