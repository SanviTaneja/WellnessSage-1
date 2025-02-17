import { Link } from "wouter";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  return (
    <nav className="border-b">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <a className="text-xl font-bold">FitYog</a>
          </Link>
          <Link href="/dashboard">
            <a className="text-sm">Dashboard</a>
          </Link>
          <Link href="/ai-assistant">
            <a className="text-sm">AI Assistant</a>
          </Link>
          <Link href="/experts">
            <a className="text-sm">Experts</a>
          </Link>
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