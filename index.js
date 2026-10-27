// Demo runner: bikin invoice + tampilkan 3 nada reminder.
// Jalankan:  node --env-file=.env.local index.js   (atau tanpa env: node index.js)
import { buatInvoice } from "./lib/invoice.js";
import { buatPesanNagih, ringkasInvoice } from "./lib/templates.js";
import { listInvoices } from "./lib/store.js";

const hasil = buatInvoice({
  klien: "Warung Bu Todo",
  jumlah: 2_500_000,
  item: "desain banner Instagram (6 potong)",
  due: "+5 hari",
  metode: "BCA 1234567890 a.n. Kamu",
});

if (hasil.error) {
  console.error("GAGAL:", hasil.error);
  process.exit(1);
}

const inv = hasil.invoice;
const due = new Date(inv.jatuh_tempo);
const tanggalStr = due.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
const noWA = process.env.NO_WA_DEMO || "628xxxxxxxxxx";

console.log(`✅ Invoice dibuat:\n${ringkasInvoice(inv)}`);
console.log(`\nJadwal nagih:`);
inv.jadwal_reminder.forEach((r, i) => {
  const d = new Date(r.due).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  console.log(`  [${i + 1}] ${d} → nada: ${r.level}`);
});

// Untuk demo, paksa dua reminder pertama dianggap sudah dikirim
// supaya nada "tegas" dan "sangat_tegas" bisa dites sekarang.
inv.sent_reminder = ["halus", "tegas"];
console.log(`\n(= sim. 2 reminder dijalankan dulu)`);

console.log("\n" + "=".repeat(50));
console.log("CONTOH NADA SANGAT TEGAS (ke " + noWA + "):\n");
console.log(buatPesanNagih("sangat_tegas", inv));

console.log("=".repeat(50));
console.log("\nInvoice yang belum lunas saat ini:", listInvoices().length);
console.log(`\nDRY_RUN: tidak ada pesan terkirim. Untuk kirim WA asli, jalankan server webhook.`);
