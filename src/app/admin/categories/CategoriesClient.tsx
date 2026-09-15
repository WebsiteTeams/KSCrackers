'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Eye, Plus, X, Loader2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryItem {
  id: string;
  name: string;
  image: string;
  count: number;
}

interface CategoriesClientProps {
  categories: CategoryItem[];
}

export default function CategoriesClient({ categories: initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [uploading, setUploading] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const addFileRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (categoryId: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB.');
      return;
    }

    setUploading(categoryId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'categories');

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const { url } = await uploadRes.json();

      const saveRes = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: categoryId, image: url }),
      });
      if (!saveRes.ok) throw new Error('Save failed');

      setCategories((prev) =>
        prev.map((c) => (c.id === categoryId ? { ...c, image: url } : c))
      );
      toast.success('Category image updated');
    } catch {
      toast.error('Failed to update category image');
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveImage = async (categoryId: string) => {
    const defaultImage = `/images/categories/${categoryId}.webp`;
    setUploading(categoryId);
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: categoryId, image: defaultImage }),
      });
      if (!res.ok) throw new Error('Save failed');
      setCategories((prev) =>
        prev.map((c) => (c.id === categoryId ? { ...c, image: defaultImage } : c))
      );
      toast.success('Image reset to default');
    } catch {
      toast.error('Failed to reset image');
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Delete this category? Products in it will remain but lose their category assignment.')) return;

    try {
      const res = await fetch(`/api/categories?id=${categoryId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      toast.success('Category deleted');
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error('Category name is required');
      return;
    }

    setCreating(true);
    try {
      let imageUrl = `/images/categories/${newName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.webp`;

      if (newImageFile) {
        const formData = new FormData();
        formData.append('file', newImageFile);
        formData.append('category', 'categories');
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          imageUrl = url;
        }
      }

      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), image: imageUrl }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Create failed');
      }

      const { category } = await res.json();
      setCategories((prev) => [...prev, { ...category, count: 0 }]);
      setNewName('');
      setNewImageFile(null);
      setNewImagePreview(null);
      setShowAddForm(false);
      toast.success(`Category "${category.name}" created`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Categories</h1>
          <p className="text-sm text-stone-500 mt-1">Manage categories and their images</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-burgundy-700 text-white text-sm font-semibold rounded-lg hover:bg-burgundy-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-900">New Category</h2>
            <button onClick={() => { setShowAddForm(false); setNewName(''); setNewImageFile(null); setNewImagePreview(null); }} className="text-stone-400 hover:text-stone-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Category Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Twinkling Stars"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Image (optional)</label>
              <input
                ref={addFileRef}
                type="file"
                accept="image/webp,image/jpeg,image/png,image/avif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setNewImageFile(file);
                    setNewImagePreview(URL.createObjectURL(file));
                  }
                  e.target.value = '';
                }}
              />
              <button
                onClick={() => addFileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-dashed border-stone-300 rounded-lg text-sm text-stone-600 hover:border-burgundy-400 hover:text-burgundy-700 transition-colors"
              >
                {newImagePreview ? (
                  <div className="relative w-full h-24">
                    <Image src={newImagePreview} alt="Preview" fill sizes="200px" className="object-cover rounded" />
                  </div>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Choose image
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setShowAddForm(false); setNewName(''); setNewImageFile(null); setNewImagePreview(null); }}
              className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-burgundy-700 text-white text-sm font-semibold rounded-lg hover:bg-burgundy-800 transition-colors disabled:opacity-50"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Create Category
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {categories.map((cat) => {
          const isUploading = uploading === cat.id;

          return (
            <div key={cat.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-[4/5] bg-stone-100">
                {isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-burgundy-600 animate-spin" />
                  </div>
                ) : (
                  <Image
                    src={cat.image}
                    alt={`${cat.name} category`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholders/category-image-soon.webp';
                    }}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-semibold text-white text-sm">{cat.name}</h3>
                  <span className="text-xs text-stone-300">
                    {cat.count} {cat.count === 1 ? 'product' : 'products'}
                  </span>
                </div>

                <button
                  onClick={() => setPreview(cat.image)}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4 text-stone-600" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <input
                  ref={(el) => { fileInputRefs.current[cat.id] = el; }}
                  type="file"
                  accept="image/webp,image/jpeg,image/png,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(cat.id, file);
                    e.target.value = '';
                  }}
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRefs.current[cat.id]?.click()}
                    disabled={isUploading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-burgundy-700 text-white text-xs font-semibold rounded-lg hover:bg-burgundy-800 transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Image
                  </button>
                  <button
                    onClick={() => handleRemoveImage(cat.id)}
                    disabled={isUploading}
                    className="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Reset to default"
                  >
                    <FolderOpen className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={isUploading}
                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[10px] text-stone-400 truncate" title={cat.image}>
                  {cat.image.split('/').pop()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-8" onClick={() => setPreview(null)}>
          <div className="relative max-w-2xl w-full aspect-square bg-white rounded-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <Image src={preview} alt="Preview" fill sizes="100vw" className="object-contain p-4" />
            <button onClick={() => setPreview(null)} className="absolute top-3 right-3 p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
              <X className="w-5 h-5 text-stone-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
