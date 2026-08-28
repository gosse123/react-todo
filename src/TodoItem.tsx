import { memo } from "react";
import { Trash } from "lucide-react";
import type { Todo } from "./types";

type Props = {
  todo: Todo;
  onDelete: () => void;
  onToggle: () => void;
};

const TodoItem = memo(({ todo, onDelete, onToggle }: Props) => {
  return (
    <li className="p-3">
      <div className="flex justify-between items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={todo.completed}
            onChange={onToggle}
          />
          <span className="text-md font-bold">
            <span className={todo.completed ? "line-through opacity-50" : ""}>
              {todo.text}
            </span>
            <span
              className={`m-1 badge badge-sm badge-soft ${
                todo.priority === "Urgente"
                  ? "badge-error"
                  : todo.priority === "Moyenne"
                    ? "badge-warning"
                    : "badge-success"
              }`}
            >
              {todo.priority}
            </span>
          </span>
        </label>
        <button
          onClick={onDelete}
          className="btn btn-sm btn-error btn-soft"
          aria-label={`Supprimer la tache ${todo.text}`}
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
});

TodoItem.displayName = "TodoItem";

export default TodoItem;
