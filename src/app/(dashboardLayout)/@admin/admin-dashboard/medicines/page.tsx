"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api/api";
import {
  Plus,
  Tag,
  Trash2,
  Loader2,
  ChevronRight,
  LayoutGrid,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/useToast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Category {
  id: string;
  name: string;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const medicineCategories = await api.medicines.getCategories();
      setCategories(
        Array.isArray(medicineCategories) ? medicineCategories : [],
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Unable to retrieve clinical classification registry.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    try {
      await api.medicines.addMedicineCategory({ name: newCategoryName });

      toast({
        title: "Category Added Successfully!",
        description: `${newCategoryName.toUpperCase()} has been deployed to the registry.`,
        variant: "success",
      });

      setNewCategoryName("");
      await loadCategories();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Security Violation",
        description: "Could not create entry. Ensure label is unique.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      await api.medicines.deleteMedicineCategory(
        categoryToDelete?.id as string,
      );

      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      setIsDeleteDialogOpen(false);

      toast({
        title: "Database Purged",
        description: "Entry has been removed from the clinical feed.",
        variant: "success",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Deletion Blocked",
        description: "Category is linked to active medicine stock.",
      });
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24">
      {/* --- ADMIN HEADER --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <span>System Admin</span>
              <ChevronRight size={12} />
              <span className="text-emerald-500">Classification Manager</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
              Category <span className="text-emerald-500">Registry</span>
            </h2>
          </div>
          <Badge className="bg-slate-900 text-white font-black text-[10px] py-2 px-4 rounded-xl uppercase tracking-widest h-fit">
            {categories.length} Total SKU Types
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* --- CREATE PANEL --- */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 sticky top-32 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                  <LayoutGrid size={20} />
                </div>
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">
                  Add Medicine Category
                </h3>
              </div>

              <form onSubmit={handleAddCategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                    Label Name
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="E.G. NEUROLOGICAL"
                    className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !newCategoryName}
                  className="w-full py-4 cursor-pointer bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Plus size={16} />
                  )}
                  Add Entry
                </button>
              </form>
            </div>
          </div>

          {/* --- DATA LIST --- */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2 px-2">
              <Activity size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                Active Archive Feed
              </span>
            </div>

            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-[2.5rem] border-dashed">
                <Loader2
                  className="animate-spin text-emerald-500 mb-4"
                  size={40}
                />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                  Syncing...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="group flex items-center justify-between p-6 bg-white border border-slate-200 rounded-[1.5rem] hover:border-emerald-500 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                        <Tag size={20} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm uppercase group-hover:text-emerald-600 transition-colors">
                          {category.name}
                        </p>
                        <p className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-tighter pt-1">
                          UUID: {category.id}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => confirmDelete(category)}
                      className="h-12 w-12 flex items-center cursor-pointer justify-center rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- CONFIRMATION DIALOG --- */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] border-none p-8">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="h-20 w-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle size={36} />
            </div>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">
              Override Check
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs font-bold leading-relaxed pt-2">
              Confirm purge of{" "}
              <span className="text-slate-900 font-black">
                "{categoryToDelete?.name.toUpperCase()}"
              </span>
              . This operation will permanently erase this classification from
              the system archive.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1 py-4 cursor-pointer bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 py-4 cursor-pointer bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-2"
            >
              {isDeleting && <Loader2 className="animate-spin" size={14} />}
              Execute Purge
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
