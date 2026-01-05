/** @format */

import { Request, Response, NextFunction } from "express";
import {
  createKitchen,
  getMyKitchen,
  updateMyKitchen,
  listPendingKitchens,
  approveKitchen,
  toggleKitchenActive,
  listPublicKitchens,
  getKitchenMenu,
} from "./kitchen.service";
import { AuthenticatedRequest } from "../../types/auth-request";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authReq = req as AuthenticatedRequest;

    const result = await createKitchen(authReq.user.userId, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const myKitchen = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authReq = req as AuthenticatedRequest;

    const kitchen = await getMyKitchen(authReq.user.userId);
    res.json({ success: true, data: kitchen });
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authReq = req as AuthenticatedRequest;

    const result = await updateMyKitchen(authReq.user.userId, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: list pending kitchens
 */
export const listPending = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const kitchens = await listPendingKitchens();
    res.json({ success: true, data: kitchens });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: approve kitchen
 */
export const approve = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const kitchen = await approveKitchen(req.params.id);
    res.json({
      success: true,
      message: "Kitchen approved successfully",
      data: kitchen,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: activate / deactivate kitchen
 */
export const toggleActive = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const kitchen = await toggleKitchenActive(req.params.id);
    res.json({
      success: true,
      message: "Kitchen status updated",
      data: kitchen,
    });
  } catch (err) {
    next(err);
  }
};


/**
 * Public: List kitchens
 */
export const listPublic = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const kitchens = await listPublicKitchens();
    res.json({
      success: true,
      data: kitchens,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Public: View kitchen menu
 */
export const viewMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getKitchenMenu(req.params.id);
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
