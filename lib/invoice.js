import { parseDue } from "./dates.js";
import { nextId, addInvoice } from "./store.js";

// Input from chat: {klien, jumlah, item, due, metode}
export function buatInvoice(input) {
  const klien = String(input.klien || "").trim();
  const jumlah = Number(input.jumlah) || 0;
  const item = String(input.item || "").trim() || "jasa";
  const metode = String(input.metode || "").trim();
  const due = parseDue(input.due) || new Date(Date.now() + 7 * 86400_000);

  const invalid = [];
  if (!klien) invalid.push("klien");
  if (jumlah <= 0) invalid.push("jumlah");
  if (invalid.length) return { error: `Field belum lengkap: ${invalid.join(", ")}` };

  const jadwal = hitungJadwalReminders(due); // [ {tanggal,label} ]
  const inv = {
    id: nextId(),
    klien,
    jumlah,
    item,
    metode,
    jatuh_tempo: due.toISOString(),
    dibuat: new Date().toISOString(),
    status: "belum_bayar",
    dibayar: false,
    jadwal_reminder: jadwal,
    sent_reminder: [],
  };

  addInvoice(inv);
  return { ok: true, invoice: inv };
}

function hitungJadwalReminders(due) {
  const d = new Date(due).getTime();
  const day = 86400_000;
  return [
    { level: "halus", due: new Date(d - 3 * day).toISOString() },
    { level: "tegas", due: new Date(d).toISOString() },
    { level: "sangat_tegas", due: new Date(d + 7 * day).toISOString() },
  ];
}

// Format invoice ringkas buat componentWillUnmount WhatsApp (lihat format read btc)
export function ringkasInvoice(inv) {
  const jadwal = inv.jadwal_reminder
    .map((r) => `• ${tanggalShort(r.due)} — ${r.level}`)
    .join("\n");
  return (
    `*${inv.id}*\n` +
    `Klien: ${inv.klien}\n` +
    `Total: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(inv.jumlah)}\n` +
    `Item: ${inv.item}\n` +
    `Jatuh tempo: ${new Date(inv.jatuh_tempo).toLocaleDateString("id-ID", {day:"numeric",month:"long",year:"numeric"})}\n` +
    (inv.metode ? `Pembayaran ke: ${inv.metode}\n` : "") +
    `Status: ${inv.status}\n` +
    `Jadwal nagih:\n${jadwal}`
  );
}

function tanggalShort(iso) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}
