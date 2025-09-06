import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthValues = z.infer<typeof authSchema>;

const Auth = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Redirect away if already signed in
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Redirect to home when authenticated
        window.location.href = "/";
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        window.location.href = "/";
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const formLogin = useForm<AuthValues>({ resolver: zodResolver(authSchema), defaultValues: { email: "", password: "" } });
  const formSignup = useForm<AuthValues>({ resolver: zodResolver(authSchema), defaultValues: { email: "", password: "" } });

  const handleLogin = async (values: AuthValues) => {
    setLoading(true);
    try {
      cleanupAuthState();
      try { await supabase.auth.signOut({ scope: 'global' }); } catch(_) {}

      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
      toast({ title: "Welcome back", description: "Signing you in..." });
      // Force refresh ensures clean state everywhere
      window.location.href = "/";
    } catch (err: any) {
      toast({ title: "Login failed", description: err?.message || "Please try again", });
    } finally { setLoading(false); }
  };

  const handleSignup = async (values: AuthValues) => {
    setLoading(true);
    try {
      cleanupAuthState();
      try { await supabase.auth.signOut({ scope: 'global' }); } catch(_) {}

      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: { emailRedirectTo: redirectUrl },
      });
      if (error) throw error;
      toast({ title: "Check your email", description: "Confirm your email to complete signup." });
    } catch (err: any) {
      toast({ title: "Signup failed", description: err?.message || "Please try again" });
    } finally { setLoading(false); }
  };

  useEffect(() => {
    document.title = "Sign in — TravelPerk Pro";
  }, []);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Sign in — TravelPerk Pro',
    url: `${window.location.origin}/auth`,
    description: 'Login or create your TravelPerk Pro account.',
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body flex flex-col">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <nav className="container flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">TravelPerk Pro</span>
          </a>
          <a href="/" className="story-link text-sm">Back to site</a>
        </nav>
      </header>

      <main className="flex-1 grid place-items-center px-4 py-12">
        <div className="w-full max-w-md panel-glass rounded-3xl p-6 md:p-8 shadow-elevated animate-enter">
          <div className="text-center space-y-2 mb-6">
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold">Welcome</h1>
            <p className="text-muted-foreground text-sm">Login or create your account</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <Form {...formLogin}>
                <form onSubmit={formLogin.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField control={formLogin.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@company.com" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={formLogin.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">Minimum 6 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button disabled={loading} className="w-full" variant="hero" type="submit">
                    {loading ? 'Signing in…' : 'Sign in'}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <Form {...formSignup}>
                <form onSubmit={formSignup.handleSubmit(handleSignup)} className="space-y-4">
                  <FormField control={formSignup.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@company.com" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={formSignup.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Create a password" autoComplete="new-password" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">At least 6 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button disabled={loading} className="w-full" variant="hero" type="submit">
                    {loading ? 'Creating account…' : 'Create account'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="container py-6 text-center text-xs text-muted-foreground">
        Protected by secure authentication. By continuing you agree to our terms.
      </footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
};

export default Auth;
