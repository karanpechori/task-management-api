import { Router } from "express";
import { verifyAuthMiddleware } from "./user.middleware";
import userController from "./user.controller";
import { verifyBodySchemaMiddleware } from "../shared/middlewares/validate-input";
import { InputUserSchema } from "./user.schema";

const router = Router();

router.get("/", verifyAuthMiddleware, userController.read);
router.post(
  "/",
  verifyBodySchemaMiddleware(InputUserSchema),
  userController.create
);

export default router;
