import prisma from "../../config/prisma";
import { ApiError } from "../../utils/api-error";

export const createCategory = async (data: {
  name: string;
  imageUrl?: string;
}) => {
  const exists = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (exists) throw new ApiError("Category already exists", 409);

  return prisma.category.create({ data });
};

export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: { createdAt: "asc" },
  });
};
