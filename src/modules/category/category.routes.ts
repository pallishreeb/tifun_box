import { Router } from "express";
import { create, list } from "./category.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createCategorySchema } from "./category.schema";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  validate(createCategorySchema),
  create,
);

router.get("/", list);

export default router;
