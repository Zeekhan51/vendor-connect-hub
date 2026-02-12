import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Calendar, Image } from "lucide-react";
import VendorManager from "./VendorManager";
import SponsorManager from "./SponsorManager";
import EventManager from "./EventManager";
import GalleryManager from "./GalleryManager";
import SiteContentEditor from "./SiteContentEditor";

export default function AdminDashboard() {
  const { data: vendorCount } = useQuery({
    queryKey: ["admin-vendor-count"],
    queryFn: async () => {
      const { count } = await supabase.from("vendors").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: pendingVendors } = useQuery({
    queryKey: ["admin-pending-vendors"],
    queryFn: async () => {
      const { count } = await supabase.from("vendors").select("*", { count: "exact", head: true }).eq("status", "pending");
      return count || 0;
    },
  });

  const { data: sponsorCount } = useQuery({
    queryKey: ["admin-sponsor-count"],
    queryFn: async () => {
      const { count } = await supabase.from("sponsors").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: eventCount } = useQuery({
    queryKey: ["admin-event-count"],
    queryFn: async () => {
      const { count } = await supabase.from("events").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: galleryCount } = useQuery({
    queryKey: ["admin-gallery-count"],
    queryFn: async () => {
      const { count } = await supabase.from("gallery_images").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="overview" className="font-display text-xs">Dashboard</TabsTrigger>
        <TabsTrigger value="vendors" className="font-display text-xs">Vendors</TabsTrigger>
        <TabsTrigger value="sponsors" className="font-display text-xs">Sponsors</TabsTrigger>
        <TabsTrigger value="events" className="font-display text-xs">Events</TabsTrigger>
        <TabsTrigger value="gallery" className="font-display text-xs">Gallery</TabsTrigger>
        <TabsTrigger value="content" className="font-display text-xs">Site Content</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vendors</CardTitle>
              <Users size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendorCount ?? 0}</div>
              <p className="text-xs text-muted-foreground">{pendingVendors ?? 0} pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sponsors</CardTitle>
              <Award size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{sponsorCount ?? 0}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{eventCount ?? 0}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gallery</CardTitle>
              <Image size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{galleryCount ?? 0}</div></CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="vendors"><VendorManager /></TabsContent>
      <TabsContent value="sponsors"><SponsorManager /></TabsContent>
      <TabsContent value="events"><EventManager /></TabsContent>
      <TabsContent value="gallery"><GalleryManager /></TabsContent>
      <TabsContent value="content"><SiteContentEditor /></TabsContent>
    </Tabs>
  );
}
