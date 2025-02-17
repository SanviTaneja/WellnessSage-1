import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/ai-assistant", label: "AI Assistant" },
    { href: "/experts", label: "Experts" },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold">FitYog</span>
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <button
                  className={cn(
                    "text-sm hover:text-primary transition-colors",
                    location === item.href && "text-primary font-medium"
                  )}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">{user.username}</span>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}