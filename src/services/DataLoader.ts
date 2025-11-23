import type { Resep } from "../models/Resep.js";
import rawResepData from "../../data/indonesian_food_recipes.json" with { type: "json" };

interface RawResep {
    Title: string;
    Ingredients: string;
    Steps: string;      
    Loves: number;
    URL: string;
    Category: string;

    "Title Cleaned"?: string; 
    "Total Ingredients"?: number;
    "Ingredients Cleaned"?: string;
    "Total Steps"?: number;
}

const rawList: RawResep[] = rawResepData as RawResep[];

const cleanAndSplit = (text: string): string[] => {
    return text.split('\n')
               .map(s => s.trim())
               .filter(s => s.length > 0);
};

export const loadRecipes = (): Resep[] => {
  return rawList.map((item, index) => {
      return {
          id: (index + 1).toString(), 
          nama_resep: item.Title,
          url_sumber: item.URL,
          kategori: item.Category,
          jumlah_suka: item.Loves,
          bahan: cleanAndSplit(item.Ingredients),
          langkah: cleanAndSplit(item.Steps),
      };
  });
};

export const RESEP_LIST: Resep[] = loadRecipes();