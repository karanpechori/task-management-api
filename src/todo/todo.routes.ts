import { Router } from "express";
import todoController from "./todo.controller";
import { verifyBodySchemaMiddleware } from "../shared/middlewares/validate-input";
import { InputTodoSchema } from "./todo.schema";
import { verifyAuthMiddleware } from "../user/user.middleware";

const router = Router();

router.post(
  "/",
  verifyAuthMiddleware,
  verifyBodySchemaMiddleware(InputTodoSchema),
  todoController.create
);
router.get("/", verifyAuthMiddleware, todoController.readAll);
router.get("/:id", verifyAuthMiddleware, todoController.read);
router.put(
  "/:id",
  verifyAuthMiddleware,
  verifyBodySchemaMiddleware(InputTodoSchema.partial()),
  todoController.update
);
router.delete("/:id", verifyAuthMiddleware, todoController.delete);
export default router;
