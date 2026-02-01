"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit3,
  Package,
  Tablet,
  Loader2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import api from "@/lib/api/api";
import { toast } from "@/hooks/useToast";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export default function InventoryPage() {
  const { user } = useAuthStore();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [editItem, setEditItem] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  // NEW: Delete States
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user?.id) fetchInventory();
  }, [user?.id]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await api.seller.medicines.get();
      setMedicines(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fetch Failed",
        description: "Could not sync with inventory.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickEdit = (med: any) => {
    setEditItem({ ...med });
    setIsEditOpen(true);
  };

  const saveQuickEdit = async () => {
    if (!editItem) return;
    setUpdating(true);
    try {
      const payload = {
        name: editItem.name,
        manufacturer: editItem.manufacturer,
        price: parseFloat(editItem.price),
        stock: parseInt(editItem.stock),
      };

      await api.seller.medicines.update(editItem.id, payload);

      toast({
        title: "Updated successfully",
        description: "Medicine info synchronized.",
        variant: "success",
      });
      setIsEditOpen(false);
      fetchInventory();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
      });
    } finally {
      setUpdating(false);
    }
  };

  // NEW: Delete Logic
  const handleDeleteClick = (med: any) => {
    setDeleteItem(med);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await api.seller.medicines.delete(deleteItem.id);

      // Optimistic UI Update
      setMedicines((prev) => prev.filter((m) => m.id !== deleteItem.id));

      toast({
        title: "Item Deleted",
        description: `${deleteItem.name} removed from inventory.`,
      });
      setIsDeleteOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Item might be linked to active orders.",
      });
    } finally {
      setDeleting(false);
      setDeleteItem(null);
    }
  };

  const filteredMedicines = medicines.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-[1400px] mx-auto pb-24 animate-in fade-in duration-700">
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">
            Inventory
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            <Package size={14} className="text-teal-500" /> Managing{" "}
            {medicines.length} Listings
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:w-[300px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-500 transition-colors"
              size={16}
            />
            <Input
              placeholder="Search catalog..."
              className="h-12 pl-11 rounded-2xl border-none bg-white shadow-sm font-bold text-xs uppercase tracking-wider focus-visible:ring-teal-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/seller-dashboard/add-medicine">
            <Button className="h-12 px-6 cursor-pointer rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black shadow-lg shadow-teal-100 italic transition-all active:scale-95">
              <Plus size={18} className="mr-2" /> ADD NEW
            </Button>
          </Link>
        </div>
      </div>

      {/* TABLE SECTION */}
      <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.02)] rounded-[40px] bg-white overflow-hidden p-2">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="py-6 px-6 font-black text-[10px] uppercase tracking-widest text-slate-400">
                Product
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">
                Stock Status
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">
                Price
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 text-right">
                Control
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center">
                  <Loader2 className="animate-spin mx-auto text-slate-200" />
                </TableCell>
              </TableRow>
            ) : filteredMedicines.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-40 text-center text-slate-400 font-bold uppercase text-xs tracking-widest"
                >
                  No medicines found
                </TableCell>
              </TableRow>
            ) : (
              filteredMedicines.map((med) => (
                <TableRow
                  key={med.id}
                  className="group border-b border-slate-50 hover:bg-slate-50/50 transition-all"
                >
                  <TableCell className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:scale-105 transition-transform">
                        {med.image ? (
                          <Image
                            src={med.image}
                            alt={med.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <Tablet className="text-slate-200" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight leading-none mb-1">
                          {med.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {med.manufacturer}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      <span
                        className={cn(
                          "text-xs font-black uppercase",
                          med.stock < 10 ? "text-rose-500" : "text-slate-600",
                        )}
                      >
                        {med.stock} in stock
                      </span>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full",
                            med.stock < 10 ? "bg-rose-500" : "bg-teal-500",
                          )}
                          style={{ width: `${Math.min(med.stock, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-slate-900 text-lg">
                    ${med.price}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => handleQuickEdit(med)}
                        variant="ghost"
                        className="h-10 w-10 p-0 cursor-pointer rounded-xl hover:bg-teal-50 text-slate-400 hover:text-teal-600"
                      >
                        <Edit3 size={18} />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(med)}
                        variant="ghost"
                        className="h-10 w-10 p-0 cursor-pointer rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* QUICK EDIT DIALOG (Existing) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="rounded-[40px] border-none shadow-2xl max-w-md p-8 bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
              Quick Update
            </DialogTitle>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {editItem?.name}
            </p>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Stock Level
                </Label>
                <Input
                  type="number"
                  className="rounded-2xl border-slate-100 h-14 font-black text-xl text-teal-600"
                  value={editItem?.stock || ""}
                  onChange={(e) =>
                    setEditItem({ ...editItem, stock: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Price ($)
                </Label>
                <Input
                  type="number"
                  className="rounded-2xl border-slate-100 h-14 font-black text-xl text-teal-600"
                  value={editItem?.price || ""}
                  onChange={(e) =>
                    setEditItem({ ...editItem, price: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-center flex-row">
            <Button
              variant="ghost"
              className="rounded-2xl font-bold uppercase text-xs flex-1"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-2xl cursor-pointer flex-2 h-12 bg-slate-900 hover:bg-teal-600 text-white font-black italic tracking-tight"
              onClick={saveQuickEdit}
              disabled={updating}
            >
              {updating ? <Loader2 className="animate-spin" /> : "SAVE CHANGES"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-[40px] border-none shadow-2xl max-w-[400px] p-10 bg-white">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6">
              <AlertTriangle size={40} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
              Remove Item?
            </DialogTitle>
            <DialogDescription className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mt-4">
              Are you sure you want to delete{" "}
              <span className="text-slate-900">{deleteItem?.name}</span>? <br />
              This action is permanent.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-8">
            <Button
              className="rounded-2xl cursor-pointer w-full h-14 bg-[#FF1F57] hover:bg-rose-600 text-white font-black italic tracking-tight shadow-xl shadow-rose-200 transition-all active:scale-95"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "CONFIRM DELETE"
              )}
            </Button>

            <Button
              variant="ghost"
              className="rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-slate-300 hover:text-slate-500 hover:bg-transparent"
              onClick={() => setIsDeleteOpen(false)}
            >
              Go Back
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
