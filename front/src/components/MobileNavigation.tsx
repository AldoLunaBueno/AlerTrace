import { BarChart3, Home, List, Shield, FileText, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/roya", icon: Shield, label: "Plaga" },
  { to: "/history", icon: List, label: "Historial" },
  { to: "/farm", icon: MapPin, label: "Finca" },
  { to: "/reports", icon: FileText, label: "Reportes" },
];

export function MobileNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-soft z-50 safe-area-inset-bottom">
      <div className="grid grid-flow-col auto-cols-fr justify-center py-3 px-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center px-2 py-3 rounded-xl transition-all duration-200 min-h-[56px] active:scale-95",
                isActive
                  ? "text-primary bg-primary/15 shadow-sm"
                  : "text-muted-foreground hover:text-primary hover:bg-muted/50"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}