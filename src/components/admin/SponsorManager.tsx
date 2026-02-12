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
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Sponsor = Tables<"sponsors">;

const emptySponsor = { company_name: "", contact_person: "", email: "", phone: "", tier: "bronze" as "gold" | "silver" | "bronze", message: "" };

export default function SponsorManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [form, setForm] = useState(emptySponsor);
  const [open, setOpen] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const { data: sponsors = [], isLoading, error } = useQuery({
    queryKey: ["admin-sponsors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sponsors").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Sponsor[];
    },
    retry: 1,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      let logo_url = editing?.logo_url || "";
      if (logoFile) {
        const path = `${Date.now()}-${logoFile.name}`;
        const { error: uploadErr } = await supabase.storage.from("sponsor-logos").upload(path, logoFile);
        if (uploadErr) throw uploadErr;
        const { data } = supabase.storage.from("sponsor-logos").getPublicUrl(path);
        logo_url = data.publicUrl;
      }

      if (editing) {
        const { error } = await supabase.from("sponsors").update({ ...form, logo_url }).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("sponsors").insert({ ...form, logo_url, status: "approved" as const });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-sponsors"] }); toast({ title: editing ? "Sponsor updated" : "Sponsor added" }); resetForm(); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      const { error } = await supabase.from("sponsors").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-sponsors"] }); toast({ title: "Status updated" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sponsors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-sponsors"] }); toast({ title: "Sponsor deleted" }); },
  });

  function resetForm() { setForm(emptySponsor); setEditing(null); setLogoFile(null); setOpen(false); }

  function startEdit(s: Sponsor) {
    setEditing(s);
    setForm({ company_name: s.company_name, contact_person: s.contact_person || "", email: s.email || "", phone: s.phone || "", tier: s.tier, message: s.message || "" });
    setLogoFile(null);
    setOpen(true);
  }

  const tierColor = { gold: "bg-yellow-500/20 text-yellow-700", silver: "bg-gray-300/30 text-gray-700", bronze: "bg-orange-500/20 text-orange-700" };
  const statusColor = { pending: "bg-yellow-500/20 text-yellow-700", approved: "bg-green-500/20 text-green-700", rejected: "bg-red-500/20 text-red-700" };

  if (isLoading) return <p className="text-muted-foreground">Loading sponsors...</p>;
  if (error) return <p className="text-destructive">Failed to load sponsors. Please reload the page.</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl">Sponsors ({sponsors.length})</h2>
        <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); setOpen(o); }}>
          <DialogTrigger asChild><Button className="font-display"><Plus size={16} className="mr-1" /> Add Sponsor</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit Sponsor" : "Add Sponsor"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Company Name *" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Contact Person" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
                <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Select value={form.tier} onValueChange={(v: "gold" | "silver" | "bronze") => setForm({ ...form, tier: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gold">🥇 Gold</SelectItem>
                  <SelectItem value="silver">🥈 Silver</SelectItem>
                  <SelectItem value="bronze">🥉 Bronze</SelectItem>
                </SelectContent>
              </Select>
              <Textarea placeholder="Message/Notes" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              {editing?.logo_url && <img src={editing.logo_url} alt="Logo" className="w-20 h-20 object-contain rounded border" />}
              <div>
                <label className="text-sm font-medium">Company Logo</label>
                <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
              </div>
              <Button onClick={() => saveMutation.mutate()} disabled={!form.company_name || saveMutation.isPending} className="w-full font-display">
                {saveMutation.isPending ? "Saving..." : editing ? "Update Sponsor" : "Add Sponsor"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr><th className="p-3 text-left">Company</th><th className="p-3">Tier</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {sponsors.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3 font-medium flex items-center gap-2">
                  {s.logo_url && <img src={s.logo_url} alt="" className="w-8 h-8 object-contain rounded" />}
                  {s.company_name}
                </td>
                <td className="p-3 text-center"><Badge className={tierColor[s.tier]}>{s.tier}</Badge></td>
                <td className="p-3 text-center"><Badge className={statusColor[s.status]}>{s.status}</Badge></td>
                <td className="p-3">
                  <div className="flex justify-center gap-1">
                    {s.status === "pending" && (
                      <>
                        <Button size="icon" variant="ghost" onClick={() => statusMutation.mutate({ id: s.id, status: "approved" })}><Check size={16} className="text-green-600" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => statusMutation.mutate({ id: s.id, status: "rejected" })}><X size={16} className="text-red-600" /></Button>
                      </>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => startEdit(s)}><Pencil size={16} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(s.id)}><Trash2 size={16} className="text-destructive" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {sponsors.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No sponsors yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
