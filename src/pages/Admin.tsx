import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Lock, LayoutDashboard } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});

const ADMIN_EMAIL = "info@zeedigitalsolutions.com";
const ADMIN_PASSWORD = "Care@2019";

const Admin = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    if (data.email === ADMIN_EMAIL && data.password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Invalid email or password");
    }
  };

  if (loggedIn) {
    return (
      <Layout>
        <section className="py-20 bg-background">
          <div className="container max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <LayoutDashboard size={32} className="text-primary" />
              <h1 className="font-display text-4xl text-foreground">ADMIN DASHBOARD</h1>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {["Manage Vendors", "Manage Sponsors", "Manage Events"].map((item) => (
                <div key={item} className="bg-card border border-border rounded-lg p-6 text-center">
                  <h3 className="font-display text-xl text-foreground mb-2">{item}</h3>
                  <p className="text-sm text-muted-foreground">Coming soon with Lovable Cloud</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline" onClick={() => setLoggedIn(false)} className="font-display tracking-wider">
                Logout
              </Button>
            </div>
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="admin@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full font-display text-lg tracking-wider">Login</Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
