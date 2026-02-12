import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Star, Check, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Vendor = Tables<"vendors">;

const categories = ["Artisan / Handmade", "Food & Beverages", "Fashion & Accessories", "Books & Media", "Health & Beauty", "Pet Products", "Home & Décor", "Other"];

const emptyVendor = { business_name: "", category: "", description: "", contact_name: "", phone: "", email: "", instagram: "", facebook: "", website: "" };

export default function VendorManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [form, setForm] = useState(emptyVendor);
  const [open, setOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { data: vendors = [], isLoading, error } = useQuery({
    queryKey: ["admin-vendors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vendors").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Vendor[];
    },
    retry: 1,
  });

  const { data: vendorImages = [] } = useQuery({
    queryKey: ["admin-vendor-images"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vendor_images").select("*");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("vendors").update(form).eq("id", editing.id);
        if (error) throw error;
        // Upload new images
        for (const file of imageFiles) {
          const path = `${editing.id}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage.from("vendor-images").upload(path, file);
          if (uploadError) throw uploadError;
          const { data: { publicUrl } } = supabase.storage.from("vendor-images").getPublicUrl(path);
          await supabase.from("vendor_images").insert({ vendor_id: editing.id, image_url: publicUrl });
        }
      } else {
        const { data, error } = await supabase.from("vendors").insert({ ...form, status: "approved" as const }).select().single();
        if (error) throw error;
        for (const file of imageFiles) {
          const path = `${data.id}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage.from("vendor-images").upload(path, file);
          if (uploadError) throw uploadError;
          const { data: urlData } = supabase.storage.from("vendor-images").getPublicUrl(path);
          await supabase.from("vendor_images").insert({ vendor_id: data.id, image_url: urlData.publicUrl });
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-vendors"] });
      qc.invalidateQueries({ queryKey: ["admin-vendor-images"] });
      toast({ title: editing ? "Vendor updated" : "Vendor added" });
      resetForm();
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      const { error } = await supabase.from("vendors").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-vendors"] }); toast({ title: "Status updated" }); },
  });

  const featureMutation = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase.from("vendors").update({ is_featured }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-vendors"] }); toast({ title: "Featured status updated" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vendors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-vendors"] }); toast({ title: "Vendor deleted" }); },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vendor_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-vendor-images"] }); },
  });

  function resetForm() {
    setForm(emptyVendor);
    setEditing(null);
    setImageFiles([]);
    setOpen(false);
  }

  function startEdit(v: Vendor) {
    setEditing(v);
    setForm({ business_name: v.business_name, category: v.category, description: v.description || "", contact_name: v.contact_name || "", phone: v.phone || "", email: v.email || "", instagram: v.instagram || "", facebook: v.facebook || "", website: v.website || "" });
    setImageFiles([]);
    setOpen(true);
  }

  const statusColor = { pending: "bg-yellow-500/20 text-yellow-700", approved: "bg-green-500/20 text-green-700", rejected: "bg-red-500/20 text-red-700" };

  if (isLoading) return <p className="text-muted-foreground">Loading vendors...</p>;
  if (error) return <p className="text-destructive">Failed to load vendors. Please reload the page.</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl">Vendors ({vendors.length})</h2>
        <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); setOpen(o); }}>
          <DialogTrigger asChild><Button className="font-display"><Plus size={16} className="mr-1" /> Add Vendor</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit Vendor" : "Add Vendor"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Business Name *" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Contact Name" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
                <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <div className="grid grid-cols-3 gap-3">
                <Input placeholder="Instagram" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
                <Input placeholder="Facebook" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
                <Input placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>

              {/* Existing images */}
              {editing && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Current Images</p>
                  <div className="flex gap-2 flex-wrap">
                    {vendorImages.filter((vi) => vi.vendor_id === editing.id).map((vi) => (
                      <div key={vi.id} className="relative">
                        <img src={vi.image_url} alt="" className="w-20 h-20 object-cover rounded" />
                        <button onClick={() => deleteImageMutation.mutate(vi.id)} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Product Images (1-2)</label>
                <Input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files || []).slice(0, 2))} />
              </div>

              <Button onClick={() => saveMutation.mutate()} disabled={!form.business_name || saveMutation.isPending} className="w-full font-display">
                {saveMutation.isPending ? "Saving..." : editing ? "Update Vendor" : "Add Vendor"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Category</th><th className="p-3">Status</th><th className="p-3">Featured</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-3 font-medium">{v.business_name}</td>
                <td className="p-3 text-muted-foreground">{v.category}</td>
                <td className="p-3 text-center"><Badge className={statusColor[v.status]}>{v.status}</Badge></td>
                <td className="p-3 text-center">
                  <button onClick={() => featureMutation.mutate({ id: v.id, is_featured: !v.is_featured })}>
                    <Star size={18} className={v.is_featured ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"} />
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex justify-center gap-1">
                    {v.status === "pending" && (
                      <>
                        <Button size="icon" variant="ghost" onClick={() => statusMutation.mutate({ id: v.id, status: "approved" })}><Check size={16} className="text-green-600" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => statusMutation.mutate({ id: v.id, status: "rejected" })}><X size={16} className="text-red-600" /></Button>
                      </>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => startEdit(v)}><Pencil size={16} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(v.id)}><Trash2 size={16} className="text-destructive" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {vendors.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No vendors yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
