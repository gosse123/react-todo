import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md bg-base-300 p-8 rounded-2xl text-center">
          <h1 className="text-2xl font-bold mb-4">Inscription réussie</h1>
          <p className="mb-6">
            Un email de confirmation a été envoyé à <strong>{email}</strong>.
            Vérifiez votre boîte de réception.
          </p>
          <Link to="/login" className="btn btn-primary">
            Retour à la connexion
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-base-300 p-8 rounded-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
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
          <label className="floating-label">
            <span>Confirmer le mot de passe</span>
            <input
              type="password"
              className="input w-full"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "S&apos;inscrire"
            )}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Déjà un compte ?{" "}
          <Link to="/login" className="link link-primary">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
