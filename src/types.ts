export type Priority = "Urgente" | "Moyenne" | "Base";

export type Todo = {
  id: string;
  user_id: string;
  text: string;
  priority: Priority;
  completed: boolean;
  created_at: string;
};
