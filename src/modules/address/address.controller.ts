/** @format */

import { Request, Response, NextFunction } from "express";
import * as service from "./address.service";

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await service.createAddress(
      req.user!.userId,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Address added",
      data: address,
    });
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addresses = await service.getMyAddresses(req.user!.userId);
    res.json({ success: true, data: addresses });
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await service.updateAddress(
      req.user!.userId,
      req.params.id,
      req.body,
    );

    res.json({
      success: true,
      message: "Address updated",
      data: address,
    });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.deleteAddress(req.user!.userId, req.params.id);
    res.json({ success: true, message: "Address deleted" });
  } catch (err) {
    next(err);
  }
};
