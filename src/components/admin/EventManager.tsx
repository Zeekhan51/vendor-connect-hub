import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Archive } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

const emptyEvent = { title: "", date: "", time_start: "9:00 AM", time_end: "3:00 PM", venue: "The MilliUp Event Center", address: "210 E. Trade Street # C-244 (Second Floor), Charlotte NC 28202", description: "", ticket_link: "" };

export default function EventManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState(emptyEvent);
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true });
      if (error) throw error;
      return data as Event[];
    },
    retry: 1,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      let image_url = editing?.image_url || "";
      if (imageFile) {
        const path = `${Date.now()}-${imageFile.name}`;
        const { error: uploadErr } = await supabase.storage.from("event-images").upload(path, imageFile);
        if (uploadErr) throw uploadErr;
        const { data } = supabase.storage.from("event-images").getPublicUrl(path);
        image_url = data.publicUrl;
      }

      if (editing) {
        const { error } = await supabase.from("events").update({ ...form, image_url }).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert({ ...form, image_url });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-events"] }); toast({ title: editing ? "Event updated" : "Event added" }); resetForm(); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const pastMutation = useMutation({
    mutationFn: async ({ id, is_past }: { id: string; is_past: boolean }) => {
      const { error } = await supabase.from("events").update({ is_past }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-events"] }); toast({ title: "Updated" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-events"] }); toast({ title: "Event deleted" }); },
  });

  function resetForm() { setForm(emptyEvent); setEditing(null); setImageFile(null); setOpen(false); }

  function startEdit(e: Event) {
    setEditing(e);
    setForm({ title: e.title, date: e.date, time_start: e.time_start || "9:00 AM", time_end: e.time_end || "3:00 PM", venue: e.venue || "", address: e.address || "", description: e.description || "", ticket_link: e.ticket_link || "" });
    setImageFile(null);
    setOpen(true);
  }

  if (isLoading) return <p className="text-muted-foreground">Loading events...</p>;
  if (error) return <p className="text-destructive">Failed to load events. Please reload the page.</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl">Events ({events.length})</h2>
        <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); setOpen(o); }}>
          <DialogTrigger asChild><Button className="font-display"><Plus size={16} className="mr-1" /> Add Event</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit Event" : "Add Event"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Event Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Start Time" value={form.time_start} onChange={(e) => setForm({ ...form, time_start: e.target.value })} />
                <Input placeholder="End Time" value={form.time_end} onChange={(e) => setForm({ ...form, time_end: e.target.value })} />
              </div>
              <Input placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
              <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Ticket Link" value={form.ticket_link} onChange={(e) => setForm({ ...form, ticket_link: e.target.value })} />
              {editing?.image_url && <img src={editing.image_url} alt="" className="w-full h-32 object-cover rounded" />}
              <div>
                <label className="text-sm font-medium">Event Image (vertical)</label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>
              <Button onClick={() => saveMutation.mutate()} disabled={!form.title || !form.date || saveMutation.isPending} className="w-full font-display">
                {saveMutation.isPending ? "Saving..." : editing ? "Update Event" : "Add Event"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {events.map((e) => (
          <div key={e.id} className={`flex items-center gap-4 p-4 border rounded-lg ${e.is_past ? "opacity-50" : ""}`}>
            {e.image_url && <img src={e.image_url} alt="" className="w-16 h-20 object-cover rounded" />}
            <div className="flex-1">
              <h3 className="font-display text-lg">{e.title}</h3>
              <p className="text-sm text-muted-foreground">{new Date(e.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} • {e.time_start} - {e.time_end}</p>
            </div>
            {e.is_past && <Badge variant="secondary">Past</Badge>}
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => pastMutation.mutate({ id: e.id, is_past: !e.is_past })}><Archive size={16} /></Button>
              <Button size="icon" variant="ghost" onClick={() => startEdit(e)}><Pencil size={16} /></Button>
              <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(e.id)}><Trash2 size={16} className="text-destructive" /></Button>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-center text-muted-foreground p-6">No events yet</p>}
      </div>
    </div>
  );
}
