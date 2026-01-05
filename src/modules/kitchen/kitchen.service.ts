/** @format */

import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

/**
 * Create kitchen (one per chef)
 */
export const createKitchen = async (
  chefId: string,
  data: {
    name: string;
    city: string;
    area: string;
  }
) => {
  const existing = await prisma.kitchen.findFirst({
    where: { chefId },
  });

  if (existing) {
    throw new ApiError("Kitchen already exists for this chef", 409);
  }

  const kitchen = await prisma.kitchen.create({
    data: {
      chefId,
      name: data.name,
      city: data.city,
      area: data.area,
    },
  });

  return {
    message: "Kitchen created successfully. Awaiting admin approval.",
    kitchen,
  };
};

/**
 * Get logged-in chef's kitchen
 */
export const getMyKitchen = async (chefId: string) => {
  const kitchen = await prisma.kitchen.findFirst({
    where: { chefId },
  });

  if (!kitchen) {
    throw new ApiError("Kitchen not found", 404);
  }

  return kitchen;
};

/**
 * Update logged-in chef's kitchen
 */
export const updateMyKitchen = async (
  chefId: string,
  data: {
    name?: string;
    city?: string;
    area?: string;
    isActive?: boolean;
  }
) => {
  const kitchen = await prisma.kitchen.findFirst({
    where: { chefId },
  });

  if (!kitchen) {
    throw new ApiError("Kitchen not found", 404);
  }

  if (kitchen.isApproved) {
    throw new ApiError("Approved kitchen cannot be modified", 403);
  }

  const updatedKitchen = await prisma.kitchen.update({
    where: { id: kitchen.id },
    data: {
      name: data.name ?? kitchen.name,
      city: data.city ?? kitchen.city,
      area: data.area ?? kitchen.area,
      isActive: data.isActive ?? kitchen.isActive,
    },
  });

  return {
    message: "Kitchen updated successfully",
    kitchen: updatedKitchen,
  };
};

/**
 * Admin: List pending kitchens
 */
export async function listPendingKitchens() {
  return prisma.kitchen.findMany({
    where: { isApproved: false },
    orderBy: { createdAt: "asc" },
    include: {
      chef: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });
}

/**
 * Admin: Approve kitchen
 */
export async function approveKitchen(kitchenId: string) {
  const kitchen = await prisma.kitchen.findUnique({
    where: { id: kitchenId },
  });

  if (!kitchen) {
    throw new ApiError("Kitchen not found", 404);
  }

  if (kitchen.isApproved) {
    throw new ApiError("Kitchen already approved", 400);
  }

  return prisma.kitchen.update({
    where: { id: kitchenId },
    data: { isApproved: true },
  });
}

/**
 * Admin: Activate / Deactivate kitchen
 */
export async function toggleKitchenActive(kitchenId: string) {
  const kitchen = await prisma.kitchen.findUnique({
    where: { id: kitchenId },
  });

  if (!kitchen) {
    throw new ApiError("Kitchen not found", 404);
  }

  return prisma.kitchen.update({
    where: { id: kitchenId },
    data: { isActive: !kitchen.isActive },
  });
}

/**
 * Public: List approved kitchens
 */
export const listPublicKitchens = async () => {
  return prisma.kitchen.findMany({
    where: {
      isApproved: true,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      city: true,
      area: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Public: Get kitchen menu
 */
export const getKitchenMenu = async (kitchenId: string) => {
  const kitchen = await prisma.kitchen.findFirst({
    where: {
      id: kitchenId,
      isApproved: true,
      isActive: true,
    },
  });

  if (!kitchen) {
    throw new ApiError("Kitchen not found", 404);
  }

  const menu = await prisma.menuItem.findMany({
    where: {
      kitchenId,
      isAvailable: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    kitchen,
    menu,
  };
};
