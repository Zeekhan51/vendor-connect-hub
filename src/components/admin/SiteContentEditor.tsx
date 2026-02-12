import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Save, Plus, Trash2 } from "lucide-react";
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

  const saveMutation = useMutation({
    mutationFn: async ({ sectionKey, title, subtitle, content }: { sectionKey: string; title: string; subtitle: string; content: Json }) => {
      const { error } = await supabase.from("site_content").update({ title, subtitle, content }).eq("section_key", sectionKey);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-site-content"] }); toast({ title: "Content saved!" }); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading content...</p>;

  return (
    <div className="space-y-8">
      <h2 className="font-display text-2xl">Site Content</h2>
      <p className="text-sm text-muted-foreground">Edit homepage sections using the fields below. No coding needed!</p>

      {sections.map((s) => {
        switch (s.section_key) {
          case "hero": return <HeroEditor key={s.section_key} section={s} onSave={saveMutation.mutate} isPending={saveMutation.isPending} />;
          case "vendor_benefits": return <BenefitsListEditor key={s.section_key} section={s} label="🛍️ Vendor Benefits" onSave={saveMutation.mutate} isPending={saveMutation.isPending} />;
          case "sponsor_benefits": return <SponsorTiersEditor key={s.section_key} section={s} onSave={saveMutation.mutate} isPending={saveMutation.isPending} />;
          case "featured_vendor_benefits": return <SimpleListEditor key={s.section_key} section={s} label="⭐ Featured Vendor Benefits" fieldName="benefits" onSave={saveMutation.mutate} isPending={saveMutation.isPending} />;
          case "raffle": return <RaffleEditor key={s.section_key} section={s} onSave={saveMutation.mutate} isPending={saveMutation.isPending} />;
          case "contact": return <ContactEditor key={s.section_key} section={s} onSave={saveMutation.mutate} isPending={saveMutation.isPending} />;
          default: return null;
        }
      })}
    </div>
  );
}

function SectionWrapper({ label, children, onSave, isPending }: { label: string; children: React.ReactNode; onSave: () => void; isPending: boolean }) {
  return (
    <div className="border rounded-lg p-5 space-y-4">
      <h3 className="font-display text-lg">{label}</h3>
      {children}
      <Button onClick={onSave} disabled={isPending} className="font-display"><Save size={16} className="mr-1" /> Save</Button>
    </div>
  );
}

function HeroEditor({ section, onSave, isPending }: any) {
  const c = section.content as any || {};
  const [title, setTitle] = useState(section.title || "");
  const [subtitle, setSubtitle] = useState(section.subtitle || "");
  const [ctaText, setCtaText] = useState(c.cta_text || "");
  const [ctaLink, setCtaLink] = useState(c.cta_link || "");

  return (
    <SectionWrapper label="🏠 Hero Section" onSave={() => onSave({ sectionKey: "hero", title, subtitle, content: { cta_text: ctaText, cta_link: ctaLink } })} isPending={isPending}>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium">Title</label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><label className="text-sm font-medium">Subtitle</label><Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></div>
        <div><label className="text-sm font-medium">CTA Button Text</label><Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} /></div>
        <div><label className="text-sm font-medium">CTA Button Link</label><Input value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} /></div>
      </div>
    </SectionWrapper>
  );
}

