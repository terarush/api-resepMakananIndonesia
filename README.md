# API Resep Makanan Indonesia

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

API untuk mengakses koleksi resep makanan tradisional Indonesia. Dibangun dengan Hono framework dan TypeScript, menyediakan berbagai endpoint untuk mengambil, mencari, dan memfilter resep berdasarkan berbagai kriteria.

## ✨ Fitur

- **Koleksi Resep Lengkap**: Akses ribuan resep makanan Indonesia
- **Pencarian Canggih**: Cari resep berdasarkan bahan, kategori, atau kriteria lainnya
- **Filter Fleksibel**: Filter resep berdasarkan kategori, bahan, dan popularitas
- **Statistik API**: Dapatkan informasi statistik tentang koleksi resep
- **Dokumentasi Interaktif**: Swagger UI untuk eksplorasi API
- **Respons Cepat**: Optimasi untuk performa tinggi
- **TypeScript**: Type safety dan pengembangan yang lebih baik

## 🛠️ Tech Stack

- **Framework**: [Hono](https://hono.dev/) - Fast web framework for Node.js
- **Language**: TypeScript
- **Runtime**: Node.js
- **Deployment**: Vercel
- **Documentation**: OpenAPI 3.0 / Swagger UI

## 📦 Instalasi

### Prasyarat

- Node.js (versi 18 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

1. Clone repository ini:
```bash
git clone https://github.com/mellow/api_resepmakanan-indonesia.git
cd api_resepmakanan-indonesia
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan dalam mode development:
```bash
npm run dev
```

4. Buka browser dan akses:
```
http://localhost:3000
```

## 🚀 Penggunaan

### Development Server

```bash
npm run dev
```

### Build untuk Production

```bash
npm run build
npm start
```

### Dokumentasi API

Akses dokumentasi interaktif Swagger UI di:
```
http://localhost:3000/docs
```

Atau dapatkan spesifikasi OpenAPI di:
```
http://localhost:3000/api
```

## 📚 API Endpoints

### Resep

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/resep` | Dapatkan semua resep (dengan filter opsional) |
| GET | `/api/v1/resep/:id` | Dapatkan resep berdasarkan ID |
| GET | `/api/v1/resep/search?ingredients=bawang,ayam` | Cari resep berdasarkan bahan |
| GET | `/api/v1/resep/kategori?kategori=ayam` | Filter resep berdasarkan kategori |
| GET | `/api/v1/resep/random` | Dapatkan resep acak |
| GET | `/api/v1/resep/populer?limit=10` | Dapatkan resep paling populer |
| POST | `/api/v1/resep/filter` | Filter resep dengan kriteria ganda |

### Kategori & Statistik

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/kategori` | Dapatkan daftar semua kategori |
| GET | `/api/v1/stats` | Dapatkan statistik API |

### Dokumentasi

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/docs` | Swagger UI untuk dokumentasi interaktif |
| GET | `/api` | Spesifikasi OpenAPI 3.0 |

### Parameter Query

- `kategori`: Filter berdasarkan kategori (ayam, nasi, dll)
- `sort_by`: Urutkan berdasarkan (suka)
- `ingredients`: Bahan yang dicari (dipisahkan koma)
- `limit`: Jumlah maksimal hasil (default: 10)

### Contoh Request

```bash
# Dapatkan semua resep ayam
curl "http://localhost:3000/api/v1/resep?kategori=ayam"

# Cari resep dengan bahan bawang dan ayam
curl "http://localhost:3000/api/v1/resep/search?ingredients=bawang,ayam"

# Dapatkan resep acak
curl "http://localhost:3000/api/v1/resep/random"

# Filter resep dengan kriteria ganda
curl -X POST "http://localhost:3000/api/v1/resep/filter" \
  -H "Content-Type: application/json" \
  -d '{"kategori": "ayam", "bahan": "bawang,garam", "minSuka": 100}'
```

## 📊 Struktur Data

### Resep Object

```typescript
interface Resep {
  id: string;
  nama: string;
  kategori: string;
  bahan: string[];
  langkah: string[];
  jumlah_suka: number;
  waktu_masak: string;
  porsi: number;
  gambar: string;
}
```

### Contoh Response

```json
{
  "success": true,
  "message": "Daftar resep berhasil diambil",
  "count": 2,
  "data": [
    {
      "id": "1",
      "nama": "Ayam Goreng",
      "kategori": "ayam",
      "bahan": ["1 kg ayam", "2 siung bawang putih", "1 sdt garam", "minyak goreng"],
      "langkah": ["Cuci ayam hingga bersih", "Haluskan bawang putih dan garam", "Lumuri ayam dengan bumbu", "Goreng ayam hingga matang"],
      "jumlah_suka": 150,
      "waktu_masak": "30 menit",
      "porsi": 4,
      "gambar": "https://example.com/ayam-goreng.jpg"
    }
  ]
}
```

## 🏗️ Struktur Proyek

```
api_resepmakanan-indonesia/
├── data/
│   └── indonesian_food_recipes.json    # Data resep
├── src/
│   ├── handlers/
│   │   └── ResepHandler.ts             # Handler untuk endpoint resep
│   ├── models/
│   │   └── Resep.ts                    # Interface TypeScript
│   ├── services/
│   │   └── DataLoader.ts               # Service untuk memuat data
│   ├── docs.ts                         # Spesifikasi OpenAPI
│   └── index.ts                        # Entry point aplikasi
├── package.json
├── tsconfig.json
├── vercel.json                         # Konfigurasi deployment Vercel
└── README.md
```

## 🚀 Deployment

Proyek ini dikonfigurasi untuk deployment di Vercel. Pastikan untuk:

1. Push kode ke repository GitHub
2. Connect repository ke Vercel
3. Deploy otomatis akan berjalan

Konfigurasi Vercel sudah tersedia di `vercel.json`.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan ikuti langkah berikut:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Panduan Kontribusi

- Pastikan kode mengikuti standar TypeScript
- Tambahkan dokumentasi untuk endpoint baru
- Update README jika diperlukan
- Test perubahan sebelum submit

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Kontak

- Project Link: [https://github.com/your-username/api_resepmakanan-indonesia](https://github.com/your-username/api_resepmakanan-indonesia)
- API Live Demo: [https://your-vercel-app.vercel.app](https://your-vercel-app.vercel.app)

---

⭐ Jika proyek ini bermanfaat, berikan star di GitHub!
