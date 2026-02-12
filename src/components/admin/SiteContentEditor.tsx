import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

export default function SiteContentEditor() {
  const qc = useQueryClient();

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ["admin-site-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error;
      return data;
    },
  });

  const [edits, setEdits] = useState<Record<string, { title: string; subtitle: string; content: string }>>({});

  useEffect(() => {
    if (sections.length > 0 && Object.keys(edits).length === 0) {
      const init: Record<string, { title: string; subtitle: string; content: string }> = {};
      sections.forEach((s) => {
        init[s.section_key] = {
          title: s.title || "",
          subtitle: s.subtitle || "",
          content: JSON.stringify(s.content, null, 2),
        };
      });
      setEdits(init);
    }
  }, [sections]);

  const saveMutation = useMutation({
    mutationFn: async (sectionKey: string) => {
      const edit = edits[sectionKey];
      let parsedContent: Json;
      try {
        parsedContent = JSON.parse(edit.content);
      } catch {
        throw new Error("Invalid JSON content");
      }
      const { error } = await supabase.from("site_content").update({ title: edit.title, subtitle: edit.subtitle, content: parsedContent }).eq("section_key", sectionKey);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-site-content"] }); toast({ title: "Content saved" }); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const sectionLabels: Record<string, string> = {
    hero: "🏠 Hero Section",
    vendor_benefits: "🛍️ Vendor Benefits",
    sponsor_benefits: "🏆 Sponsor Benefits & Tiers",
    featured_vendor_benefits: "⭐ Featured Vendor Benefits",
    raffle: "🎟️ Raffle Section",
    contact: "📞 Contact Info",
  };

  if (isLoading) return <p className="text-muted-foreground">Loading content...</p>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl">Site Content</h2>
      <p className="text-sm text-muted-foreground">Edit homepage sections. Content field uses JSON format.</p>

      {sections.map((s) => {
        const edit = edits[s.section_key];
        if (!edit) return null;
        return (
          <div key={s.section_key} className="border rounded-lg p-4 space-y-3">
            <h3 className="font-display text-lg">{sectionLabels[s.section_key] || s.section_key}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input value={edit.title} onChange={(e) => setEdits({ ...edits, [s.section_key]: { ...edit, title: e.target.value } })} />
              </div>
              <div>
                <label className="text-sm font-medium">Subtitle</label>
                <Input value={edit.subtitle} onChange={(e) => setEdits({ ...edits, [s.section_key]: { ...edit, subtitle: e.target.value } })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Content (JSON)</label>
              <Textarea value={edit.content} rows={6} className="font-mono text-xs" onChange={(e) => setEdits({ ...edits, [s.section_key]: { ...edit, content: e.target.value } })} />
            </div>
            <Button onClick={() => saveMutation.mutate(s.section_key)} disabled={saveMutation.isPending} className="font-display">
              <Save size={16} className="mr-1" /> Save {sectionLabels[s.section_key]?.split(" ").slice(1).join(" ") || s.section_key}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
