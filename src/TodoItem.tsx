import { Trash } from "lucide-react";

type Priority = "Urgente" | "Moyenne" | "Base";

type Todo = {
  id: number;
  text: string;
  priotity: Priority;
};

type Props = {
  todo: Todo;
  onDelete: () => void;
};

const TodoItem = ({ todo, onDelete }: Props) => {
  return (
    <div>
      <li className="p-3 ">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <input type="checkbox" className="checkbox checkbox-primary" />
            <span className="text-md font-bold">
              <span>{todo.text}</span>
              <span
                className={` m-1 badge badge-sm badge-soft ${todo.priotity == "Urgente" ? "badge-error" : todo.priotity == "Moyenne" ? "badge-warning" : "badge-success"}`}
              >
                {todo.priotity}
              </span>
            </span>
          </div>
          <button onClick={onDelete} className="btn btn-sm btn-error btn-soft">
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </li>
    </div>
  );
};

export default TodoItem;
