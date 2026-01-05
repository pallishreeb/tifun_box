/** @format */
import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const createMenuItem = async (
  chefId: string,
  data: {
    name: string;
    description?: string;
    price: number;
    tiffinSize: "HALF" | "FULL";
    imageUrl?: string;
  }
) => {
  const kitchen = await prisma.kitchen.findFirst({
    where: {
      chefId,
      isApproved: true,
      isActive: true,
    },
  });

  if (!kitchen) {
    throw new ApiError("Approved kitchen not found", 403);
  }



  return prisma.menuItem.create({
    data: {
      kitchenId: kitchen.id,
      name: data.name,
      description: data.description,
      price: data.price,
      tiffinSize: data.tiffinSize,
      imageUrl: data.imageUrl,
    },
  });
};

export const getMyMenu = async (chefId: string) => {
  const kitchen = await prisma.kitchen.findFirst({
    where: { chefId },
  });

  if (!kitchen) {
    throw new ApiError("Kitchen not found", 404);
  }

  return prisma.menuItem.findMany({
    where: { kitchenId: kitchen.id },
    orderBy: { createdAt: "desc" },
  });
};

export const toggleMenuItem = async (chefId: string, menuItemId: string) => {
  const menuItem = await prisma.menuItem.findUnique({
    where: { id: menuItemId },
    include: { kitchen: true },
  });

  if (!menuItem || menuItem.kitchen.chefId !== chefId) {
    throw new ApiError("Menu item not found", 404);
  }

  return prisma.menuItem.update({
    where: { id: menuItemId },
    data: { isAvailable: !menuItem.isAvailable },
  });
};

export const updateMenuItem = async (
  chefId: string,
  menuItemId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    tiffinSize?: "HALF" | "FULL";
    imageUrl?: string;
    isAvailable?: boolean;
  }
) => {
  const menuItem = await prisma.menuItem.findUnique({
    where: { id: menuItemId },
    include: { kitchen: true },
  });

  if (!menuItem) {
    throw new ApiError("Menu item not found", 404);
  }

  if (menuItem.kitchen.chefId !== chefId) {
    throw new ApiError("You are not allowed to update this menu item", 403);
  }

  if (!menuItem.kitchen.isApproved) {
    throw new ApiError("Kitchen is not approved yet", 400);
  }

  return prisma.menuItem.update({
    where: { id: menuItemId },
    data: {
      name: data.name ?? menuItem.name,
      description: data.description ?? menuItem.description,
      price: data.price ?? menuItem.price,
      tiffinSize: data.tiffinSize ?? menuItem.tiffinSize,
      imageUrl: data.imageUrl ?? menuItem.imageUrl,
      isAvailable: data.isAvailable ?? menuItem.isAvailable,
    },
  });
};
