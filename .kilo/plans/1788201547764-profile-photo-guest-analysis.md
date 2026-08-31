# Analisis: Foto Profile Admin Tidak Muncul di Guest

## Ringkasan Temuan

Ada **1 bug terkonfirmasi** di backend dan **2 kemungkinan penyebab** untuk foto profile yang tidak muncul di guest.

---

## Bug Terkonfirmasi: `ProjectController::tambahGambar()` Simpan URL Penuh

**File:** `be/app/Http/Controllers/ProjectController.php:195`

```php
// SALAH: simpan full URL dengan APP_URL (biasanya localhost)
'gambar' => Storage::url($path),

// BENAR: simpan path relatif (konsisten dengan store())
'gambar' => $path,
```

**Dampak:**
- `ProjectController::store()` menyimpan path relatif: `project/xxx.jpg` → guest bisa akses
- `ProjectController::tambahGambar()` menyimpan full URL: `http://127.0.0.1:8000/storage/project/xxx.jpg` → guest dapat URL localhost yang broken
- Konsistensi hilang: gambar yang ditambah via fitur "tambah gambar" tidak bisa dilihat guest

**Bukti di kode:**
- `store()` baris 65: `$path = $file->store('project', 'public');` + simpan `$path`
- `tambahGambar()` baris 190: `$path = $file->store('project', 'public');` + simpan `Storage::url($path)`
- `hapusGambar()` baris 212: `str_replace('storage/', '', $gambar->gambar)` — juga rusak jika `gambar` berisi full URL

---

## Kemungkinan Penyebab Foto Profile Tidak Muncul

### 1. Storage link tidak dibuat di production

Frontend `getStorageUrl()` membentuk URL: `https://porto-be.dhilgege.my.id/storage/profile/xxx.jpg`

URL ini hanya bekerja jika Laravel `storage:link` sudah dijalankan di server production. Jika belum, `/storage/...`返回 404 dan gambar tidak muncul.

### 2. Admin dan guest menggunakan backend berbeda

- Frontend `.env`: `VITE_API_BASE_URL=https://porto-be.dhilgege.my.id/api`
- Backend local `.env`: `APP_URL=http://127.0.0.1:8000`

Jika admin menguji di lokal (`http://127.0.0.1:8000`) sedangkan guest membuka production (`https://porto-be.dhilgege.my.id`), mereka menggunakan database berbeda → foto yang diupload admin tidak ada di database production.

### 3. Flow data profile sudah benar (bukan bug frontend)

Trace data flow profile:
1. Admin upload → `ProfileController::update()` simpan `profile/xxx.jpg` (path relatif)
2. Guest fetch → `GuestController::index()` return `Profile::first()` dengan `foto`
3. Frontend → `getStorageUrl('profile/xxx.jpg')` → `https://porto-be.dhilgege.my.id/storage/profile/xxx.jpg`
4. `Sidebar.jsx` → `{profile?.foto && <img src={...} />}`

Tidak ada bug di flow frontend untuk profile photo. Jika `foto` ada di DB dan storage link aktif, foto akan muncul.

---

## Analisis Kode Terkait

| File | Peran | Status |
|------|-------|--------|
| `be/app/Http/Controllers/ProjectController.php:195` | Simpan gambar project | **BUG: pakai `Storage::url()`** |
| `be/app/Http/Controllers/ProfileController.php:43,89` | Simpan foto profile | OK: pakai `$file->store()` (path relatif) |
| `fe/src/services/portofolioService.js:5` | Fetch data guest | OK: `res.data.data ?? res.data` |
| `fe/src/components/guest/Sidebar.jsx:82-87` | Tampilkan foto profile | OK: cek `profile?.foto` |
| `fe/src/utils/formatUrl.js:1-5` | Bangun URL storage | OK: normalisasi path |
| `fe/src/context/PortofolioContext.jsx` | State management guest | OK |

---

## Prior Analysis yang Salah

Analisis sebelumnya (`1788199252477-guest-data-analysis.md`) mengklaim:
> `portofolioService` return `res.data` (whole Axios response)

**Ini salah.** Di Axios, `response.data` adalah **response body** (JSON yang di-parse), bukan seluruh objek response. Karena `GuestController` return JSON tanpa wrapper `data`, maka `res.data.data` = `undefined`, dan `res.data.data ?? res.data` mengembalikan body yang benar. Data destructuring di `Home.jsx` bekerja dengan benar.

---

## Rencana Perbaikan

### 1. Perbaiki `ProjectController::tambahGambar()` (WAJIB)

Ubah baris 195 dari:
```php
'gambar' => Storage::url($path),
```
Menjadi:
```php
'gambar' => $path,
```

Juga perbaiki `hapusGambar()` baris 212 agar konsisten menghapus file dengan path relatif.

### 2. Verifikasi Storage Link di Production

Pastikan `php artisan storage:link` sudah dijalankan di server production agar `/storage` mengarah ke `storage/app/public`.

### 3. Verifikasi Environment

Pastikan admin dan guest menggunakan backend yang sama. Cek:
- `APP_URL` di production `.env`
- `VITE_API_BASE_URL` dan `VITE_API_STORAGE_URL` di frontend `.env`
- Keduanya harus konsisten

### 4. Tambahkan Debug Log (opsional)

Tambahkan log di `GuestController::index()` untuk memastikan `Profile::first()` return data yang benar:
```php
Log::info('Guest portfolio', ['profile' => Profile::first()?->toArray()]);
```

---

## Validasi Setelah Perbaikan

1. Cek Network tab → `/portofolio` response harus berisi `profile.foto` dengan path relatif
2. Cek Network tab → `/project` response gambar harus berisi path relatif, bukan full URL
3. Buka URL storage langsung di browser: `https://porto-be.dhilgege.my.id/storage/profile/xxx.jpg` → harus return gambar
4. Hard refresh halaman guest → foto profile muncul di sidebar
5. Upload gambar project via "tambah gambar" → gambar muncul di guest
