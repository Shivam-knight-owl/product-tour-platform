"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowRight, Sparkles, LayoutDashboard, Lock, Monitor } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-bold text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            TourFlow
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container flex min-h-screen flex-col items-center justify-center gap-6 pb-8 pt-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Create Interactive
            <span className="text-primary block">Product Tours</span>
            In Minutes
          </h1>
          <p className="mx-auto max-w-[750px] text-muted-foreground sm:text-xl">
            Record your screen, add annotations, and share interactive product tours with your users.
            Make onboarding and feature discovery a breeze.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/auth/signup">
            <Button size="lg" className="min-w-[200px] gap-2">
              Create Your First Tour
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/tour/1">
            <Button size="lg" variant="outline" className="min-w-[200px]">
              View Demo Tour
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need to create amazing product tours
          </h2>
          <p className="text-muted-foreground sm:text-lg">
            Powerful features to help you create, manage, and share product tours effectively
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group rounded-lg border p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-4 mb-3">
                {feature.icon}
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 TourFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Screen Recording",
    description: "Record your screen directly in the browser to capture product workflows with ease.",
    icon: <Monitor className="h-6 w-6 text-primary" />,
  },
  {
    title: "Interactive Dashboard",
    description: "View and manage all your product tours in one place with detailed analytics.",
    icon: <LayoutDashboard className="h-6 w-6 text-primary" />,
  },
  {
    title: "Private Tours",
    description: "Control access to your tours with public and private sharing options.",
    icon: <Lock className="h-6 w-6 text-primary" />,
  },
];
