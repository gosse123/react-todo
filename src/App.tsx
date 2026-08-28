import { useState, useEffect, useMemo, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoItem from "./TodoItem";
import { Construction, LogOut } from "lucide-react";
import { supabase } from "./lib/supabase";
import { useAuth } from "./contexts/AuthContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import type { Priority, Todo } from "./types";

function TodoApp() {
  const { user, signOut } = useAuth();
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("Moyenne");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtre, setFiltre] = useState<Priority | "tous">("tous");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchTodos() {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTodos(data as Todo[]);
      }
      setLoading(false);
    }

    fetchTodos();
  }, [user]);

  const addTodo = useCallback(async () => {
    if (input.trim().length === 0 || !user) return;

    const newTodo = {
      user_id: user.id,
      text: input.trim(),
      priority,
      completed: false,
    };

    const { data, error } = await supabase
      .from("todos")
      .insert(newTodo)
      .select()
      .single();

    if (!error && data) {
      setTodos((prev) => [data as Todo, ...prev]);
      setInput("");
      setPriority("Moyenne");
    }
  }, [input, priority, user]);

  const deleteTodo = useCallback(async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (!error) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  }, []);

  const toggleCompleted = useCallback(async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !completed })
      .eq("id", id);

    if (!error) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    }
  }, []);

  const filtreTodos = useMemo(() => {
    if (filtre === "tous") return todos;
    return todos.filter((todo) => todo.priority === filtre);
  }, [todos, filtre]);

  const urgentCount = useMemo(
    () => todos.filter((t) => t.priority === "Urgente").length,
    [todos]
  );
  const mediumCount = useMemo(
    () => todos.filter((t) => t.priority === "Moyenne").length,
    [todos]
  );
  const lowCount = useMemo(
    () => todos.filter((t) => t.priority === "Base").length,
    [todos]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") addTodo();
    },
    [addTodo]
  );

  return (
    <main>
      <div className="flex justify-center">
        <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Mes taches</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-60">{user?.email}</span>
              <button
                onClick={signOut}
                className="btn btn-sm btn-soft"
                aria-label="Se deconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              className="input w-full"
              placeholder="ajouter une tache"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <select
              className="select w-full"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="Urgente">Urgente</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Base">Base</option>
            </select>
            <button onClick={addTodo} className="btn btn-primary">
              ajouter
            </button>
          </div>
          <div className="space-y-2 flex-1 h-fit">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setFiltre("tous")}
                className={`btn btn-soft ${filtre === "tous" ? "btn-primary" : ""}`}
                aria-pressed={filtre === "tous"}
              >
                Tous {todos.length}
              </button>
              <button
                onClick={() => setFiltre("Urgente")}
                className={`btn btn-soft ${filtre === "Urgente" ? "btn-primary" : ""}`}
                aria-pressed={filtre === "Urgente"}
              >
                Urgente {urgentCount}
              </button>
              <button
                onClick={() => setFiltre("Moyenne")}
                className={`btn btn-soft ${filtre === "Moyenne" ? "btn-primary" : ""}`}
                aria-pressed={filtre === "Moyenne"}
              >
                Moyenne {mediumCount}
              </button>
              <button
                onClick={() => setFiltre("Base")}
                className={`btn btn-soft ${filtre === "Base" ? "btn-primary" : ""}`}
                aria-pressed={filtre === "Base"}
              >
                Basse {lowCount}
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center p-5">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : filtreTodos.length > 0 ? (
              <div>
                <ul className="divide-y divide-primary/20">
                  {filtreTodos.map((todo) => (
                    <TodoItem
                      onDelete={() => deleteTodo(todo.id)}
                      onToggle={() => toggleCompleted(todo.id, todo.completed)}
                      key={todo.id}
                      todo={todo}
                    />
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex justify-center items-center flex-col p-5">
                <Construction className="w-40 h-40 text-primary" />
                <p>Aucune tache pour ce filtre</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TodoApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
