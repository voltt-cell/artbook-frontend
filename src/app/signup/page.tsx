"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";

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
import { useRouter } from "next/navigation";

const signupSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signup } = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  async function onSubmit(values: SignupFormValues) {
    try {
      await signup({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      toast.success("Account created successfully!", {
        description: "Welcome to ArtBook!",
      });

      router.push("/");
    } catch (error) {
      toast.error("Signup failed", {
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
              "url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gallery-black/60 mix-blend-multiply" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <h1 className="text-5xl font-serif font-black text-white mb-6 uppercase tracking-tight">
            Join <span className="italic font-light lowercase text-4xl tracking-normal">our</span> Community
          </h1>
          <p className="text-lg text-white/90 mb-10 font-medium max-w-md">
            Discover extraordinary art, connect with creators, and build your
            collection. Want to sell? Open a shop anytime from your profile.
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
              Create Account
            </h2>
            <p className="text-gallery-charcoal/70 mt-3 font-serif italic">
              Start your artistic journey with us
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest font-bold text-gallery-charcoal">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" className="rounded-none border-gallery-charcoal/30 focus:border-gallery-red focus:ring-0 shadow-none bg-transparent h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormLabel className="text-xs uppercase tracking-widest font-bold text-gallery-charcoal">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
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
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="rounded-none border-gallery-charcoal/50 data-[state=checked]:bg-gallery-red data-[state=checked]:border-gallery-red"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal text-gallery-charcoal">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="font-semibold text-gallery-red hover:text-gallery-black transition-colors"
                        >
                          terms of service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="font-semibold text-gallery-red hover:text-gallery-black transition-colors"
                        >
                          privacy policy
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gallery-red text-white hover:bg-gallery-black rounded-none h-14 uppercase tracking-widest font-bold text-xs transition-colors mt-8"
              >
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center border-t border-gallery-charcoal/10 pt-6">
            <p className="text-gallery-charcoal/70 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-gallery-red hover:text-gallery-black uppercase tracking-widest text-xs transition-colors ml-1"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
