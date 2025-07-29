import React, { useRef } from 'react';
import style from '../RecipeRegistPage.module.scss';
import TiptapEditor from '@/common/forms/Post/TiptapEditor';

function RecipeSelection({ formData, setFormData, uploadImageToServer }) {
  const editorRef = useRef(null);

  const handleContentChange = html => {
    setFormData(prev => ({
      ...prev,
      recipe: html,
    }));
  };

  const handleWrapperClick = () => {
    if (editorRef.current?.focus) {
      editorRef.current.focus();
    }
  };

  return (
    <div className={style.RecipeSelection}>
      <h2 className={style.Recipetitle}>레시피 등록</h2>
      <div className={style.editorWrapper} onClick={handleWrapperClick}>
        <TiptapEditor
          ref={editorRef}
          content={formData.recipe}
          setContent={handleContentChange}
          uploadImageToServer={uploadImageToServer}
        />
      </div>
    </div>
  );
}

export default RecipeSelection;
