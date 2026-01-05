/** @format */

import { Router } from "express";
import {
  create,
  myKitchen,
  update,
  listPending,
  approve,
  toggleActive,
  listPublic,
  viewMenu,
} from "./kitchen.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

/**
 * @swagger
 * /api/kitchens:
 *   get:
 *     summary: List approved kitchens (Public)
 *     tags: [Customer, Kitchen]
 *     responses:
 *       200:
 *         description: List of kitchens
 */
router.get("/", listPublic);

/**
 * @swagger
 * /api/kitchens/{id}/menu:
 *   get:
 *     summary: View kitchen menu (Public)
 *     tags: [Customer, Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kitchen menu
 */
router.get("/:id/menu", viewMenu);

/* ---------- CHEF ---------- */
/**
 * @swagger
 * /api/kitchens:
 *   post:
 *     summary: Create kitchen (Chef only)
 *     tags: [Kitchen]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, city, area]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Home Taste Kitchen
 *               city:
 *                 type: string
 *                 example: Bangalore
 *               area:
 *                 type: string
 *                 example: Whitefield
 *     responses:
 *       200:
 *         description: Kitchen created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       409:
 *         description: Kitchen already exists for this chef
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not a chef)
 */

router.post("/", authMiddleware, requireRole("CHEF"), create);

/**
 * @swagger
 * /api/kitchens/me:
 *   get:
 *     summary: Get my kitchen (Chef only)
 *     tags: [Kitchen]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My kitchen details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Kitchen not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router.get("/me", authMiddleware, requireRole("CHEF"), myKitchen);

/**
 * @swagger
 * /api/kitchens/me:
 *   put:
 *     summary: Update my kitchen (only before approval)
 *     tags: [Kitchen]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               city:
 *                 type: string
 *               area:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kitchen updated successfully
 *       403:
 *         description: Approved kitchen cannot be modified
 *       404:
 *         description: Kitchen not found
 *       401:
 *         description: Unauthorized
 */

router.put("/me", authMiddleware, requireRole("CHEF"), update);

/* ---------- ADMIN ---------- */

/**
 * @swagger
 * /api/kitchens/admin/pending:
 *   get:
 *     summary: List all pending kitchens
 *     description: >
 *       Fetch all kitchens created by chefs that are **not yet approved**.
 *       This endpoint is accessible only to admins.
 *       Admins can review these kitchens before approving or rejecting them.
 *     tags: [Admin, Kitchen]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched pending kitchens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "c1a2b3d4-1234-5678-9999-acde48001122"
 *                       name:
 *                         type: string
 *                         example: "Home Taste Kitchen"
 *                       city:
 *                         type: string
 *                         example: "Bangalore"
 *                       area:
 *                         type: string
 *                         example: "Whitefield"
 *                       isApproved:
 *                         type: boolean
 *                         example: false
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       chef:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "u123-abcd-xyz"
 *                           name:
 *                             type: string
 *                             example: "Chef Ramesh"
 *                           email:
 *                             type: string
 *                             example: "chef@tifunbox.com"
 *                           phone:
 *                             type: string
 *                             example: "9876543210"
 *       401:
 *         description: Unauthorized (Missing or invalid JWT token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Authorization header missing
 *       403:
 *         description: Forbidden (User is not an admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Access denied. Admins only.
 */

router.get("/admin/pending", authMiddleware, requireRole("ADMIN"), listPending);

/**
 * @swagger
 * /api/kitchens/admin/{id}/approve:
 *   patch:
 *     summary: Approve a kitchen (Admin only)
 *     description: >
 *       Approves a kitchen created by a chef.
 *       Once approved, the kitchen becomes eligible to receive orders.
 *     tags: [Admin, Kitchen]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Kitchen ID to approve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kitchen approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kitchen approved successfully
 *                 kitchen:
 *                   type: object
 *       400:
 *         description: Kitchen already approved or invalid ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not an admin)
 */
router.patch(
  "/admin/:id/approve",
  authMiddleware,
  requireRole("ADMIN"),
  approve
);

/**
 * @swagger
 * /api/kitchens/admin/{id}/toggle-active:
 *   patch:
 *     summary: Activate or deactivate a kitchen (Admin only)
 *     description: >
 *       Toggles the active status of a kitchen.
 *       Inactive kitchens will not be visible to customers or receive orders.
 *     tags: [Admin, Kitchen]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Kitchen ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kitchen status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kitchen status updated
 *                 kitchen:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not an admin)
 */
router.patch(
  "/admin/:id/toggle-active",
  authMiddleware,
  requireRole("ADMIN"),
  toggleActive
);

export default router;
