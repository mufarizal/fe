# Analisis: Data Guest Tidak Tampil vs Admin Bisa

## Temuan

### 1. Service yang dipakai Guest vs Admin berbeda pola return value

**Admin services** (`src/services/karirService.js`, `pendidikanService.js`, `projectService.js`, `sertifikatService.js`, `profileService.js`, `skillService.js`):
```js
return res.data.data;  // mengembalikan HANYA payload data
```

**Guest service** (`src/services/portofolioService.js`):
```js
return res.data;  // mengembalikan SELURUH response axios
```

### 2. Root cause: struktur data salah di `Home.jsx`

`Home.jsx` baris 36:
```js
const res = await portofolioService.get();
setData(res);
```

Bandingkan dengan admin page, misal `KarirList.jsx` baris 19:
```js
setItems(await karirService.getAll());
```

Karena `portofolioService` return `res.data`, maka `data` di `Home.jsx` berisi:
```js
{
  // properti axios response + backend response
  data: { profile, projects, karirs, pendidikans, sertifikats },
  status: 200,
  ...
}
```

Lalu di baris 61-68:
```js
const { profile, projects, skills, karirs, pendidikans, sertifikats } = data;
```

Destructuring ini **gagal** karena `profile` ada di `data.data.profile`, bukan di `data.profile`.

Hasilnya:
- `profile` = `undefined`
- `projects` = `undefined`
- `karirs` = `undefined`
- dst

Halaman menampilkan "Data tidak ditemukan." atau section kosong.

### 3. Kenapa admin bisa?

Admin pages memakai service yang sudah konsisten return `res.data.data`, jadi destructuring langsung mendapatkan data yang benar.

### 4. `ProjectDetail` guest

`src/pages/guest/ProjectDetail.jsx` memakai `projectService.getById(id)` yang return `res.data.data` (konsisten). Jadi data project detail seharusnya tampil dengan benar. Masalahnya hanya di `Home.jsx` yang memakai `portofolioService`.

## Solusi yang direkomendasikan

### Opsi A (disarankan): Perbaiki `portofolioService` agar konsisten

Ubah `src/services/portofolioService.js`:
```js
return res.data.data;  // konsisten dengan service-admin lainnya
```

Ini adalah perbaikan yang paling bersih dan konsisten dengan arsitektur service yang sudah ada.

### Opsi B: Destructuring ulang di `Home.jsx`

Ubah `Home.jsx` baris 61:
```js
const { profile, projects, skills, karirs, pendidikans, sertifikats } = data.data || {};
```

Tapi ini hanya workaround. Service tetep mengembalikan struktur yang tidak konsisten.

## Lingkup Perbaikan

Fokus ke folder guest dan service pendukungnya:
- `src/services/portofolioService.js` (WAJIB diubah - ini service yang dipakai guest)
- `src/pages/guest/Home.jsx`
- `src/pages/guest/ProjectDetail.jsx` (cek apakah ada issue serupa)

JANGAN ubah file admin karena tidak ada masalah di sana dan user menyatakan file admin "gaguna" untuk masalah ini.

## Validasi

1. Cek Network tab di browser untuk `/portofolio` endpoint
2. Pastikan response memiliki struktur `{ data: { profile, projects, ... } }`
3. Setelah perbaikan, pastikan `Home.jsx` berhasil destructure data dan menampilkan profil, projects, skills, karir, pendidikan, sertifikat
4. Bandingkan dengan admin page yang sudah working untuk memastikan konsistensi
