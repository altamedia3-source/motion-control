# Magnific Kling Motion Control - FULL

Aplikasi Next.js siap upload ke GitHub + Vercel.

## Fitur

- UI seperti panel Magnific/Kling
- Input API key
- Upload reference image
- Upload reference video
- Input URL publik alternatif
- Pilih model:
  - Kling 2.6 Standard
  - Kling 2.6 Pro
  - Kling 3 Standard
  - Kling 3 Pro
- Prompt optional
- Character orientation
- CFG scale
- Generate task
- Auto polling status
- Preview video hasil
- Raw response untuk debugging

## Cara Pakai Lokal

```bash
npm install
npm run dev
```

Buka:

```bash
http://localhost:3000
```

## Deploy ke Vercel

1. Upload semua file ke GitHub.
2. Import repository di Vercel.
3. Tambahkan Environment Variables:

```bash
MAGNIFIC_API_KEY=sk-mag-xxxx
```

Opsional untuk upload file lokal:

```bash
CLOUDINARY_CLOUD_NAME=nama_cloudinary
CLOUDINARY_UPLOAD_PRESET=unsigned_upload_preset
```

4. Deploy.

## Penting

Magnific/Kling API membutuhkan `image_url` dan `video_url` yang publik.
Karena itu upload lokal memakai Cloudinary unsigned upload.
Kalau tidak pakai Cloudinary, isi langsung Image URL dan Video URL publik di form.
