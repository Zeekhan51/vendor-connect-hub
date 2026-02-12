import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

export default function GalleryManager() {
  const qc = useQueryClient();
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_images").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!files) return;
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `${Date.now()}-${file.name}`;
        const { error: uploadErr } = await supabase.storage.from("gallery").upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data } = supabase.storage.from("gallery").getPublicUrl(path);
        await supabase.from("gallery_images").insert({ image_url: data.publicUrl, alt_text: file.name, display_order: images.length + i });
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-gallery"] }); toast({ title: "Images uploaded" }); setFiles(null); setUploading(false); },
    onError: (e: Error) => { toast({ title: "Error", description: e.message, variant: "destructive" }); setUploading(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-gallery"] }); toast({ title: "Image deleted" }); },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading gallery...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl">Gallery ({images.length})</h2>
        <div className="flex gap-2 items-center">
          <Input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} className="max-w-xs" />
          <Button onClick={() => uploadMutation.mutate()} disabled={!files || uploading} className="font-display">
            <Plus size={16} className="mr-1" /> {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group">
            <img src={img.image_url} alt={img.alt_text || ""} className="w-full aspect-square object-cover rounded-lg" />
            <button onClick={() => deleteMutation.mutate(img.id)}
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      {images.length === 0 && <p className="text-center text-muted-foreground p-6">No gallery images yet. Upload some!</p>}
    </div>
  );
}
