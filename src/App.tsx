import { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import { Construction } from "lucide-react";

type Priority = "Urgente" | "Moyenne" | "Base";

type Todo = {
  id: number;
  text: string;
  priotity: Priority;
};

function App() {
  const [input, setInput] = useState("");
  const [priotity, setPriority] = useState<Priority>("Moyenne");
  const savetodos = localStorage.getItem("todos");
  const initialetodos = savetodos ? JSON.parse(savetodos) : [];
  const [todos, setTodos] = useState<Todo[]>(initialetodos);
  const [filtre, setFiltre] = useState<Priority | "tous">("tous");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addtodo() {
    if (input.trim().length == 0) {
      return;
    }
    const newTodo: Todo = {
      id: Date.now() as number,
      text: input.trim(),
      priotity: priotity,
    };
    const newTodos = [newTodo, ...todos];
    setTodos(newTodos);
    setInput("");
    setPriority("Moyenne");
  }

  let filtreTodos: Todo[] = [];
  if (filtre === "tous") {
    filtreTodos = todos;
  } else {
    filtreTodos = todos.filter((todo) => todo.priotity == filtre);
  }

  let Ugentcount = todos.filter((t) => t.priotity == "Urgente").length;
  let Mediumcount = todos.filter((t) => t.priotity == "Moyenne").length;
  let Lowcount = todos.filter((t) => t.priotity == "Base").length;
  let totalcount = todos.length;

  function deletetodo(id: number) {
    const suptodo = todos.filter((t) => t.id != id);
    setTodos(suptodo);
  }

  return (
    <>
      <div className="">
        <div className="flex justify-center">
          <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2x1">
            <div className="flex gap-4">
              <input
                type="text"
                className="input w-full"
                placeholder="ajouter une tache"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <select
                className="select w-full"
                value={priotity}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="Urgente">Urgente</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Base">Base</option>
              </select>
              <button onClick={addtodo} className="btn btn-primary">
                ajouter
              </button>
            </div>
            <div className="space-y-2 flex-1 h-fit">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setFiltre("tous")}
                  className={`btn btn-soft ${filtre === "tous" ? "btn-primary" : ""}`}
                >
                  Tous {totalcount}
                </button>
                <button
                  onClick={() => setFiltre("Urgente")}
                  className={`btn btn-soft ${filtre === "Urgente" ? "btn-primary" : ""}`}
                >
                  Urgente {Ugentcount}
                </button>
                <button
                  onClick={() => setFiltre("Moyenne")}
                  className={`btn btn-soft ${filtre === "Moyenne" ? "btn-primary" : ""}`}
                >
                  Moyenne {Mediumcount}
                </button>
                <button
                  onClick={() => setFiltre("Base")}
                  className={`btn btn-soft ${filtre === "Base" ? "btn-primary" : ""}`}
                >
                  Basse {Lowcount}
                </button>
              </div>
              {filtreTodos.length > 0 ? (
                <div>
                  <ul className="divide-y divide-primary/20">
                    {filtreTodos.map((todo) => {
                      return (
                        <TodoItem
                          onDelete={() => deletetodo(todo.id)}
                          key={todo.id}
                          todo={todo}
                        />
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="flex justify-center items-center flex-col p-5">
                  <div>
                    <Construction className="w-40 h-40 text-primary" />
                  </div>
                  <div>
                    <p>Aucune tache pour se filtre</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
