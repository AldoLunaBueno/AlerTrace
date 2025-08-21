import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  const { isAuthenticated, logout, isLoading } = useAuth0();

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="fixed top-3 right-3 z-50">
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Cerrar sesión
      </Button>
    </div>
  );
}
