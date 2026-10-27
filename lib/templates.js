import { rupiah, tanggalID } from "./dates.js";

const END = "Terima kasih 🙏";

function hariKeterlambatan(inv) {
  const now = Date.now();
  const due = new Date(inv.jatuh_tempo).getTime();
  const selisih = Math.ceil((now - due) / 86400_000);
  return Math.max(0, selisih);
}

// Tiga nada: halus -> tegas -> sangat_tegas
export function buatPesanNagih(level, inv) {
  const klien = inv.klien;
  const uang = rupiah(inv.jumlah);
  const jd = tanggalID(inv.jatuh_tempo);
  const item = inv.item || "jasa";
  const lewat = hariKeterlambatan(inv);
  const metode = inv.metode ? `Pembayaran ke: *${inv.metode}*\n` : "";

  if (level === "halus") {
    return (
      `Hai ${klien}, semoga sehat ya 🙏\n\n` +
      `Mau mengingatkan lembut soal pembayaran *${item}* sebesar *${uang}*,\n` +
      `jatuh temponya *${jd}*.\n\n` +
      `Kalau sudah ditransfer, boleh kirim bukti transfernya ya.\n\n` +
      `${metode}\n${END}`
    );
  }

  if (level === "tegas") {
    return (
      `Halo ${klien},\n\n` +
      `Invoice *${inv.id}* sebesar *${uang}* (${item}) belum dibayar.\n` +
      `Jatuh tempo *${jd}*${lewat > 0 ? `, sudah lewat *${lewat} hari*` : ""}.\n\n` +
      `Kalau bisa, dibayar *hari ini* ya. Kalau ada kendala, balas chat ini saja, kita cari solusi bersama.\n\n` +
      `${metode}\n${END}`
    );
  }

  if (level === "sangat_tegas") {
    return (
      `${klien}, ini pemberitahuan terakhir untuk invoice *${inv.id}*.\n\n` +
      `Sisa tagihan *${uang}* (${item}), sudah *${lewat} hari* melewati jatuh tempo ${jd}.\n\n` +
      `Kalau 3 hari ke depan tidak ada pembayaran atau respon, saya akan menganggap ini tidak beritikad baik, ` +
      `dan langkah resmi akan saya ambil agar pembayaran saya tetap diperjuangkan.\n\n` +
      `${metode}\n${END}`
    );
  }

  return null; // level tidak dikenal
}

// Ringkasan invoice untuk chat admin.
export function ringkasInvoice(inv) {
  return (
    `*${inv.id}*\n` +
    `Klien: ${inv.klien}\n` +
    `Total: ${rupiah(inv.jumlah)}\n` +
    `Item: ${inv.item}\n` +
    `Jatuh tempo: ${tanggalID(inv.jatuh_tempo)}\n` +
    (inv.metode ? `Pembayaran ke: ${inv.metode}\n` : "") +
    `Status: ${inv.status}`
  );
}
