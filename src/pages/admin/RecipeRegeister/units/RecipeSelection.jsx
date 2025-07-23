import React from 'react';
import style from '../RecipeRegistPage.module.scss';
import TiptapEditor from '@/common/forms/Post/TiptapEditor';

function RecipeSelection({ formData, setFormData, uploadImageToServer }) {
  const handleContentChange = html => {
    setFormData(prev => ({
      ...prev,
      recipe: html,
    }));
  };

  return (
    <div className={style.RecipeSelection}>
      <h2 className={style.Recipetitle}>레시피 등록</h2>
      <TiptapEditor
        content={formData.recipe}
        setContent={handleContentChange}
        uploadImageToServer={uploadImageToServer}
      />
    </div>
  );
}

export default RecipeSelection;
