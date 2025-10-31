"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  ImagePlus,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Code,
  Undo,
  Redo,
  Link2,
  Unlink,
} from "lucide-react";

/**
 * Extended Image extension to support captions and alignment attributes.
 */
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: null },
      height: { default: null },
      style: { default: null },
      "data-align": { default: "center" },
      "data-caption": { default: null },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const align = HTMLAttributes["data-align"] || "center";
    const caption = HTMLAttributes["data-caption"];
    const alignmentStyles = {
      left: "float: left; margin: 0 1rem 1rem 0; max-width: 50%;",
      right: "float: right; margin: 0 0 1rem 1rem; max-width: 50%;",
      center: "display: block; margin: 1rem auto; max-width: 100%;",
    };

    const style = `${alignmentStyles[align]} ${
      HTMLAttributes.width ? `width: ${HTMLAttributes.width}px;` : ""
    } border-radius: 0.5rem;`;

    return [
      "figure",
      {
        class: "image-wrapper",
        style: align === "center" ? "text-align: center; clear: both;" : "",
      },
      [
        "img",
        {
          ...HTMLAttributes,
          style,
          "data-align": align,
          "data-caption": caption,
        },
      ],
      caption
        ? [
            "figcaption",
            {
              style:
                "text-align: center; font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem; font-style: italic;",
            },
            caption,
          ]
        : null,
    ].filter(Boolean);
  },
});

export default function Editor({ content = "", onChange = () => {} }) {
  const fileInputRef = useRef(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageConfig, setImageConfig] = useState({
    url: "",
    caption: "",
    align: "center",
    width: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
          target: "_blank",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      // propagate HTML content to parent
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[400px] p-6",
      },
      handleDrop: (view, event, slice, moved) => {
        try {
          if (
            !moved &&
            event.dataTransfer &&
            event.dataTransfer.files &&
            event.dataTransfer.files[0]
          ) {
            const file = event.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
              event.preventDefault();
              // upload and insert image at drop position
              uploadImage(file, view, event);
              return true;
            }
          }
        } catch (err) {
          console.error("drop error", err);
        }
        return false;
      },
    },
  });

  useEffect(() => {
    // keep external content in sync
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor)
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          Loading editor...
        </div>
      </div>
    );

  // Upload image function -> Cloudinary (client side)
  const uploadImage = async (file, view = null, event = null) => {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        // if dropped - insert at drop coordinates
        if (view && event) {
          const coords = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          const pos = coords?.pos ?? editor.state.selection.to;
          editor
            .chain()
            .focus()
            .insertContentAt(pos, {
              type: "image",
              attrs: { src: data.secure_url, "data-align": "center" },
            })
            .run();
        } else {
          // show modal to configure caption/align/width
          setImageConfig((prev) => ({ ...prev, url: data.secure_url }));
          setShowImageModal(true);
        }
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadImage(file);
    // reset input so same file can be reselected
    e.target.value = "";
  };

  const insertImageWithConfig = () => {
    const attrs = {
      src: imageConfig.url,
      "data-align": imageConfig.align || "center",
      "data-caption": imageConfig.caption || null,
    };

    if (imageConfig.width) {
      // only set numeric width
      const w = parseInt(imageConfig.width, 10);
      if (!Number.isNaN(w)) attrs.width = w;
    }

    editor.chain().focus().setImage(attrs).run();
    setShowImageModal(false);
    setImageConfig({ url: "", caption: "", align: "center", width: "" });
  };

  // Link helpers
  const addLink = () => {
    const selection = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(selection.from, selection.to, " ");
    const url = prompt("Enter link URL (include https://):");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <>
      <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              icon={<Undo size={18} />}
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              label="Undo"
            />
            <ToolbarButton
              icon={<Redo size={18} />}
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              label="Redo"
            />
          </div>

          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              icon={<Heading2 size={18} />}
              active={editor.isActive("heading", { level: 2 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              label="Heading 2"
            />
            <ToolbarButton
              icon={<Heading3 size={18} />}
              active={editor.isActive("heading", { level: 3 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              label="Heading 3"
            />
          </div>

          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              icon={<Bold size={18} />}
              active={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
              label="Bold (Ctrl+B)"
            />
            <ToolbarButton
              icon={<Italic size={18} />}
              active={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              label="Italic (Ctrl+I)"
            />
            <ToolbarButton
              icon={<Code size={18} />}
              active={editor.isActive("code")}
              onClick={() => editor.chain().focus().toggleCode().run()}
              label="Inline Code"
            />
          </div>

          {/* Link Buttons */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              icon={<Link2 size={18} />}
              onClick={addLink}
              active={editor.isActive("link")}
              label="Add/Edit Link"
            />
            <ToolbarButton
              icon={<Unlink size={18} />}
              onClick={removeLink}
              disabled={!editor.isActive("link")}
              label="Remove Link"
            />
          </div>

          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              icon={<List size={18} />}
              active={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              label="Bullet List"
            />
            <ToolbarButton
              icon={<ListOrdered size={18} />}
              active={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              label="Numbered List"
            />
            <ToolbarButton
              icon={<Quote size={18} />}
              active={editor.isActive("blockquote")}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              label="Quote"
            />
          </div>

          <ToolbarButton
            icon={
              uploadingImage ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <ImagePlus size={18} />
              )
            }
            onClick={() => fileInputRef.current.click()}
            label="Insert Image"
            variant="primary"
            disabled={uploadingImage}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Editor Area */}
        <EditorContent
          editor={editor}
          className="bg-white [&_.ProseMirror]:min-h-[400px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-6"
        />
      </div>

      {/* Image Config Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Insert Image</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={imageConfig.url}
                  onChange={(e) =>
                    setImageConfig((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption (optional)
                </label>
                <input
                  type="text"
                  value={imageConfig.caption}
                  onChange={(e) =>
                    setImageConfig((prev) => ({ ...prev, caption: e.target.value }))
                  }
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (px) (optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={imageConfig.width}
                  onChange={(e) =>
                    setImageConfig((prev) => ({ ...prev, width: e.target.value }))
                  }
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alignment
                </label>
                <div className="flex items-center gap-3">
                  {["left", "center", "right"].map((a) => (
                    <label key={a} className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="img-align"
                        checked={imageConfig.align === a}
                        onChange={() =>
                          setImageConfig((prev) => ({ ...prev, align: a }))
                        }
                        className="form-radio"
                      />
                      <span className="capitalize text-sm">{a}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  onClick={() => {
                    setShowImageModal(false);
                    setImageConfig({ url: "", caption: "", align: "center", width: "" });
                  }}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  onClick={insertImageWithConfig}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Toolbar button helper
function ToolbarButton({
  icon,
  onClick,
  active,
  disabled,
  label,
  variant = "default",
}) {
  const base =
    "p-2 rounded-lg transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed";
  const styles = {
    default: active
      ? "bg-blue-100 text-blue-700 shadow-sm"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    primary: "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
  };
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]}`}
    >
      {icon}
    </button>
  );
}
