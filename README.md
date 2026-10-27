# Nagih 💸

> Klien telat bayar, kamu cuma bisa nunggu? Biar **Nagih** yang ngomong. 🙅‍♂️

Asisten WhatsApp buat **nagih & invoicing** — dibuat khusus buat freelancer & usaha jasa kecil di Indonesia yang tiap akhir bulan selalu drama: "anter invoice dulu deh…", "nanti aku kabarin", lalu menghilang. 👻

**Nagih bikin nagihan gak canggung.** Invoice rapi di chat, reminder naik-turun nada (halus dulu, tegas kalau ngeyel), dan berhenti otomatis begitu klien bayar.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22-green)](package.json)
[![Status](https://img.shields.io/badge/status-MVP-orange)](#roadmap)

▶️ **[Lihat video demo](docs/demo.mp4)**

---

## Wkwkwk, ini permasalahan saya! 🙋‍♀️

Kalo kamu freelancer (desainer, katering, jahit, tutor, foto, apa aja) pasti kenal momen ini:

- ✅ Kerjaan beres, invoice dikirim
- ⏳ Jatuh tempo lewat, klien gak ada kabar
- 🫥 Nge-chat → "bentar ya, ujung minggu pasti" → **ujung minggu sdh, no respon**
- 😶 Kamu: mau nagih, tapiales males keliatan kepo atau galak. Ujungnya, **duit lu tergantung mood klien**.

Kalo diserang terus, masalahnya bukan duit doang — **mental nagih** ikut kandas. Makanya bot ini didesain biar nggak perlu kemampuan nagih "super", cukup jawab 3 pilihan nada.

## Solusi Nagih 🤖

1. 🧾 **Invoice ektstruktur langsung di WA** — klien, nominal, item, jatuh tempo, tujuan bayar. Gak perlu lu buka apps apa-apa.
2. 📬 **Reminder 3 nada (makin telat, makin tegas):**
   | Level | Kapan | Vibes |
   |---|---|---|
   | 🙏 `halus` | H-3 | "mau mengingatkan lembut, jangan di-bully ya" |
   | ✊ `tegas` | Hari-H + telat | "masih belum dibayar nih, bisa hari ini?" |
   | ⚖️ `sangat_tegas` | H+7 | "pesanan terakhir sebelum saya lapor" |
3. 🛑 **Auto-stop nagih** — begitu klien ketik `lunas INV-0001`, bot gak pernah spam lagi. Ketenangan mental kembali.

## Contoh output bot nyata

```text
INV-0001
Klien: Warung Bu Todo
Total: Rp 2.500.000
Item: desain banner Instagram
Jatuh tempo: 1 November 2026
Status: belum_bayar

Jadwal nagih:
  [1] 29 Okt → halus
  [2] 1 Nov  → tegas
  [3] 8 Nov  → sangat_tegas
```

## Struktur repo

| File | Fungsi |
|---|---|
| `index.js` | Demo runner: bikin invoice + tampil 3 nada |
| `lib/store.js` | Storage JSON (v1). Production: ganti DB. |
| `lib/invoice.js` | Buat invoice + jadwal reminder |
| `lib/templates.js` | 3 nada pesan nagih |
| `lib/dates.js` | Parsing tanggal bahasa Indonesia (`5 Nov`, `besok`, `+5 hari`, `minggu depan`) |
| `lib/format.js` | Markdown → format WhatsApp |
| `lib/fonnte.js` | Sender Fonnte (bisa ganti gateway resmi) |

## Quickstart

```bash
git clone https://github.com/jhonsonsmith694-pixel/nagih.git
cd nagih
npm run demo
```

## Roadmap 🗺️

- [ ] Webhook server + scheduler otomatis (reminder jalan sendiri, gak perlu diingetin)
- [ ] **QRIS dinamis** via Midtrans/Xendit — klien scan, `lunas` otomatis lewat webhook PSP
- [ ] Dashboard laporan bulanan (lunas / telat / outstanding)
- [ ] Tone bahasa daerah (Sunda, Jawa, betawis boyz gaya)
- [ ] Migrasi Fonnte → WhatsApp Cloud API resmi (Meta)

## Kontribusi ✨

PR welcome. Prioritas kontribusi:

- 🧪 Test buat `dates.js` & `templates.js` (paling butuh)
- 💬 Nada nagih baru (kreatif tapi tetap sopan)
- 📊 Dashboard kecil buat status invoice

## Filosofi 💭

Nagih gak melulu duit — itu soal **gak nge-ruin relationship**. Kebanyakan orang gagal nagih bukan karena pelit, tapi karena takut salah kata. Nagih bikin kata-katanya udah diracik.

## Lisensi

MIT
