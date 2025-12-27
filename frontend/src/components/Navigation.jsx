import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Sparkles, Calendar, User, LogOut, LayoutDashboard, Plus } from "lucide-react";

const Navigation = ({ user, onLogout }) => {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Sparkles className="w-6 h-6" />
          <span className="font-serif">SatsangConnect</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/events"
            className="nav-link text-sm font-medium hover:text-primary"
            data-testid="nav-events-link"
          >
            Explore Events
          </Link>

          {user ? (
            <>
              <Link
                to="/create-event"
                className="nav-link text-sm font-medium hover:text-primary flex items-center gap-2"
                data-testid="nav-create-event-link"
              >
                <Plus className="w-4 h-4" />
                Host Event
              </Link>
              <Link
                to="/dashboard"
                className="nav-link text-sm font-medium hover:text-primary"
                data-testid="nav-dashboard-link"
              >
                Dashboard
              </Link>
              <Link
                to="/my-events"
                className="nav-link text-sm font-medium hover:text-primary"
                data-testid="nav-my-events-link"
              >
                My Events
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground" data-testid="user-name">{user.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  data-testid="logout-button"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <Link to="/auth" data-testid="nav-auth-link">
              <Button size="sm" className="btn-primary">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
