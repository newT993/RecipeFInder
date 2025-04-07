// pages/api/recipes.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Adjust the import path as needed

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // For example, handling a GET request to list recipes
  if (req.method === "GET") {
    try {
      const recipes = await prisma.recipe.findMany();
      return res.status(200).json(recipes);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch recipes" });
    }
  }
  // Add more methods (POST, PUT, DELETE) as needed
  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
