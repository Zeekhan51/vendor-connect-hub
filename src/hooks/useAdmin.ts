import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAdmin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async (userId: string) => {
      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin");
        return !!(data && data.length > 0);
      } catch {
        return false;
      }
    };

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const admin = await checkAdmin(u.id);
        if (isMounted) setIsAdmin(admin);
      }
      if (isMounted) setLoading(false);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    // Listen for auth changes after initial load
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const admin = await checkAdmin(u.id);
        if (isMounted) setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
      if (isMounted) setLoading(false);
    });

    // Safety timeout - never stay loading forever
    const timeout = setTimeout(() => {
      if (isMounted && loading) setLoading(false);
    }, 5000);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, isAdmin, loading, signIn, signOut };
}
