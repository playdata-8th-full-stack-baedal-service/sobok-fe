import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import styles from './TiptapEditor.module.scss';

const TiptapEditor = ({ content, setContent }) => {
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '<p></p>',
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const text = editor.getText().trim();
      setIsEditorEmpty(!text);
      setContent(text ? html : '');
    },
    editorProps: {
      handleDOMEvents: {
        compositionend: () => false,
        beforeinput: () => false,
        keydown: (view, event) => {
          const { state } = view;
          const { selection } = state;
          const isInCodeBlock = editor?.isActive('codeBlock');
          const { $from } = selection;

          if (isInCodeBlock && event.key === 'Enter') {
            const prevLineText = $from.parent.textContent;
            const prevNodeEmpty = !prevLineText || prevLineText.trim() === '';

            const grandParent = $from.node(-1);
            const isLastLine = $from.pos === grandParent.content.size + grandParent.content.size;

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

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '<p></p>');
    }
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className={styles.wrapper} onClick={() => editor?.commands?.focus()}>
      {/* 툴바 */}
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
      </div>

      <div className={styles.editorBox}>
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
