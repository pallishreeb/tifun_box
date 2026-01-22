/** @format */

import { Router } from "express";
import { viewCart, addItem, updateItem, removeItem } from "./cart.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { addCartItemSchema, updateCartItemSchema } from "./cart.schema";

const router = Router();

router.use(authMiddleware, requireRole("CUSTOMER"));

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: View cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", viewCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 */
router.post("/items", validate(addCartItemSchema), addItem);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 */
router.put("/items/:id", validate(updateCartItemSchema), updateItem);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 */
router.delete("/items/:id", removeItem);

export default router;
