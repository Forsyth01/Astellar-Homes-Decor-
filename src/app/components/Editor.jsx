// app/components/Editor.jsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
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
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Highlighter,
} from "lucide-react";

// Custom Image extension with working controls
const CustomImage = Image.extend({
  name: 'customImage',
  
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
      },
      alt: {
        default: '',
      },
      title: {
        default: '',
      },
      'data-align': {
        default: 'center',
      },
      'data-caption': {
        default: '',
      },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement('div');
      container.className = 'relative inline-block max-w-full my-4 group';
      
      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || '';
      img.className = 'rounded-lg max-w-full h-auto border border-gray-200';
      
      // Set alignment
      const align = node.attrs['data-align'] || 'center';
      if (align === 'center') {
        container.className += ' block mx-auto text-center';
      } else if (align === 'left') {
        container.className += ' float-left mr-4 mb-4';
      } else if (align === 'right') {
        container.className += ' float-right ml-4 mb-4';
      }

      // Create controls container
      const controls = document.createElement('div');
      controls.className = 'absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10';
      
      // Change Image Button
      const changeBtn = document.createElement('button');
      changeBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m13 4 4-4m-4 4-4-4"/>
        </svg>
      `;
      changeBtn.className = 'bg-black/80 text-white p-1.5 rounded-lg hover:bg-black transition-colors shadow-lg';
      changeBtn.title = 'Change image';
      changeBtn.style.cursor = 'pointer';
      
      // Remove Image Button
      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      `;
      removeBtn.className = 'bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 transition-colors shadow-lg';
      removeBtn.title = 'Remove image';
      removeBtn.style.cursor = 'pointer';

      // Add event listeners
      const handleChangeClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            try {
              // Get the onImageUpload function from editor options
              const onImageUpload = editor.options.editorProps.attributes['data-on-image-upload'];
              if (onImageUpload) {
                const newUrl = await onImageUpload(file);
                if (newUrl) {
                  const transaction = editor.state.tr.setNodeMarkup(getPos(), undefined, {
                    ...node.attrs,
                    src: newUrl,
                  });
                  editor.view.dispatch(transaction);
                }
              }
            } catch (error) {
              console.error('Failed to change image:', error);
              alert('Failed to change image. Please try again.');
            }
          }
        };
        
        input.click();
      };

      const handleRemoveClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const transaction = editor.state.tr.delete(getPos(), getPos() + 1);
        editor.view.dispatch(transaction);
      };

      changeBtn.addEventListener('click', handleChangeClick);
      removeBtn.addEventListener('click', handleRemoveClick);

      controls.appendChild(changeBtn);
      controls.appendChild(removeBtn);
      container.appendChild(img);
      container.appendChild(controls);

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'customImage') return false;
          img.src = updatedNode.attrs.src;
          img.alt = updatedNode.attrs.alt || '';
          return true;
        },
        destroy: () => {
          changeBtn.removeEventListener('click', handleChangeClick);
          removeBtn.removeEventListener('click', handleRemoveClick);
        },
      };
    };
  },
});

