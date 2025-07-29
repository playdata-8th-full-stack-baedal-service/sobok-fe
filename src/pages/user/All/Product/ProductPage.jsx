/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import styles from './ProductPage.module.scss';
import ProductImage from './components/ProductImage';
import ProductInfo from './components/ProductInfo';
import BaseIngredients from './components/BaseIngredients';
import AdditionalIngredients from './components/AdditionalIngredients';
import BestPostView from './components/BestPostView/BestPostView';
import {
  fetchProduct,
  isBookmarked,
  setOriginalPrice,
  setPortion,
  setTotalPrice,
} from '../../../../store/productSlice';
import { fetchCookPostsByLike } from '../../../../store/postSlice';

const ProductPage = () => {
  const dispatch = useDispatch();

  const { product, loading, error, additionalIngredients, portion, totalPrice, originalPrice } =
    useSelector(state => state.product);

  const { bestPosts: posts } = useSelector(state => state.post);
  const [searchParams] = useSearchParams();

  // 1. 처음 로딩 시 product 불러오기 + 기본값 세팅
  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) return;

    dispatch(fetchProduct(id));
    dispatch(setPortion(1));
  }, [dispatch, searchParams]);

  // 2. product가 세팅된 이후 가격 계산
  useEffect(() => {
    if (!product || !product.ingredientList) return;

    const original = product.ingredientList.reduce(
      (acc, ingredient) => acc + ingredient.unitQuantity * ingredient.unit * ingredient.price,
      0
    );
    dispatch(setOriginalPrice(original));

    const total =
      original * portion +
      additionalIngredients.reduce(
        (acc, ingredient) => acc + ingredient.quantity * ingredient.price * portion,
        0
      );
    dispatch(setTotalPrice(total));
  }, [dispatch, product, portion, additionalIngredients]);

  // 3. 북마크 상태 불러오기
  useEffect(() => {
    const fetchBookmark = async () => {
      await dispatch(isBookmarked(searchParams.get('id')));
    };
    fetchBookmark();
  }, [dispatch, searchParams, product]);

  // 4. 레시피 Best 3 불러오기
  useEffect(() => {
    if (product?.cookId) {
      dispatch(fetchCookPostsByLike(product.cookId));
    }
  }, [dispatch, product?.cookId]);

  const handlePostClick = postId => {
    window.location.href = `/post/${postId}`;
  };

  return (
    <div className={styles.productPage}>
      <header className={styles.productHeader}>
        <ProductImage />
        <ProductInfo />
      </header>
      <BaseIngredients />
      <AdditionalIngredients />
      <BestPostView posts={posts} onClick={handlePostClick} />
    </div>
  );
};

export default ProductPage;
