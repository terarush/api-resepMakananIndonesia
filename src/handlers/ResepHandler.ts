// src/handlers/ResepHandler.ts

import type { Resep } from "../models/Resep.js";

/**
 * Normalisasi string untuk pencarian (menghilangkan spasi, mengubah ke lowercase).
 */
const normalizeString = (s: string): string => {
  return s.toLowerCase().trim().replace(/\s/g, "");
};

/**
 * Memisahkan dan menormalisasi input bahan dari string.
 */
const parseInputIngredients = (ingredientsInput: string): string[] => {
  return ingredientsInput
    .split(",")
    .map(normalizeString)
    .filter((b) => b.length > 0);
};

/**
 * Menghitung skor kecocokan untuk satu resep berdasarkan bahan input.
 */
const calculateMatchScore = (
  resep: Resep,
  inputIngredients: string[]
): { score: number; matchCount: number } | null => {
  const normalizedRecipeIngredients = resep.bahan.map(normalizeString);
  let matchCount = 0;

  inputIngredients.forEach((inputBahan) => {
    if (
      normalizedRecipeIngredients.some((resepBahan) =>
        resepBahan.includes(inputBahan)
      )
    ) {
      matchCount++;
    }
  });

  const score = matchCount / inputIngredients.length;
  return score > 0 ? { score, matchCount } : null;
};

/**
 * Mengurutkan hasil pencarian berdasarkan skor dan jumlah suka.
 */
const sortScoredResults = (
  results: { resep: Resep; score: number; matchCount: number }[]
): void => {
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.resep.jumlah_suka - a.resep.jumlah_suka;
  });
};

/**
 * Mencari resep berdasarkan daftar bahan yang dimiliki pengguna.
 * @param allRecipes Daftar semua resep.
 * @param ingredientsInput Bahan yang dicari, dipisahkan koma (e.g., "ayam,bawang,garam").
 * @returns Daftar resep yang paling cocok.
 */
export const searchByIngredients = (
  allRecipes: Resep[],
  ingredientsInput: string
): Resep[] => {
  if (!ingredientsInput) {
    return [];
  }

  const inputIngredients = parseInputIngredients(ingredientsInput);
  if (inputIngredients.length === 0) {
    return [];
  }

  const scoredResults = allRecipes
    .map((resep) => {
      const match = calculateMatchScore(resep, inputIngredients);
      return match ? { resep, ...match } : null;
    })
    .filter((r) => r !== null) as {
    resep: Resep;
    score: number;
    matchCount: number;
  }[];

  sortScoredResults(scoredResults);

  return scoredResults.map((r) => r.resep).slice(0, 50);
};

// Handler untuk filter berdasarkan kategori
export const filterByCategory = (
  allRecipes: Resep[],
  category: string
): Resep[] => {
  const normalizedCategory = normalizeString(category);
  return allRecipes.filter((resep) =>
    normalizeString(resep.kategori).includes(normalizedCategory)
  );
};

/**
 * Mengambil resep acak dari daftar.
 */
export const getRandomRecipe = (allRecipes: Resep[]): Resep | null => {
  if (allRecipes.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * allRecipes.length);
  return allRecipes[randomIndex];
};

/**
 * Mengambil resep populer berdasarkan jumlah suka, dibatasi jumlah.
 */
export const getPopularRecipes = (
  allRecipes: Resep[],
  limit: number = 10
): Resep[] => {
  return allRecipes
    .sort((a, b) => b.jumlah_suka - a.jumlah_suka)
    .slice(0, limit);
};

/**
 * Mengambil daftar semua kategori unik.
 */
export const getAllCategories = (allRecipes: Resep[]): string[] => {
  const categoriesSet = new Set(allRecipes.map((resep) => resep.kategori));
  return Array.from(categoriesSet).sort();
};

/**
 * Menghitung statistik API.
 */
export const getApiStats = (allRecipes: Resep[]) => {
  const totalRecipes = allRecipes.length;
  const categories = getAllCategories(allRecipes);
  const totalCategories = categories.length;
  const totalLikes = allRecipes.reduce(
    (sum, resep) => sum + resep.jumlah_suka,
    0
  );
  const averageLikes =
    totalRecipes > 0 ? Math.round(totalLikes / totalRecipes) : 0;
  const mostPopularCategory =
    categories.length > 0
      ? categories.reduce(
          (maxCat, cat) => {
            const catCount = allRecipes.filter(
              (r) => r.kategori === cat
            ).length;
            return catCount > (maxCat.count || 0)
              ? { cat, count: catCount }
              : maxCat;
          },
          { cat: "", count: 0 }
        ).cat
      : "";

  return {
    totalRecipes,
    totalCategories,
    categories,
    averageLikes,
    mostPopularCategory,
  };
};

/**
 * Filter resep dengan kriteria ganda.
 */
export const filterRecipes = (
  allRecipes: Resep[],
  criteria: { kategori?: string; bahan?: string; minSuka?: number }
): Resep[] => {
  let filtered = [...allRecipes];

  // Filter by kategori
  if (criteria.kategori) {
    filtered = filterByCategory(filtered, criteria.kategori);
  }

  // Filter by bahan (using searchByIngredients logic)
  if (criteria.bahan) {
    const inputIngredients = parseInputIngredients(criteria.bahan);
    if (inputIngredients.length > 0) {
      const scoredResults = filtered
        .map((resep) => {
          const match = calculateMatchScore(resep, inputIngredients);
          return match ? { resep, ...match } : null;
        })
        .filter((r) => r !== null) as {
        resep: Resep;
        score: number;
        matchCount: number;
      }[];

      sortScoredResults(scoredResults);
      filtered = scoredResults.map((r) => r.resep);
    }
  }

  // Filter by min suka
  if (criteria.minSuka !== undefined) {
    filtered = filtered.filter(
      (resep) => resep.jumlah_suka >= criteria.minSuka!
    );
  }

  return filtered;
};
