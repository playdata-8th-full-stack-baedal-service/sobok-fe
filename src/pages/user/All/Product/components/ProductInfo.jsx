/* eslint-disable react/function-component-definition */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../../common/components/Button';
import styles from '../ProductPage.module.scss';
import { addBookmark, deleteBookmark, registerCart } from '../../../../../store/productSlice';
import { startPayment } from '../../../../../store/cartSlice';
import { openModal } from '../../../../../store/modalSlice';
import { arrayOf } from 'prop-types';
import useToast from '@/common/hooks/useToast';

const { showSuccess, showNegative, showInfo } = useToast();

const categoryList = [
  {
    en: 'KOREAN',
    name: '한식',
  },
  {
    en: 'CHINESE',
    name: '중식',
  },
  {
    en: 'JAPANESE',
    name: '일식',
  },
  {
    en: 'WESTERN',
    name: '양식',
  },
  {
    en: 'SNACK',
    name: '간식',
  },
  {
    en: 'LATE_NIGHT',
    name: '야식',
  },
];

const ProductInfo = () => {
  const {
    product,
    totalPrice,
    originalPrice,
    portion,
    additionalIngredients,
    bookmarkError,
    isBookmarked,
  } = useSelector(state => state.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCartClick = async () => {
    await dispatch(
      registerCart({
        cookId: product.cookId,
        count: portion,
        additionalIngredients: additionalIngredients.map(ingredient => ({
          ingreId: ingredient.id,
          unitQuantity: ingredient.quantity / ingredient.unit,
        })),
      })
    );

    if (window.confirm('선택하신 상품이 장바구니에 담겼습니다. \n장바구니로 이동할까요?')) {
      navigate('/user/cart');
    }
  };

  const handlePayClick = async () => {
    const response = await dispatch(
      registerCart({
        cookId: product.cookId,
        count: portion,
        additionalIngredients: additionalIngredients.map(ingredient => ({
          ingreId: ingredient.id,
          unitQuantity: ingredient.quantity / ingredient.unit,
        })),
      })
    );

    const cartCookId = response.payload;
    await dispatch(
      startPayment({
        selectedItems: [cartCookId],
        totalPrice,
      })
    );

    navigate('/user/pay');
  };

  const handleRecipeClick = () => {
    dispatch(
      openModal({
        type: 'RECIPE',
        props: {
          recipe: product.recipe,
        },
      })
    );
  };

  const handleBookmarkClick = () => {
    if (isBookmarked) {
      dispatch(deleteBookmark(product.cookId));
      showSuccess('즐겨찾기가 해제되었습니다.');
    } else {
      dispatch(addBookmark(product.cookId));
      showSuccess('즐겨찾기에 추가되었습니다.');
    }
  };

  return (
    <div className={styles.productInfo}>
      <div className={styles.productTop}>
        <h2 className={styles.productName}>{product?.cookName}</h2>
        <div className={styles.productPriceContainer}>
          <p className={styles.productBasePrice}>
            기본 가격 : <span>{originalPrice?.toLocaleString()} 원</span>
          </p>
          <Button
            className={styles.productFavorite}
            style={bookmarkError !== null ? { display: 'none' } : {}}
            onClick={handleBookmarkClick}
          >
            {isBookmarked ? (
              <StarIcon
                className={styles.productFavoriteIcon}
                fill="green"
                style={{ color: 'green' }}
              />
            ) : (
              <StarIcon className={styles.productFavoriteIcon} />
            )}
          </Button>
        </div>
      </div>
      <div className={styles.productCategory}>
        {categoryList.find(category => category.en === product?.category)?.name}
      </div>
      <p className={styles.productWarning}>
        알레르기 유발 물질 안내
        <br />
        <small>{product?.allergy}</small>
        <br />
      </p>
      <div className={styles.productActions}>
        <Button className={styles.recipeButton} onClick={handleRecipeClick}>
          레시피 보기
        </Button>
        <p className={styles.totalPrice}>
          <span>{totalPrice?.toLocaleString()} 원</span>
        </p>
        <Button className={styles.payButton} onClick={handlePayClick}>
          결제 하기
        </Button>
        <Button className={styles.cartButton} onClick={handleCartClick}>
          장바구니 담기
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
