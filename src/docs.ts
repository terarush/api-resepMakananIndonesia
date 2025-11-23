export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "API Resep Makanan Indonesia",
    version: "1.0.0",
    description: "API untuk mengakses resep makanan Indonesia",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  paths: {
    "/": {
      get: {
        summary: "Welcome message",
        responses: {
          200: {
            description: "Welcome message",
            content: {
              "text/plain": {
                example: "wellcome to api resepmakanan indonesia hehe",
              },
            },
          },
        },
      },
    },
    "/api/v1/resep": {
      get: {
        summary: "Dapatkan daftar semua resep",
        parameters: [
          {
            name: "kategori",
            in: "query",
            schema: { type: "string" },
            description: "Filter berdasarkan kategori",
          },
          {
            name: "sort_by",
            in: "query",
            schema: { type: "string", enum: ["suka"] },
            description: "Urutkan berdasarkan jumlah suka",
          },
        ],
        responses: {
          200: {
            description: "Daftar resep",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponseResepArray",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/reseo/{id}": {
      get: {
        summary: "Dapatkan resep berdasarkan ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID resep",
          },
        ],
        responses: {
          200: {
            description: "Resep ditemukan",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponseResep",
                },
              },
            },
          },
          404: {
            description: "Resep tidak ditemukan",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponseNull",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/resep/search": {
      get: {
        summary: "Cari resep berdasarkan bahan",
        parameters: [
          {
            name: "ingredients",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Bahan yang dicari, dipisahkan koma",
            example: "ayam,bawang,garam",
          },
        ],
        responses: {
          200: {
            description: "Hasil pencarian resep",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponseResepArray",
                },
              },
            },
          },
          400: {
            description: "Ingredients tidak disediakan",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponseNull",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/resep/kategori": {
      get: {
        summary: "Filter resep berdasarkan kategori",
        parameters: [
          {
            name: "kategori",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Kategori resep",
          },
        ],
        responses: {
          200: {
            description: "Resep berdasarkan kategori",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponseResepArray",
                },
              },
            },
          },
          400: {
            description: "Kategori tidak disediakan",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponseNull",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/resep/random": {
      get: {
        summary: "Dapatkan resep acak",
        responses: {
          200: {
            description: "Resep acak",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponseResep",
                },
              },
            },
          },
          404: {
            description: "Tidak ada resep tersedia",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponseNull",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/resep/populer": {
      get: {
        summary: "Dapatkan resep paling populer",
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
            description: "Jumlah resep yang dikembalikan",
          },
        ],
        responses: {
          200: {
            description: "Resep populer",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponseResepArray",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/kategori": {
      get: {
        summary: "Dapatkan daftar semua kategori",
        responses: {
          200: {
            description: "Daftar kategori",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponseStringArray",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/stats": {
      get: {
        summary: "Statistik API",
        responses: {
          200: {
            description: "Statistik API",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponseStats",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/resep/filter": {
      post: {
        summary: "Filter resep dengan kriteria ganda",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  kategori: { type: "string" },
                  bahan: { type: "string" },
                  minSuka: { type: "integer" },
                },
                example: {
                  kategori: "ayam",
                  bahan: "ayam,bawang",
                  minSuka: 100,
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Resep yang difilter",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponseResepArray",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ApiResponseResep: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: { $ref: "#/components/schemas/Resep" },
        },
      },
      ApiResponseResepArray: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          count: { type: "integer" },
          message: { type: "string" },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Resep" },
          },
        },
      },
      ApiResponseStringArray: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          count: { type: "integer" },
          message: { type: "string" },
          data: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
      ApiResponseNull: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
      },
      ApiResponseStats: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: { $ref: "#/components/schemas/Stats" },
        },
      },
      Resep: {
        type: "object",
        properties: {
          id: { type: "string" },
          nama: { type: "string" },
          kategori: { type: "string" },
          bahan: {
            type: "array",
            items: { type: "string" },
          },
          langkah: {
            type: "array",
            items: { type: "string" },
          },
          jumlah_suka: { type: "integer" },
          waktu_masak: { type: "string" },
          porsi: { type: "integer" },
          gambar: { type: "string" },
        },
      },
      Stats: {
        type: "object",
        properties: {
          totalRecipes: { type: "integer" },
          totalCategories: { type: "integer" },
          categories: {
            type: "array",
            items: { type: "string" },
          },
          averageLikes: { type: "integer" },
          mostPopularCategory: { type: "string" },
        },
      },
    },
  },
};
