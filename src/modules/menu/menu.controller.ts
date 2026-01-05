/** @format */

import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../types/auth-request";
import { createMenuItem, getMyMenu, toggleMenuItem, updateMenuItem } from "./menu.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const menu = await createMenuItem(authReq.user.userId, req.body);

    res.json({
      success: true,
      message: "Menu item created",
      data: menu,
    });
  } catch (err) {
    next(err);
  }
}

export async function myMenu(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const menu = await getMyMenu(authReq.user.userId);

    res.json({
      success: true,
      data: menu,
    });
  } catch (err) {
    next(err);
  }
}

export async function toggle(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const item = await toggleMenuItem(authReq.user.userId, req.params.id);

    res.json({
      success: true,
      message: "Menu availability updated",
      data: item,
    });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;

    const updatedItem = await updateMenuItem(
      authReq.user.userId,
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Menu item updated successfully",
      data: updatedItem,
    });
  } catch (err) {
    next(err);
  }
}