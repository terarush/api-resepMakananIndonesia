import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import { RESEP_LIST } from "./services/DataLoader.js";
import type { ApiResponse, Resep } from "./models/Resep.js";
import { openApiSpec } from "./docs.js";
import {
  searchByIngredients,
  filterByCategory,
  getAllCategories,
  getApiStats,
  getPopularRecipes,
  getRandomRecipe,
  filterRecipes,
} from "./handlers/ResepHandler.js";

const app = new Hono();

// ===================================
// Router Utama
// ===================================

// root
app.get("/", (c) => {
  return c.text("wellcome to api resepmakanan indonesia hehe");
});

// docs
app.get(
  "/docs",
  swaggerUI({
    url: "/docs/spec",
  })
);

// OpenAPI spec
app.get("/docs/spec", (c) => {
  return c.json(openApiSpec);
});

// mengambil daftar semua resep
app.get("/api/v1/resep", (c) => {
  const { kategori, sort_by } = c.req.query();
  let data: Resep[] = [...RESEP_LIST];

  if (kategori) {
    data = filterByCategory(data, kategori);
  }

  if (sort_by === "suka") {
    data.sort((a, b) => b.jumlah_suka - a.jumlah_suka);
  }
  const response: ApiResponse<Resep[]> = {
    success: true,
    count: data.length,
    message: `total length: ${RESEP_LIST.length}. result: ${data.length}`,
    data: data.slice(0, 20),
  };
  return c.json(response);
});

// search by ingredients
app.get("/api/v1/resep/search", (c) => {
  const { ingredients } = c.req.query();
  if (!ingredients) {
    const response: ApiResponse<null> = {
      success: false,
      message: `ingredients not provided.`,
    };
    return c.json(response, 400);
  }

  const result = searchByIngredients(RESEP_LIST, ingredients);

  const response: ApiResponse<Resep[]> = {
    success: true,
    count: result.length,
    message: `resep found by ingredients ${ingredients}.`,
    data: result,
  };
  return c.json(response);
});

// filter by kategori
app.get("/api/v1/resep/kategori", (c) => {
  const { kategori } = c.req.query();
  if (!kategori) {
    const response: ApiResponse<null> = {
      success: false,
      message: `kategori not provided.`,
    };
    return c.json(response, 400);
  }

  const result = filterByCategory(RESEP_LIST, kategori);

  const response: ApiResponse<Resep[]> = {
    success: true,
    count: result.length,
    message: `resep found by kategori ${kategori}.`,
    data: result,
  };
  return c.json(response);
});

// get random resep
app.get("/api/v1/resep/random", (c) => {
  const result = getRandomRecipe(RESEP_LIST);
  if (!result) {
    const response: ApiResponse<null> = {
      success: false,
      message: "No recipes available.",
    };
    return c.json(response, 404);
  }

  const response: ApiResponse<Resep> = {
    success: true,
    message: "Random recipe retrieved.",
    data: result,
  };
  return c.json(response);
});

// get popular resep
app.get("/api/v1/resep/populer", (c) => {
  const limit = parseInt(c.req.query("limit") || "10");
  const result = getPopularRecipes(RESEP_LIST, limit);

  const response: ApiResponse<Resep[]> = {
    success: true,
    count: result.length,
    message: `Top ${result.length} popular recipes.`,
    data: result,
  };
  return c.json(response);
});

// filter resep with multiple criteria
app.post("/api/v1/resep/filter", async (c) => {
  const body = await c.req.json();
  const { kategori, bahan, minSuka } = body;

  const criteria: { kategori?: string; bahan?: string; minSuka?: number } = {};
  if (kategori) criteria.kategori = kategori;
  if (bahan) criteria.bahan = bahan;
  if (minSuka !== undefined) criteria.minSuka = minSuka;

  const result = filterRecipes(RESEP_LIST, criteria);

  const response: ApiResponse<Resep[]> = {
    success: true,
    count: result.length,
    message: "Recipes filtered by criteria.",
    data: result.slice(0, 50), // Limit to 50 results
  };
  return c.json(response);
});

// mengambil resep berdasarkan id
app.get("/api/v1/resep/:id", (c) => {
  const id = c.req.param("id");
  const resep = RESEP_LIST.find((r) => r.id === id);
  if (!resep) {
    const response: ApiResponse<null> = {
      success: false,
      message: `resep not found by id ${id}.`,
    };
    return c.json(response, 404);
  }

  const response: ApiResponse<Resep> = {
    success: true,
    message: `resep found by id ${id}.`,
    data: resep,
  };
  return c.json(response);
});

// get all kategori
app.get("/api/v1/kategori", (c) => {
  const result = getAllCategories(RESEP_LIST);

  const response: ApiResponse<string[]> = {
    success: true,
    count: result.length,
    message: "All categories retrieved.",
    data: result,
  };
  return c.json(response);
});

// get stats
app.get("/api/v1/stats", (c) => {
  const result = getApiStats(RESEP_LIST);

  const response: ApiResponse<typeof result> = {
    success: true,
    message: "API statistics retrieved.",
    data: result,
  };
  return c.json(response);
});


/**
 *
 * Di Vercel (atau environment serverless lainnya), Anda tidak perlu menggunakan serve().
 * Anda hanya perlu mengekspor objek 'app' (handler Hono) agar Vercel dapat menggunakannya
 * untuk merespons request HTTP yang masuk.
 *
 * Kode 'serve' hanya digunakan untuk menjalankan server secara lokal.
 * Saya menggunakan kondisi untuk memisahkan logika lokal dan serverless.
 */
if (process.env.NODE_ENV === "development") {
  serve(
    {
      fetch: app.fetch,
      port: 3000,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    }
  );
}

export default app;