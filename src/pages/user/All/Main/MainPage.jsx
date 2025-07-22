import React from 'react';

import { useNavigate } from 'react-router-dom';
import PostListPage from '../../Post/PostList/PostListPage';

function MainPage() {
  return (
    <div>
      <PostListPage/>
    </div>
  );
}

export default MainPage;
