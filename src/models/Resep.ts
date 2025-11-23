export interface Resep {
  id: string;
  nama_resep: string;
  url_sumber: string;
  kategori: string;
  jumlah_suka: number;
  bahan: string[];
  langkah: string[];
}

export interface ApiResponse<T = Resep[]> {
  success: boolean;
  count?: number;
  message?: string;
  data?: T;
}
