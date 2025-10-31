"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Image from "next/image";
import { db } from "@/lib/firebase";
import Editor from "@/app/components/Editor";
import { Upload, FileText, Sparkles } from "lucide-react";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

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
        setImage(data.secure_url);
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Cloudinary error:", err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !image) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "blogs"), {
        title,
        image,
        content, // HTML from Editor
        createdAt: serverTimestamp(),
      });

      console.log("Document written with ID: ", docRef.id);
      alert("✅ Blog created successfully!");
      setTitle("");
      setImage("");
      setContent("");
    } catch (error) {
      console.error("Error adding blog:", error);
      alert("Failed to create blog. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Create New Post</h1>
              <p className="text-sm text-gray-500">Share your thoughts with the world</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2.5 rounded-lg font-semibold text-white transition-all duration-200 flex items-center gap-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Publish Post
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Post Title</h2>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title for your post..."
                className="w-full border-0 text-2xl font-bold text-gray-900 placeholder:text-gray-400 focus:ring-0 outline-none bg-transparent"
                required
              />
            </div>

            {/* Cover Image Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Cover Image</h2>
              </div>
              
              {!image ? (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-gray-700 font-medium mb-2">
                      {uploading ? "Uploading..." : "Click to upload cover image"}
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG or WEBP (Max 10MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative group">
                  <div className="relative w-full h-96 rounded-xl overflow-hidden">
                    <Image
                      src={image}
                      alt="Blog Cover"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setImage("")}
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            {/* Content Editor Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Content</h2>
              </div>
              <div className="text-black prose max-w-none">
                <Editor content={content} onChange={setContent} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Preview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Preview</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Title</p>
                  <p className="text-base font-semibold text-gray-900 line-clamp-2">
                    {title || "No title yet"}
                  </p>
                </div>

                {image && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Cover</p>
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${title && content && image ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <p className="text-sm text-gray-700">
                      {title && content && image ? "Ready to publish" : "Incomplete"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Publishing Checklist</h4>
                <div className="space-y-2">
                  <ChecklistItem checked={!!title} label="Add a title" />
                  <ChecklistItem checked={!!image} label="Upload cover image" />
                  <ChecklistItem checked={!!content} label="Write content" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({ checked, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
        checked ? 'bg-green-500 border-green-500' : 'border-gray-300'
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-sm ${checked ? 'text-gray-700' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );
}
