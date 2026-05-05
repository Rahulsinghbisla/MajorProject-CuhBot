import React from 'react';
import Link from 'next/link';
import { Home, Bot, MoreVertical, Settings } from 'lucide-react';

// shadcn components
import { Button } from "@/components/ui/button";


const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* --- LEFT: Home Button --- */}
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-primary">
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline-block font-medium">Home</span>
            </Link>
          </Button>
        </div>

        {/* --- CENTER: Chatbot Details --- */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary shadow-sm">
            <Bot size={20} />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-sm font-bold text-foreground leading-none">CuhBot</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">Online & Ready</span>
            </div>
          </div>
        </div>

        {/* --- RIGHT: Actions --- */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground md:hidden">
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">More options</span>
          </Button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;