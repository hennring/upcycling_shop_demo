import Link from '@tiptap/extension-link';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`rounded-md px-2 py-1 text-sm font-medium transition-colors ${
        active ? 'bg-rust text-white' : 'text-stone-600 hover:bg-stone-200'
      }`}
    >
      {children}
    </button>
  );
}

/** Newsletter content editor - the only rich text input in this project, so Tiptap lives here. */
export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: value,
    // per the Tiptap React setup guide: avoids a first render before the editor is ready
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });

  // keeps the editor in sync when the form loads an existing newsletter after the editor mounts
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Tiptap v3 no longer re-renders on every transaction by default, so toolbar state
  // (bold/italic/... "active") has to be read through useEditorState to stay in sync -
  // reading editor.isActive() directly in the JSX below would show stale state on click.
  const toolbarState = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current?.isActive('bold') ?? false,
      italic: current?.isActive('italic') ?? false,
      heading2: current?.isActive('heading', { level: 2 }) ?? false,
      bulletList: current?.isActive('bulletList') ?? false,
      link: current?.isActive('link') ?? false,
    }),
  });

  if (!editor || !toolbarState) {
    return null;
  }

  const toggleLink = () => {
    const url = window.prompt('Link-URL');
    if (!url) return;
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="rounded-lg border border-stone-300 focus-within:border-rust">
      <div className="flex flex-wrap gap-1 border-b border-stone-200 bg-stone-50 p-2">
        <ToolbarButton
          active={toolbarState.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="Fett"
        >
          <strong>F</strong>
        </ToolbarButton>
        <ToolbarButton
          active={toolbarState.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="Kursiv"
        >
          <em>K</em>
        </ToolbarButton>
        <ToolbarButton
          active={toolbarState.heading2}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          label="Überschrift"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          active={toolbarState.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="Aufzählung"
        >
          •
        </ToolbarButton>
        <ToolbarButton active={toolbarState.link} onClick={toggleLink} label="Link">
          Link
        </ToolbarButton>
      </div>
      <EditorContent
        editor={editor}
        className="px-3 py-2 text-sm text-stone-900 [&_.ProseMirror]:min-h-[12rem] [&_.ProseMirror]:outline-none [&_h2]:text-lg [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-rust [&_a]:underline"
      />
    </div>
  );
}
