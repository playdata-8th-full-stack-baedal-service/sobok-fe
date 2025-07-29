import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import styles from './TiptapEditor.module.scss';
import commonStyles from './PostContent.module.scss';

const TiptapEditor = forwardRef(({ content, setContent, uploadImageToServer }, ref) => {
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit.configure({ orderedList: false }), Image.configure({ inline: false })],
    content: content || '<p></p>',
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const text = editor.getText().trim();
      const hasImage = editor.getJSON().content?.some(node => node.type === 'image');

      setIsEditorEmpty(!text && !hasImage);
      setContent(text || hasImage ? html : '');
    },

    editorProps: {
      handleDOMEvents: {
        keydown: (view, event) => {
          const isInCodeBlock = editor?.isActive('codeBlock');
          const { $from } = view.state.selection;

          if (isInCodeBlock && event.key === 'Enter') {
            const prevLineText = $from.parent.textContent;
            const prevNodeEmpty = !prevLineText || prevLineText.trim() === '';

            if (prevNodeEmpty) {
              editor.chain().focus().exitCode().run();
              return true;
            }
          }
          return false;
        },
      },
    },
  });

  useImperativeHandle(ref, () => ({
    focus: () => editor?.commands.focus(),
    getEditor: () => editor,
  }));

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '<p></p>');
    }
  }, [editor, content]);

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file || !editor) return;
    const imageUrl = await uploadImageToServer(file);
    editor.chain().focus().setImage({ src: imageUrl }).run();
  };

  if (!editor) return null;

  return (
    <div>
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
            type="button"
            onMouseDown={e => e.preventDefault()}
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

        <button
          type="button"
          className={styles.uploadBtn}
          onClick={() => document.getElementById('imageUploadInput').click()}
        >
          이미지
        </button>
        <input
          id="imageUploadInput"
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>

      <div className={`${styles.editorBox} ${commonStyles.postContent}`}>
        <EditorContent
          editor={editor}
          className={isEditorEmpty ? 'is-editor-empty' : ''}
          data-placeholder="내용을 입력하세요..."
        />
      </div>
    </div>
  );
});

export default TiptapEditor;
