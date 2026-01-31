/** @format */

import { Router } from "express";
import { create, list, update, remove } from "./address.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  createAddressSchema,
  updateAddressSchema,
} from "./address.schema";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(createAddressSchema), create);
router.get("/", list);
router.put("/:id", validate(updateAddressSchema), update);
router.delete("/:id", remove);

export default router;
