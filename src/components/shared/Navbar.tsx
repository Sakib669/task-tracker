"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Sun, Moon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { data: session } = useSession();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    setMounted(true);
    setIsDark(theme === "dark");
  }, [theme]);

  // You can later update pageTitle based on the current route using usePathname()
  // For now it's static.

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    setIsDark(!isDark);
  };

  if (!mounted) return null;

  const isPremium = session?.user?.status === "PREMIUM";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/80 dark:border-slate-800 px-6 lg:px-8">
      {/* Page Title on left */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-3">
        {isPremium && (
          <Badge
            variant="outline"
            className="hidden sm:flex gap-1 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-indigo-800"
          >
            <Sparkles className="h-3 w-3 text-indigo-600" />
            <span className="text-xs">Premium</span>
          </Badge>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="relative h-9 w-9"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDark ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </motion.div>
        </Button>
      </div>
    </header>
  );
}
