"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const userData = await login(values.email, values.password);
      toast.success("Login successful!", {
        description: "Welcome back to ArtBook!",
      });

      if (userData?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      toast.error("Login failed", {
        description: (error as Error).message,
      });
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gallery-cream">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1577720580479-7d839d829c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gallery-black/50 mix-blend-multiply" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <h1 className="text-5xl font-serif font-black text-white mb-6 uppercase tracking-tight">
            Welcome <span className="italic font-light lowercase text-4xl tracking-normal">back to</span> ArtBook
          </h1>
          <p className="text-lg text-white/90 mb-10 font-medium">
            Continue your journey into the world of extraordinary art.
          </p>
          <div className="flex space-x-3">
            <div className="w-12 h-1 bg-gallery-red"></div>
            <div className="w-3 h-1 bg-white/30"></div>
            <div className="w-3 h-1 bg-white/30"></div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10 border-b border-gallery-charcoal/10 pb-6">
            <h2 className="text-3xl font-serif font-black text-gallery-black uppercase tracking-widest">
              Sign In
            </h2>
            <p className="text-gallery-charcoal/70 mt-3 font-serif italic">
              Access your collection and discover new art
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest font-bold text-gallery-charcoal">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="rounded-none border-gallery-charcoal/30 focus:border-gallery-red focus:ring-0 shadow-none bg-transparent h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs uppercase tracking-widest font-bold text-gallery-charcoal">Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-semibold text-gallery-red hover:text-gallery-black transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="rounded-none border-gallery-charcoal/30 focus:border-gallery-red focus:ring-0 shadow-none bg-transparent h-12 pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="rounded-none border-gallery-charcoal/50 data-[state=checked]:bg-gallery-red data-[state=checked]:border-gallery-red mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none mt-0.5">
                      <FormLabel className="text-sm font-normal text-gallery-charcoal">
                        Remember me for 30 days
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gallery-red text-white hover:bg-gallery-black rounded-none h-14 uppercase tracking-widest font-bold text-xs transition-colors mt-8"
              >
                Sign In <LogIn className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center border-t border-gallery-charcoal/10 pt-6">
            <p className="text-gallery-charcoal/70 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-gallery-red hover:text-gallery-black uppercase tracking-widest text-xs transition-colors ml-1"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
