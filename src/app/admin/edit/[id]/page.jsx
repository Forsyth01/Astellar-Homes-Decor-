"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, collection, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import Editor from "@/app/components/Editor";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Image as ImageIcon,
  Type,
  BookOpen,
  Eye,
  Calendar,
  Tag,
  ArrowLeft,
  Save,
  Zap,
  CheckCircle,
  Plus,
  X
} from "lucide-react";

export default function EditBlog() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [fetchingBlog, setFetchingBlog] = useState(true);

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = [];
        querySnapshot.forEach((doc) => {
          categoriesData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        categoriesData.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setExcerpt(data.excerpt || "");
          setCategory(data.category || "");
          setImage(data.image);
          setContent(data.content);
          if (data.publishedAt?.toDate) {
            setPublishDate(data.publishedAt.toDate().toISOString().split('T')[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setFetchingBlog(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Add new category to Firebase
  const addCategoryToFirebase = async (categoryName) => {
    try {
      const existingCategory = categories.find(
        cat => cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      
      if (existingCategory) {
        return existingCategory.name;
      }

      const docRef = await addDoc(collection(db, "categories"), {
        name: categoryName,
        createdAt: serverTimestamp(),
        postCount: 0
      });

      const newCategory = {
        id: docRef.id,
        name: categoryName,
        createdAt: serverTimestamp(),
        postCount: 0
      };
      
      setCategories(prev => {
        const updated = [...prev, newCategory];
        updated.sort((a, b) => a.name.localeCompare(b.name));
        return updated;
      });

      return categoryName;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  };

  const handleImageUpload = async (file) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File size too large. Please choose an image under 10MB.");
      throw new Error("File too large");
    }

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
        return data.secure_url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Cloudinary error:", err);
      throw err;
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);

    try {
      const imageUrl = await handleImageUpload(file);
      setImage(imageUrl);
    } catch (err) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title || !content || !image) {
      alert("Please fill all required fields: title, content, and cover image.");
      return;
    }

    setLoading(true);

    try {
      let finalCategory = category;

      if (showCustomCategory && customCategory.trim()) {
        finalCategory = await addCategoryToFirebase(customCategory.trim());
      }

      if (!finalCategory) {
        alert("Please select or add a category.");
        return;
      }

      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, {
        title,
        excerpt,
        category: finalCategory,
        image,
        content,
        publishedAt: new Date(publishDate),
        updatedAt: serverTimestamp(),
      });

      alert("🎉 Blog post updated successfully!");
      router.push("/admin");
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = title && content && image && category;

  const addCustomCategory = async () => {
    if (customCategory.trim()) {
      try {
        const newCategory = await addCategoryToFirebase(customCategory.trim());
        setCategory(newCategory);
        setCustomCategory("");
        setShowCustomCategory(false);
      } catch (error) {
        alert("Failed to add category. Please try again.");
      }
    }
  };

  if (fetchingBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-amber-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-amber-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 text-lg mt-4 font-light">Loading your story...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => router.push("/admin")}
                className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors p-1 sm:p-2 rounded-lg hover:bg-gray-100 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">Edit Story</h1>
                  <p className="text-xs sm:text-sm text-gray-500">Update your design inspiration</p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-base font-bold text-gray-900">Edit Story</h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-3">
              <button
                onClick={() => alert("Changes saved successfully!")}
                className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Save Draft</span>
              </button>
              
              <button
                onClick={handleUpdate}
                disabled={loading || !isFormValid}
                className={`px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-white transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : !isFormValid
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="hidden sm:inline">Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Update</span>
                    <span className="sm:hidden">Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Editor Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Type className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Story Title</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Catchy title that grabs attention</p>
                </div>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title for your design story..."
                className="w-full border-0 text-2xl sm:text-3xl font-bold text-gray-900 placeholder:text-gray-400 focus:ring-0 outline-none bg-transparent leading-tight"
                required
              />
            </div>

            {/* Excerpt & Category Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Story Details</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Add context and categorization</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description of your story..."
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="space-y-3">
                    {loadingCategories ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        Loading categories...
                      </div>
                    ) : !showCustomCategory ? (
                      <>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white text-sm sm:text-base"
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name} {cat.postCount ? `(${cat.postCount})` : ''}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowCustomCategory(true)}
                          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add New Category
                        </button>
                      </>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Enter new category name..."
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm sm:text-base"
                        />
                        <button
                          onClick={addCustomCategory}
                          disabled={!customCategory.trim()}
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setShowCustomCategory(false);
                            setCustomCategory("");
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Image Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Cover Image</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Beautiful image that represents your story</p>
                </div>
              </div>
              
              {!image ? (
                <label className="block cursor-pointer group">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 text-center hover:border-amber-500 hover:bg-amber-50/50 transition-all duration-300 group-hover:scale-[1.02]">
                    {uploading ? (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-700 font-medium mb-2 text-sm sm:text-base">Uploading image...</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
                        </div>
                        <p className="text-gray-700 font-medium mb-2 text-sm sm:text-base">
                          Click to upload cover image
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          PNG, JPG or WEBP • Max 10MB
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative group">
                  <div className="relative w-full h-48 sm:h-80 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={image}
                      alt="Blog Cover"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                  </div>
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-2 flex-col sm:flex-row">
                    <label className="bg-white/90 backdrop-blur-sm text-gray-700 hover:text-gray-900 px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-medium shadow-lg cursor-pointer transition-all hover:scale-105 text-xs sm:text-sm">
                      Change
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={() => setImage("")}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-medium shadow-lg transition-all hover:scale-105 text-xs sm:text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Content Editor Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Story Content</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Write your design story and insights</p>
                </div>
              </div>
              <div className="text-black prose max-w-none">
                <Editor 
                  content={content} 
                  onChange={setContent}
                  onImageUpload={handleImageUpload}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Preview Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-600" />
                Story Preview
              </h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-2 font-medium">Title</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    {title || "No title yet"}
                  </p>
                </div>

                {excerpt && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2 font-medium">Excerpt</p>
                    <p className="text-xs sm:text-sm text-gray-700 line-clamp-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {excerpt}
                    </p>
                  </div>
                )}

                {category && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2 font-medium">Category</p>
                    <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-blue-200">
                      <Tag className="w-3 h-3" />
                      {category}
                    </div>
                  </div>
                )}

                {image && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2 font-medium">Cover Image</p>
                    <div className="relative w-full h-20 sm:h-24 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={image}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <p className="text-sm font-semibold text-gray-900">Status</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${isFormValid ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                    <p className="text-xs sm:text-sm text-gray-700">
                      {isFormValid ? "Ready to update" : "Incomplete"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Update Checklist */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Update Checklist
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <ChecklistItem checked={!!title} label="Add a compelling title" />
                  <ChecklistItem checked={!!image} label="Upload cover image" />
                  <ChecklistItem checked={!!content} label="Write story content" />
                  <ChecklistItem checked={!!category} label="Choose category" />
                  <ChecklistItem checked={!!excerpt} label="Add excerpt (optional)" />
                </div>
              </div>

              {/* Publish Date */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  Publish Date
                </label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Editing Tips
              </h4>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-amber-600">1</span>
                  </div>
                  <p>Review your title for clarity and engagement</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-amber-600">2</span>
                  </div>
                  <p>Check that images are high-quality and relevant</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-amber-600">3</span>
                  </div>
                  <p>Proofread content for typos and flow</p>
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
    <div className="flex items-center gap-2 sm:gap-3">
      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
        checked 
          ? 'bg-green-500 border-green-500 shadow-sm' 
          : 'border-gray-300 bg-white'
      }`}>
        {checked && (
          <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
        )}
      </div>
      <span className={`text-xs sm:text-sm transition-colors ${checked ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );
}