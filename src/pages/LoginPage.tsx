import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-base-300 p-8 rounded-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="floating-label">
            <span>Email</span>
            <input
              type="email"
              className="input w-full"
              placeholder="email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="floating-label">
            <span>Mot de passe</span>
            <input
              type="password"
              className="input w-full"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Pas encore de compte ?{" "}
          <Link to="/register" className="link link-primary">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </main>
  );
}
