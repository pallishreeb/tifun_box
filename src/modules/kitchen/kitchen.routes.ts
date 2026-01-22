/** @format */

import { Router } from "express";
import { create, get, update } from "./kitchen.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createKitchenSchema, updateKitchenSchema } from "./kitchen.schema";

const router = Router();

/**
 * @swagger
 * /api/kitchen:
 *   get:
 *     summary: Get kitchen (Public)
 *     tags: [Kitchen]
 */
router.get("/", get);

/**
 * @swagger
 * /api/kitchen:
 *   post:
 *     summary: Create kitchen (Admin only)
 *     tags: [Admin, Kitchen]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  validate(createKitchenSchema),
  create,
);

/**
 * @swagger
 * /api/kitchen:
 *   put:
 *     summary: Update kitchen (Admin only)
 *     tags: [Admin, Kitchen]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  validate(updateKitchenSchema),
  update,
);

export default router;
