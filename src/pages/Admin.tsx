import { useState, Component, ReactNode } from "react";
import { motion } from "framer-motion";
import { Lock, LayoutDashboard, Loader2, AlertTriangle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/hooks/useAdmin";
import AdminDashboard from "@/components/admin/AdminDashboard";

class AdminErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <Layout>
          <section className="py-20 bg-background">
            <div className="container max-w-md text-center">
              <AlertTriangle size={40} className="mx-auto text-destructive mb-4" />
              <h1 className="font-display text-3xl text-foreground mb-2">SOMETHING WENT WRONG</h1>
              <p className="text-muted-foreground mb-4">An error occurred loading this page.</p>
              <Button variant="outline" onClick={() => window.location.reload()} className="font-display">Reload Page</Button>
            </div>
          </section>
        </Layout>
      );
    }
    return this.props.children;
  }
}

const Admin = () => {
  const { user, isAdmin, loading, signIn, signOut } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const err = await signIn(email, password);
    if (err) setError(err.message);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>
      </Layout>
    );
  }

  if (user && isAdmin) {
    return (
      <Layout>
        <section className="py-10 bg-background min-h-screen">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <LayoutDashboard size={32} className="text-primary" />
                <h1 className="font-display text-3xl text-foreground">ADMIN DASHBOARD</h1>
              </div>
              <Button variant="outline" onClick={signOut} className="font-display">Logout</Button>
            </div>
            <AdminDashboard />
          </div>
        </section>
      </Layout>
    );
  }

  if (user && !isAdmin) {
    return (
      <Layout>
        <section className="py-20 bg-background">
          <div className="container max-w-md text-center">
            <Lock size={40} className="mx-auto text-destructive mb-4" />
            <h1 className="font-display text-3xl text-foreground mb-2">ACCESS DENIED</h1>
            <p className="text-muted-foreground mb-4">This account does not have admin privileges.</p>
            <Button variant="outline" onClick={signOut} className="font-display">Logout</Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20 bg-background">
        <div className="container max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-8">
            <div className="text-center mb-6">
              <Lock size={40} className="mx-auto text-primary mb-3" />
              <h1 className="font-display text-3xl text-foreground">ADMIN LOGIN</h1>
            </div>
            {error && <p className="text-sm text-destructive text-center mb-4">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="admin@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full font-display text-lg tracking-wider" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                Login
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

const AdminWithBoundary = () => (
  <AdminErrorBoundary>
    <Admin />
  </AdminErrorBoundary>
);

export default AdminWithBoundary;
