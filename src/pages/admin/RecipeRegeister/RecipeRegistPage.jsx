import React, { useState } from 'react';
import style from './RecipeRegistPage.module.scss';
import axiosInstance from '../../../services/axios-config';
import ImageandOverview from './units/ImageandOverview';
import IngredientsSelection from './units/IngredientsSelection';
import RecipeSelection from './units/RecipeSelection';

function RecipeRegistPage() {
  const [formData, setFormData] = useState({
    name: '',
    allergy: '',
    recipe: '',
    category: '',
    thumbnailUrl: '',
    ingredients: [],
  });

  const handleChangeInput = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.allergy ||
      !formData.ingredients ||
      !formData.category ||
      !formData.recipe ||
      !formData.thumbnailUrl
    ) {
      console.log('필수 항목을 입력하지 않음');
      return;
    }

    try {
      const response = await axiosInstance.post('/cook-service/cook/cook-register', formData);
      console.log(response.data);
      if (response.data.success) {
        return response.data;
      }
      return response.data.message;
    } catch (error) {
      alert('레시피 등록 실패!');
      console.log(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ImageandOverview/>
      <IngredientsSelection/>
      <RecipeSelection/>
      <div>
        <button>취소</button>
        <button type='submit'>업로드</button>
      </div>
    </form>
  );
}

export default RecipeRegistPage;
