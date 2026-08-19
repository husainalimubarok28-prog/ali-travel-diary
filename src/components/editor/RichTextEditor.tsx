"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  active,
  label,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-primary-600 text-white"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-700"
      }`}
    >
      {label}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const lastSet = useRef<string>("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: false }),
      Placeholder.configure({ placeholder: placeholder || "Tulis konten artikel di sini..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: value || "",
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      if (html !== lastSet.current) {
        lastSet.current = html;
        onChange(html);
      }
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== lastSet.current) {
      lastSet.current = value;
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  const insertImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        editor.chain().focus().setImage({ src: data.url }).run();
      } catch {
        alert("Upload gambar gagal");
      }
    };
    input.click();
  };

  const setLink = () => {
    const url = window.prompt("Masukkan URL:");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="rounded-xl border border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-dark-700 p-2 bg-slate-50 dark:bg-dark-900/50">
        <ToolbarButton title="Undo" label="↩" onClick={() => editor.chain().focus().undo().run()} />
        <ToolbarButton title="Redo" label="↪" onClick={() => editor.chain().focus().redo().run()} />
        <span className="w-px h-6 bg-slate-200 dark:bg-dark-700 mx-1" />
        <ToolbarButton title="Bold" label="B" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
        <ToolbarButton title="Italic" label="I" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <ToolbarButton title="Underline" label="U" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
        <ToolbarButton title="Strikethrough" label="S" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} />
        <ToolbarButton title="Code" label="<>" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} />
        <span className="w-px h-6 bg-slate-200 dark:bg-dark-700 mx-1" />
        <ToolbarButton title="Heading 1" label="H1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
        <ToolbarButton title="Heading 2" label="H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <ToolbarButton title="Heading 3" label="H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
        <span className="w-px h-6 bg-slate-200 dark:bg-dark-700 mx-1" />
        <ToolbarButton title="Bullet List" label="• List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <ToolbarButton title="Numbered List" label="1. List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <ToolbarButton title="Blockquote" label="❝" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <ToolbarButton title="Code Block" label="{ }" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
        <ToolbarButton title="Horizontal Rule" label="—" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
        <span className="w-px h-6 bg-slate-200 dark:bg-dark-700 mx-1" />
        <ToolbarButton title="Align Left" label="⇤" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} />
        <ToolbarButton title="Align Center" label="≡" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} />
        <ToolbarButton title="Align Right" label="⇥" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} />
        <span className="w-px h-6 bg-slate-200 dark:bg-dark-700 mx-1" />
        <ToolbarButton title="Insert Link" label="🔗" active={editor.isActive("link")} onClick={setLink} />
        <ToolbarButton title="Insert Image" label="🖼️" onClick={insertImage} />
        <ToolbarButton title="Insert Table" label="▦" active={editor.isActive("table")} onClick={addTable} />
        {editor.isActive("table") && (
          <ToolbarButton title="Delete Table" label="🗑" onClick={() => editor.chain().focus().deleteTable().run()} />
        )}
      </div>

      <EditorContent
        editor={editor}
        className="[&_.ProseMirror]:min-h-[320px] [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-4 [&_.ProseMirror]:outline-none [&_.ProseMirror]:prose [&_.ProseMirror]:max-w-none [&_.ProseMirror]:dark:prose-invert [&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_.is-editor-empty:first-child::before]:text-slate-400 [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none"
      />
    </div>
  );
}