function BenefitsListEditor({ section, label, onSave, isPending }: any) {
  const c = section.content as any || {};
  const [title, setTitle] = useState(section.title || "");
  const [subtitle, setSubtitle] = useState(section.subtitle || "");
  const [benefits, setBenefits] = useState<{ title: string; desc: string }[]>(c.benefits || []);

  const update = (i: number, field: string, val: string) => {
    const copy = [...benefits];
    (copy[i] as any)[field] = val;
    setBenefits(copy);
  };

  return (
    <SectionWrapper label={label} onSave={() => onSave({ sectionKey: section.section_key, title, subtitle, content: { benefits } })} isPending={isPending}>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium">Section Title</label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><label className="text-sm font-medium">Section Subtitle</label><Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></div>
      </div>
      <div className="space-y-3">
        {benefits.map((b, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input placeholder="Benefit title" value={b.title} onChange={(e) => update(i, "title", e.target.value)} />
              <Input placeholder="Description" value={b.desc} onChange={(e) => update(i, "desc", e.target.value)} />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setBenefits(benefits.filter((_, j) => j !== i))}><Trash2 size={16} /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setBenefits([...benefits, { title: "", desc: "" }])}><Plus size={14} className="mr-1" /> Add Benefit</Button>
      </div>
    </SectionWrapper>
  );
}

function SponsorTiersEditor({ section, onSave, isPending }: any) {
  const c = section.content as any || {};
  const [title, setTitle] = useState(section.title || "");
  const [subtitle, setSubtitle] = useState(section.subtitle || "");
  const [gold, setGold] = useState<string[]>(c.gold || []);
  const [silver, setSilver] = useState<string[]>(c.silver || []);
  const [bronze, setBronze] = useState<string[]>(c.bronze || []);

  const renderTier = (name: string, perks: string[], setPerks: (v: string[]) => void) => (
    <div className="space-y-2">
      <h4 className="font-display text-base">{name} Tier</h4>
      {perks.map((p, i) => (
        <div key={i} className="flex gap-2">
          <Input value={p} onChange={(e) => { const copy = [...perks]; copy[i] = e.target.value; setPerks(copy); }} />
          <Button variant="ghost" size="icon" onClick={() => setPerks(perks.filter((_, j) => j !== i))}><Trash2 size={16} /></Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => setPerks([...perks, ""])}><Plus size={14} className="mr-1" /> Add Perk</Button>
    </div>
  );

  return (
    <SectionWrapper label="🏆 Sponsor Benefits & Tiers" onSave={() => onSave({ sectionKey: "sponsor_benefits", title, subtitle, content: { gold, silver, bronze } })} isPending={isPending}>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium">Section Title</label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><label className="text-sm font-medium">Section Subtitle</label><Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {renderTier("🥇 Gold", gold, setGold)}
        {renderTier("🥈 Silver", silver, setSilver)}
        {renderTier("🥉 Bronze", bronze, setBronze)}
      </div>
    </SectionWrapper>
  );
}

function SimpleListEditor({ section, label, fieldName, onSave, isPending }: any) {
  const c = section.content as any || {};
  const [title, setTitle] = useState(section.title || "");
  const [subtitle, setSubtitle] = useState(section.subtitle || "");
  const [items, setItems] = useState<string[]>(c[fieldName] || []);

  return (
    <SectionWrapper label={label} onSave={() => onSave({ sectionKey: section.section_key, title, subtitle, content: { [fieldName]: items } })} isPending={isPending}>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium">Section Title</label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><label className="text-sm font-medium">Section Subtitle</label><Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></div>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input value={item} onChange={(e) => { const copy = [...items]; copy[i] = e.target.value; setItems(copy); }} />
            <Button variant="ghost" size="icon" onClick={() => setItems(items.filter((_, j) => j !== i))}><Trash2 size={16} /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setItems([...items, ""])}><Plus size={14} className="mr-1" /> Add Item</Button>
      </div>
    </SectionWrapper>
  );
}

function RaffleEditor({ section, onSave, isPending }: any) {
  const c = section.content as any || {};
  const [title, setTitle] = useState(section.title || "");
  const [subtitle, setSubtitle] = useState(section.subtitle || "");
  const [description, setDescription] = useState(c.description || "");

  return (
    <SectionWrapper label="🎟️ Raffle Section" onSave={() => onSave({ sectionKey: "raffle", title, subtitle, content: { description } })} isPending={isPending}>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium">Title</label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><label className="text-sm font-medium">Subtitle</label><Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></div>
      </div>
      <div><label className="text-sm font-medium">Description</label><Textarea value={description} rows={3} onChange={(e) => setDescription(e.target.value)} /></div>
    </SectionWrapper>
  );
}

function ContactEditor({ section, onSave, isPending }: any) {
  const c = section.content as any || {};
  const [title, setTitle] = useState(section.title || "");
  const [subtitle, setSubtitle] = useState(section.subtitle || "");
  const [phone, setPhone] = useState(c.phone || "");
  const [email, setEmail] = useState(c.email || "");
  const [instagram, setInstagram] = useState(c.instagram || "");
  const [facebook, setFacebook] = useState(c.facebook || "");

  return (
    <SectionWrapper label="📞 Contact Info" onSave={() => onSave({ sectionKey: "contact", title, subtitle, content: { phone, email, instagram, facebook } })} isPending={isPending}>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium">Section Title</label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><label className="text-sm font-medium">Section Subtitle</label><Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></div>
        <div><label className="text-sm font-medium">Phone</label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        <div><label className="text-sm font-medium">Email</label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><label className="text-sm font-medium">Instagram Handle</label><Input value={instagram} onChange={(e) => setInstagram(e.target.value)} /></div>
        <div><label className="text-sm font-medium">Facebook URL</label><Input value={facebook} onChange={(e) => setFacebook(e.target.value)} /></div>
      </div>
    </SectionWrapper>
  );
}
