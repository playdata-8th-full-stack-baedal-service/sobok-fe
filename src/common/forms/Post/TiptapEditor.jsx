import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import styles from './TiptapEditor.module.scss';

const TiptapEditor = ({ content, setContent, uploadImageToServer }) => {
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: false })],
    content: content || '<p></p>',
    onUpdate({ editor }) {
      setContent(editor.getHTML());
      setIsEditorEmpty(editor.getText().trim().length === 0);
    },
  });

  useEffect(() => {
    if (editor && content) editor.commands.setContent(content);
  }, [editor, content]);

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file || !editor) return;
    const imageUrl = await uploadImageToServer(file);
    editor.chain().focus().setImage({ src: imageUrl }).run();
  };

  if (!editor) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        {[
          { cmd: 'toggleBold', label: '굵게', mark: 'bold' },
          { cmd: 'toggleItalic', label: '기울임', mark: 'italic' },
          { cmd: 'toggleStrike', label: '취소선', mark: 'strike' },
          { cmd: () => ['toggleHeading', { level: 2 }], label: '제목', mark: 'heading' },
          { cmd: 'toggleBulletList', label: '리스트', mark: 'bulletList' },
          { cmd: 'toggleCodeBlock', label: '코드', mark: 'codeBlock' },
        ].map(btn => (
          <button
            key={btn.label}
            onClick={() => {
              const chain = editor.chain();
              const cmdChain =
                typeof btn.cmd === 'function'
                  ? chain[btn.cmd()[0]](btn.cmd()[1])
                  : chain[btn.cmd]();
              cmdChain.run();
            }}
            className={editor.isActive(btn.mark, btn.cmdArgs) ? styles.active : ''}
          >
            {btn.label}
          </button>
        ))}

        <label className={styles.uploadBtn}>
          이미지
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
        </label>
      </div>

      <div className={styles.editorBox} onClick={() => editor.chain().focus().run()}>
        <EditorContent
          editor={editor}
          className={`${styles.editor} ${isEditorEmpty ? 'is-editor-empty' : ''}`}
          data-placeholder="내용을 입력하세요..."
        />
      </div>
    </div>
  );
};

export default TiptapEditor;