// Highlight color picker component
const HighlightPicker = ({ editor }) => {
  const [showPicker, setShowPicker] = useState(false);
  const highlightPresets = [
    '#FFEB3B', '#FF9800', '#4CAF50', '#2196F3', '#9C27B0',
    '#F44336', '#00BCD4', '#8BC34A', '#FF5722', '#607D8B',
    '#E91E63', '#3F51B5', '#CDDC39', '#FFC107', '#795548'
  ];

  // Get current highlight color from editor selection
  const getCurrentHighlight = () => {
    if (!editor) return '#FFEB3B';
    return editor.getAttributes('highlight')?.color || '#FFEB3B';
  };

  const handleHighlightChange = (color) => {
    if (editor) {
      editor.chain().focus().setHighlight({ color }).run();
    }
  };

  const handleReset = () => {
    if (editor) {
      editor.chain().focus().unsetHighlight().run();
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center gap-1 relative"
        title="Text Highlight Color"
      >
        <Highlighter size={18} />
        {/* Show current highlight color indicator */}
        <div 
          className="w-2 h-2 rounded-full absolute bottom-1 right-1 border border-gray-300"
          style={{ backgroundColor: getCurrentHighlight() }}
        />
      </button>

      {showPicker && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Highlight</span>
            <button
              onClick={() => {
                handleReset();
                setShowPicker(false);
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Reset
            </button>
          </div>
          
          <div className="grid grid-cols-5 gap-1 mb-3">
            {highlightPresets.map((color) => (
              <button
                key={color}
                onClick={() => {
                  handleHighlightChange(color);
                  setShowPicker(false);
                }}
                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          <input
            type="color"
            value={getCurrentHighlight()}
            onChange={(e) => handleHighlightChange(e.target.value)}
            className="w-full h-8 cursor-pointer rounded"
          />
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Custom:</span>
            <span>{getCurrentHighlight()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Editor({ content = "", onChange = () => {}, onImageUpload }) {
  const fileInputRef = useRef(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageConfig, setImageConfig] = useState({
    url: "",
    caption: "",
    align: "center",
    width: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [mounted, setMounted] = useState(false);
  const editorContainerRef = useRef(null);

  // Ensure this only runs on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      // Load highlight extension first
      Highlight.configure({ 
        multicolor: true 
      }),
      // Then load other extensions
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: { class: 'font-bold' },
        },
        bulletList: {
          HTMLAttributes: { class: 'list-disc list-outside ml-6' },
        },
        orderedList: {
          HTMLAttributes: { class: 'list-decimal list-outside ml-6' },
        },
        blockquote: {
          HTMLAttributes: { class: 'border-l-4 border-gray-300 pl-4 italic my-4' },
        },
        code: {
          HTMLAttributes: { class: 'bg-gray-100 rounded px-1 py-0.5 font-mono text-sm' },
        },
        codeBlock: {
          HTMLAttributes: { class: 'bg-gray-900 text-gray-100 rounded p-4 font-mono text-sm my-4' },
        },
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: { class: 'rounded-lg max-w-full h-auto' },
      }),
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800 cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Underline.configure({ HTMLAttributes: { class: 'underline' } }),
    ],

    content: content,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },

    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4 sm:p-6 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ml-6 [&_ol]:ml-6 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_pre]:bg-gray-900 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded [&_pre]:my-4 [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded",
        'data-gramm': 'false',
        'data-gramm_editor': 'false',
        'data-enable-grammarly': 'false',
        'data-on-image-upload': onImageUpload,
      },
      handleDrop: (view, event, slice, moved) => {
        try {
          if (!moved && event.dataTransfer?.files?.[0]) {
            const file = event.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
              event.preventDefault();
              uploadImage(file, view, event);
              return true;
            }
          }
        } catch (err) {
          console.error("drop error", err);
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find((item) => item.type.startsWith("image"));
        if (imageItem) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          if (file) uploadImage(file);
          return true;
        }
        return false;
      }, 
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  const uploadImage = async (file, view = null, event = null) => {
    if (!onImageUpload) {
      console.error("onImageUpload function not provided");
      alert("Image upload is not configured. Please contact administrator.");
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await onImageUpload(file);
      
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
            type: "customImage",
            attrs: { 
              src: imageUrl, 
              "data-align": "center",
            },
          })
          .run();
      } else {
        setImageConfig(prev => ({ ...prev, url: imageUrl }));
        setShowImageModal(true);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadImage(file);
    e.target.value = "";
  };

  const insertImageWithConfig = () => {
    if (!imageConfig.url.trim()) {
      alert("Please provide an image URL");
      return;
    }

    const attrs = {
      src: imageConfig.url,
      "data-align": imageConfig.align || "center",
      "data-caption": imageConfig.caption || "",
    };

    if (imageConfig.width) {
      const w = parseInt(imageConfig.width, 10);
      if (!Number.isNaN(w) && w > 0) attrs.width = w;
    }

    editor.chain().focus().setImage(attrs).run();
    setShowImageModal(false);
    setImageConfig({ url: "", caption: "", align: "center", width: "" });
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Don't render until mounted on client
  if (!mounted) {
    return (
      <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white h-[500px] flex flex-col">
        {/* Toolbar Skeleton */}
        <div className="flex flex-wrap items-center gap-1 p-3 border-b bg-gray-50/50 sticky top-0 z-10">
          {[...Array(13)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="flex-1 p-6 bg-white">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div 
      className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white h-[500px] flex flex-col"
      ref={editorContainerRef}
    >
      {/* Sticky Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 pr-3 border-r border-gray-300 mr-2">
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

        {/* Headings & Paragraph */}
        <div className="flex items-center gap-1 pr-3 border-r border-gray-300 mr-2">
          <ToolbarButton
            icon={<Type size={18} />}
            active={editor.isActive("paragraph")}
            onClick={() => editor.chain().focus().setParagraph().run()}
            label="Paragraph"
          />
          <ToolbarButton
            icon={<Heading2 size={18} />}
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            label="Heading 2"
          />
          <ToolbarButton
            icon={<Heading3 size={18} />}
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            label="Heading 3"
          />
        </div>

        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-3 border-r border-gray-300 mr-2">
          <ToolbarButton
            icon={<Bold size={18} />}
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            label="Bold"
          />
          <ToolbarButton
            icon={<Italic size={18} />}
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            label="Italic"
          />
          <ToolbarButton
            icon={<Code size={18} />}
            active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
            label="Inline Code"
          />
        </div>

        {/* Text Highlight */}
        <div className="flex items-center gap-1 pr-3 border-r border-gray-300 mr-2">
          <HighlightPicker
            editor={editor}
          />
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1 pr-3 border-r border-gray-300 mr-2">
          <ToolbarButton
            icon={<AlignLeft size={18} />}
            active={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            label="Align Left"
          />
          <ToolbarButton
            icon={<AlignCenter size={18} />}
            active={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            label="Align Center"
          />
          <ToolbarButton
            icon={<AlignRight size={18} />}
            active={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            label="Align Right"
          />
          <ToolbarButton
            icon={<AlignJustify size={18} />}
            active={editor.isActive({ textAlign: 'justify' })}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            label="Justify Text"
          />
        </div>

        {/* Lists & Quote */}
        <div className="flex items-center gap-1 pr-3 border-r border-gray-300 mr-2">
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
            label="Blockquote"
          />
        </div>

        {/* Links */}
        <div className="flex items-center gap-1 pr-3 border-r border-gray-300 mr-2">
          <ToolbarButton
            icon={<Link2 size={18} />}
            active={editor.isActive("link")}
            onClick={setLink}
            label="Add Link"
          />
          <ToolbarButton
            icon={<Unlink size={18} />}
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
            label="Remove Link"
          />
        </div>

        {/* Image Upload */}
        <ToolbarButton
          icon={
            uploadingImage ? (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ImagePlus size={18} />
            )
          }
          onClick={() => fileInputRef.current?.click()}
          label="Insert Image"
          variant="primary"
          disabled={uploadingImage || !onImageUpload}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Scrollable Editor Content Area */}
      <div className="flex-1 overflow-auto">
        <EditorContent
          editor={editor}
          className="h-full outline-none bg-white"
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
                  onChange={(e) => setImageConfig(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption (optional)
                </label>
                <input
                  type="text"
                  value={imageConfig.caption}
                  onChange={(e) => setImageConfig(prev => ({ ...prev, caption: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Image description..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (px, optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={imageConfig.width}
                  onChange={(e) => setImageConfig(prev => ({ ...prev, width: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Auto"
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
                        onChange={() => setImageConfig(prev => ({ ...prev, align: a }))}
                        className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="capitalize text-sm">{a}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={insertImageWithConfig}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Insert Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style jsx global>{`
        .ProseMirror {
          height: 100%;
          padding-top: 0 !important;
        }
        .ProseMirror p {
          text-align: justify;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }
        .group:hover .group-hover\\:opacity-100 {
          opacity: 1 !important;
        }
        
        /* Color picker styles */
        input[type="color"] {
          -webkit-appearance: none;
          border: none;
          border-radius: 4px;
        }
        input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;
        }
        input[type="color"]::-webkit-color-swatch {
          border: none;
          border-radius: 4px;
        }
        
        /* Ensure the editor container has proper height */
        .editor-container {
          height: 500px;
        }
      `}</style>
    </div>
  );
}

function ToolbarButton({ icon, onClick, active, disabled, label, variant = "default" }) {
  const base = "p-2 rounded-lg transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed border border-transparent";
  const styles = {
    default: active
      ? "bg-blue-100 text-blue-700 border-blue-200 shadow-sm"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-200",
    primary: active
      ? "bg-blue-100 text-blue-700 border-blue-200 shadow-sm"
      : "text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200",
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