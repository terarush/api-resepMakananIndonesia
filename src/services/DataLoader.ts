import type { Resep } from "../models/Resep.js";
import resepData from "../../data/indonesian_food_recipes.json" with { type: "json" };

export const loadRecipes = (): Resep[] => {
  return resepData as Resep[];
};

export const RESEP_LIST: Resep[] = loadRecipes();

