import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-900 via-green-700 to-emerald-500">
      {/* Header */}
      <header className="flex flex-col items-center justify-center flex-1 text-white text-center px-6">
        <img
          src="logo_sq1.png"
          alt="Logo TARPUQKUNA"
          className="w-20 h-20 mb-4 rounded-lg shadow-lg bg-white/10 p-2 backdrop-blur-sm"
        />
        <h1 className="text-3xl font-bold tracking-wide drop-shadow-lg">
          TARPUQKUNA
        </h1>
        <h2 className="text-lg font-medium opacity-90 mt-2">
          Bienvenido
        </h2>
      </header>

      {/* Login Card */}
      <main className="flex justify-center pb-20">
        <div className="bg-white/90 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Inicia sesión
          </h1>
          <Button
            className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-700 transition-colors"
            size="lg"
            onClick={() =>
              loginWithRedirect({ appState: { returnTo: from } })
            }
            disabled={isLoading}
          >
            🚀 Entrar al dashboard
          </Button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Serás redirigido al panel tras iniciar sesión correctamente.
          </p>
        </div>
      </main>
    </div>
  );
}

