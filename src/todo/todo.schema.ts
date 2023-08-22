import { z } from "zod";

export const InputTodoSchema = z.object({
  title: z.string().nonempty(),
  isCompleted: z.boolean().optional(),
});
