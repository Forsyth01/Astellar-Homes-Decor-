// app/components/CategoriesManager.jsx
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Edit2, Trash2, Save, X, Tag, Search } from "lucide-react";

export default function CategoriesManager({ onCategoryUpdate }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

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
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      // Check for duplicates
      const existing = categories.find(
        cat => cat.name.toLowerCase() === newCategory.trim().toLowerCase()
      );
      if (existing) {
        alert("Category already exists!");
        return;
      }

      const docRef = await addDoc(collection(db, "categories"), {
        name: newCategory.trim(),
        createdAt: serverTimestamp(),
        postCount: 0
      });

      const category = {
        id: docRef.id,
        name: newCategory.trim(),
        createdAt: serverTimestamp(),
        postCount: 0
      };

      setCategories(prev => {
        const updated = [...prev, category];
        updated.sort((a, b) => a.name.localeCompare(b.name));
        return updated;
      });

      setNewCategory("");
      onCategoryUpdate?.();
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    }
  };

  const updateCategory = async (categoryId) => {
    if (!editName.trim()) return;

    try {
      const existing = categories.find(
        cat => cat.id !== categoryId && cat.name.toLowerCase() === editName.trim().toLowerCase()
      );
      if (existing) {
        alert("Category name already exists!");
        return;
      }

      await updateDoc(doc(db, "categories", categoryId), {
        name: editName.trim()
      });

      setCategories(prev =>
        prev.map(cat =>
          cat.id === categoryId ? { ...cat, name: editName.trim() } : cat
        ).sort((a, b) => a.name.localeCompare(b.name))
      );

      setEditingId(null);
      setEditName("");
      onCategoryUpdate?.();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category.");
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category? Posts using this category will keep it but you won't be able to select it for new posts.")) {
      return;
    }

    try {
      setDeletingId(categoryId);
      await deleteDoc(doc(db, "categories", categoryId));
      
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      onCategoryUpdate?.();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  const startEditing = (category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 sm:p-8">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <span className="hidden sm:inline">Loading categories...</span>
          <span className="sm:hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-3 mb-4 sm:mb-5 lg:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
          <span className="truncate">Manage Categories</span>
        </h3>
        <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full self-start xs:self-auto">
          {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </div>
      </div>

      {/* Add New Category */}
      <div className="flex flex-col xs:flex-row gap-2 mb-4 sm:mb-5 lg:mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name..."
          className="flex-1 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
          onKeyPress={(e) => e.key === 'Enter' && addCategory()}
        />
        <button
          onClick={addCategory}
          disabled={!newCategory.trim()}
          className="w-full xs:w-auto px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-3 sm:mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
        />
      </div>

      {/* Categories List */}
      <div className="space-y-2 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
            <div className="text-3xl sm:text-4xl mb-2">📁</div>
            {searchTerm ? "No categories found" : "No categories yet"}
            {!searchTerm && (
              <p className="text-xs sm:text-sm text-gray-400 mt-2">
                Add your first category above
              </p>
            )}
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between gap-2 p-2.5 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {editingId === category.id ? (
                // Edit Mode
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 min-w-0 px-2 py-1 sm:py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm sm:text-base"
                    onKeyPress={(e) => e.key === 'Enter' && updateCategory(category.id)}
                    autoFocus
                  />
                  <button
                    onClick={() => updateCategory(category.id)}
                    className="p-1.5 sm:p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors flex-shrink-0"
                    title="Save"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 sm:gap-3 flex-1 min-w-0">
                    <span className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {category.name}
                    </span>
                    {category.postCount > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 sm:py-1 rounded-full self-start xs:self-auto flex-shrink-0">
                        {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                    <button
                      onClick={() => startEditing(category)}
                      className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      title="Edit category"
                    >
                      <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      disabled={deletingId === category.id}
                      className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete category"
                    >
                      {deletingId === category.id ? (
                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Info - Only show on larger screens when there are categories */}
      {filteredCategories.length > 0 && (
        <div className="hidden sm:block mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            {filteredCategories.length !== categories.length && (
              <>Showing {filteredCategories.length} of {categories.length} categories</>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

